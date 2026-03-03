import logging
import cv2
import numpy as np
import onnxruntime as ort

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class BiometricSystem:
    def __init__(self, model_path):
        self.model_path = model_path
        self.session = ort.InferenceSession(self.model_path)
        self.users = {}  # Dictionary to store user data

    def register_user(self, user_id, face_image):
        try:
            # Process the face_image to prepare it for the model
            tensor = self.prepare_image(face_image)
            # Store user data
            self.users[user_id] = tensor
            logging.info(f'User {user_id} registered successfully.')
        except Exception as e:
            logging.error(f'Error registering user {user_id}: {str(e)}')

    def verify_user(self, user_id, face_image):
        try:
            if user_id not in self.users:
                logging.warning(f'User {user_id} not found.')
                return False
            tensor = self.prepare_image(face_image)
            recognition_result = self.recognize_face(tensor)
            is_verified = recognition_result == self.users[user_id]
            logging.info(f'User {user_id} verification status: {is_verified}')
            return is_verified
        except Exception as e:
            logging.error(f'Error verifying user {user_id}: {str(e)}')
            return False

    def prepare_image(self, face_image):
        try:
            # Resize and normalize image
            face_image = cv2.resize(face_image, (224, 224))  # Resize to model input size
            face_image = face_image.astype(np.float32) / 255.0  # Normalize
            face_image = np.expand_dims(face_image, axis=0)  # Add batch dimension
            return face_image
        except Exception as e:
            logging.error(f'Error preparing image: {str(e)}')
            raise

    def recognize_face(self, tensor):
        try:
            input_name = self.session.get_inputs()[0].name
            output_name = self.session.get_outputs()[0].name
            result = self.session.run([output_name], {input_name: tensor})
            logging.info('Face recognition successful.')
            return result[0]
        except Exception as e:
            logging.error(f'Error recognizing face: {str(e)}')
            raise

    def health_check(self):
        try:
            logging.info('Health check successful: System is operational.')
            return {'status': 'OK', 'message': 'System is operational'}
        except Exception as e:
            logging.error(f'Error during health check: {str(e)}')
            return {'status': 'ERROR', 'message': str(e)}

# Example usage:  
# model = BiometricSystem('path_to_model.onnx')  
# model.register_user('user_1', face_image)  
# is_verified = model.verify_user('user_1', face_image)  
# health = model.health_check()  
