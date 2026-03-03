import onnxruntime as ort
import cv2
import numpy as np
import logging
from flask import Flask, request, jsonify
from PIL import Image
import io
import base64

app = Flask(__name__)
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
            
            # Get expected dimensions from model input shape
            expected_height = int(self.input_shape[2]) if len(self.input_shape) > 2 else 112
            expected_width = int(self.input_shape[3]) if len(self.input_shape) > 3 else 112
            
            # Resize to match model input
            resized = cv2.resize(image_cv, (expected_width, expected_height))
            
            # Normalize to [0, 1]
            normalized = resized.astype(np.float32) / 255.0
            
            # Convert to CHW format if needed, or keep HWC based on model requirement
            # Most modern models expect: (1, 3, H, W) or (1, H, W, 3)
            # This assumes (1, 3, 112, 112) format
            transposed = np.transpose(normalized, (2, 0, 1))
            batch = np.expand_dims(transposed, axis=0)
            
            logger.info(f"Preprocessed image shape: {batch.shape}")
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

    def verify_face(self, image1_data, image2_data, threshold=0.6):
        try:
            embedding1 = self.get_embedding(image1_data)
            embedding2 = self.get_embedding(image2_data)
            
            # Calculate cosine similarity
            similarity = np.dot(embedding1, embedding2) / (
                np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
            )
            
            is_match = similarity >= threshold
            logger.info(f"Similarity: {similarity:.4f}, Match: {is_match}")
            
            return {
                'match': bool(is_match),
                'similarity': float(similarity),
                'threshold': threshold
            }
        except Exception as e:
            logger.error(f"Error during face verification: {e}")
            raise

# Initialize engine
engine = None

@app.route('/verify', methods=['POST'])
def verify():
    try:
        data = request.get_json()
        image1 = data.get('image1')
        image2 = data.get('image2')
        
        if not image1 or not image2:
            return jsonify({'error': 'Missing image data'}), 400
        
        result = engine.verify_face(image1, image2)
        
        if result['match']:
            return jsonify({'status': 'Access Granted', 'similarity': result['similarity']}), 200
        else:
            return jsonify({'status': 'Access Denied', 'similarity': result['similarity']}), 403
    except Exception as e:
        logger.error(f"Verification endpoint error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        image = data.get('image')
        user_id = data.get('user_id')
        
        if not image or not user_id:
            return jsonify({'error': 'Missing image or user_id'}), 400
        
        embedding = engine.get_embedding(image)
        
        # TODO: Save embedding to database
        return jsonify({'status': 'Registered', 'user_id': user_id}), 200
    except Exception as e:
        logger.error(f"Registration endpoint error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    model_path = 'path/to/your/model.onnx'
    engine = FaceVerificationEngine(model_path)
    app.run(host='0.0.0.0', port=8000, debug=False)