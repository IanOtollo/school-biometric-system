import os
import shutil
import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="School Biometric API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "faces_db"
MODEL_PATH = "arcface.onnx"
os.makedirs(DB_PATH, exist_ok=True)

# Load Haar Cascade for Face Detection (Built-in to OpenCV)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Initialize ONNX Runtime for ArcFace
session = None
if os.path.exists(MODEL_PATH):
    session = ort.InferenceSession(MODEL_PATH)

def get_face_embedding(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        return None
    
    # Get the first face (x, y, w, h)
    (x, y, w, h) = faces[0]
    
    # Crop and Resize to 112x112 (Standard for ArcFace/MobileFaceNet)
    face_crop = image[y:y+h, x:x+w]
    if face_crop.size == 0: return None
    
    face_resized = cv2.resize(face_crop, (112, 112))
    face_normalized = (face_resized.astype(np.float32) - 127.5) / 128.0
    face_input = np.transpose(face_normalized, (2, 0, 1)) # HWC to CHW
    face_input = np.expand_dims(face_input, axis=0) # Add batch dim
    
    if session:
        inputs = {session.get_inputs()[0].name: face_input}
        embedding = session.run(None, inputs)[0]
        return embedding[0]
    return None

def load_known_faces():
    known_embeddings = []
    known_names = []
    
    if not os.path.exists(DB_PATH): return [], []
    
    for name in os.listdir(DB_PATH):
        user_dir = os.path.join(DB_PATH, name)
        if os.path.isdir(user_dir):
            for filename in os.listdir(user_dir):
                if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                    path = os.path.join(user_dir, filename)
                    image = cv2.imread(path)
                    if image is None: continue
                    embedding = get_face_embedding(image)
                    if embedding is not None:
                        known_embeddings.append(embedding)
                        known_names.append(name)
    return known_embeddings, known_names

@app.post("/register")
async def register_face(name: str, file: UploadFile = File(...)):
    user_dir = os.path.join(DB_PATH, name)
    os.makedirs(user_dir, exist_ok=True)
    
    file_path = os.path.join(user_dir, f"{name}.jpg")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"message": f"SCAN & STORE SUCCESS: {name} is registered.", "status": "success"}

@app.post("/verify")
async def verify_face(file: UploadFile = File(...)):
    if not session:
        raise HTTPException(status_code=500, detail="Recognition model not found. Please ensure arcface.onnx is in the backend folder.")

    temp_path = "temp_verify.jpg"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        image = cv2.imread(temp_path)
        if image is None: return {"status": "error", "message": "Invalid image data."}
        
        unknown_embedding = get_face_embedding(image)
        
        if unknown_embedding is None:
            return {"status": "error", "message": "No face detected in scan."}
        
        known_embeddings, known_names = load_known_faces()
        
        if not known_embeddings:
            return {"status": "access_denied", "name": "Unknown (Database Empty)"}
        
        # Compare using Cosine Similarity
        best_match = None
        max_sim = -1
        
        for i, known_emb in enumerate(known_embeddings):
            sim = np.dot(unknown_embedding, known_emb) / (np.linalg.norm(unknown_embedding) * np.linalg.norm(known_emb))
            if sim > max_sim:
                max_sim = sim
                best_match = known_names[i]
        
        # Threshold (0.5-0.6 usually good for ArcFace)
        if max_sim > 0.45: # Slightly lower threshold for better UX in schools
            return {"status": "access_granted", "name": best_match, "confidence": float(max_sim)}
        else:
            return {"status": "access_denied", "name": "Unknown", "confidence": float(max_sim)}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
