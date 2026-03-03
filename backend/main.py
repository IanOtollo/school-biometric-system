import onnxruntime as ort
import os
import cv2
import numpy as np
import logging
from flask import Flask, request, jsonify
from PIL import Image
import io
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FaceVerificationEngine:
    def __init__(self, model_path):
        try:
            self.session = ort.InferenceSession(model_path)
            self.input_name = self.session.get_inputs()[0].name
            self.input_shape = self.session.get_inputs()[0].shape
            logger.info(f"Model loaded. Input shape: {self.input_shape}")
        except Exception as e:
            logger.error(f"Failed to load ONNX model: {e}")
            raise

    def preprocess_image(self, image_data):
        try:
            if isinstance(image_data, str):
                image_data = base64.b64decode(image_data)
            
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Determine if model expects NCHW or NHWC
            # shape[1] is usually C in NCHW, or H in NHWC
            # For ArcFace, 112x112 is standard. If 3 is at index 1, it's NCHW. If at index 3, it's NHWC.
            
            shape = self.input_shape
            if len(shape) == 4:
                if shape[1] == 3 or str(shape[1]).endswith('3'): # NCHW
                    expected_height = int(shape[2]) if isinstance(shape[2], (int, float)) else 112
                    expected_width = int(shape[3]) if isinstance(shape[3], (int, float)) else 112
                    is_nchw = True
                else: # NHWC
                    expected_height = int(shape[1]) if isinstance(shape[1], (int, float)) else 112
                    expected_width = int(shape[2]) if isinstance(shape[2], (int, float)) else 112
                    is_nchw = False
            else:
                expected_height, expected_width = 112, 112
                is_nchw = True

            logger.info(f"Targeting: {expected_height}x{expected_width}, NCHW: {is_nchw}")
            
            resized = cv2.resize(image_cv, (expected_width, expected_height))
            # ArcFace standard normalization: (pixel - 127.5) / 128.0
            normalized = (resized.astype(np.float32) - 127.5) / 128.0
            
            if is_nchw:
                data = np.transpose(normalized, (2, 0, 1))
            else:
                data = normalized
                
            batch = np.expand_dims(data, axis=0)
            logger.info(f"Final preprocessed shape: {batch.shape}")
            return batch.astype(np.float32)
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            raise

    def get_embedding(self, image_data):
        try:
            preprocessed = self.preprocess_image(image_data)
            output = self.session.run(None, {self.input_name: preprocessed})
            embedding = output[0].flatten()
            logger.info(f"Embedding extracted, shape: {embedding.shape}")
            return embedding
        except Exception as e:
            logger.error(f"Error getting embedding: {e}")
            raise

    def search_face(self, query_image_data, threshold=0.6):
        try:
            query_embedding = self.get_embedding(query_image_data)
            faces_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'faces_db')
            
            if not os.path.exists(faces_db_path):
                os.makedirs(faces_db_path)
                return None, 0

            best_match = None
            max_similarity = -1

            for entry in os.listdir(faces_db_path):
                entry_path = os.path.join(faces_db_path, entry)
                if os.path.isdir(entry_path):
                    # Look for image in folder
                    for file in os.listdir(entry_path):
                        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                            img_path = os.path.join(entry_path, file)
                            try:
                                with open(img_path, 'rb') as f:
                                    ref_image_data = f.read()
                                ref_embedding = self.get_embedding(ref_image_data)
                                
                                similarity = np.dot(query_embedding, ref_embedding) / (
                                    np.linalg.norm(query_embedding) * np.linalg.norm(ref_embedding)
                                )
                                
                                if similarity > max_similarity:
                                    max_similarity = similarity
                                    best_match = entry # The folder name is ID_NAME
                            except Exception as e:
                                logger.error(f"Error processing {img_path}: {e}")
            
            if best_match and max_similarity >= threshold:
                return best_match, float(max_similarity)
            return None, float(max_similarity)
        except Exception as e:
            logger.error(f"Error during face search: {e}")
            raise

    def register_face(self, user_id, name, image_data):
        try:
            faces_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'faces_db')
            user_folder = f"{user_id}_{name}"
            target_dir = os.path.join(faces_db_path, user_folder)
            
            if not os.path.exists(target_dir):
                os.makedirs(target_dir)
            
            if isinstance(image_data, str):
                image_data = base64.b64decode(image_data)
            
            # Save as JPG
            img = Image.open(io.BytesIO(image_data)).convert('RGB')
            file_path = os.path.join(target_dir, f"{user_folder}.jpg")
            img.save(file_path, "JPEG")
            logger.info(f"Registered user {user_id} at {file_path}")
            return True
        except Exception as e:
            logger.error(f"Error registering face: {e}")
            raise

# Initialize engine
engine = None

@app.route('/verify', methods=['POST'])
def verify():
    try:
        data = request.get_json()
        image = data.get('image1') or data.get('image') # Support both naming conventions
        
        if not image:
            return jsonify({'error': 'Missing image data'}), 400
        
        name, confidence = engine.search_face(image)
        
        if name:
            return jsonify({
                'status': 'Access Granted',
                'name': name,
                'confidence': confidence
            }), 200
        else:
            return jsonify({
                'status': 'Access Denied',
                'confidence': confidence
            }), 403
    except Exception as e:
        logger.error(f"Verification endpoint error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        image = data.get('image')
        user_id = data.get('user_id')
        name = data.get('name', 'Unknown')
        
        if not image or not user_id:
            return jsonify({'error': 'Missing image or user_id'}), 400
        
        engine.register_face(user_id, name, image)
        return jsonify({'status': 'Registered', 'user_id': user_id}), 200
    except Exception as e:
        logger.error(f"Registration endpoint error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Try local path first, then relative to script
    model_path = 'arcface.onnx'
    if not os.path.exists(model_path):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'arcface.onnx')
    
    if not os.path.exists(model_path):
        logger.error(f"Model file not found at {model_path}")
        exit(1)
        
    engine = FaceVerificationEngine(model_path)
    port = int(os.environ.get('PORT', 8000))
    logger.info(f"Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
