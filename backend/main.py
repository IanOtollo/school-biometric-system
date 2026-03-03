import onnxruntime as ort
import cv2
import numpy as np
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class FaceVerification:
    def __init__(self, model_path):
        self.session = ort.InferenceSession(model_path)

    def preprocess(self, image):
        # Resize and normalize the image
        try:
            image = cv2.resize(image, (224, 224))  # Adjust size for your model
            image = image.astype(np.float32) / 255.0  # Normalize to [0, 1]
            image = np.transpose(image, (2, 0, 1))  # Change to CHW format
            image = np.expand_dims(image, axis=0)  # Add batch dimension
            return image
        except Exception as e:
            logging.error(f"Error in preprocessing image: {e}")
            raise

    def verify(self, image1, image2):
        try:
            img1 = self.preprocess(image1)
            img2 = self.preprocess(image2)
            # Perform inference
            output1 = self.session.run(None, {"input": img1})[0]
            output2 = self.session.run(None, {"input": img2})[0]
            # Calculate cosine similarity
            similarity = np.dot(output1, output2) / (np.linalg.norm(output1) * np.linalg.norm(output2))
            return similarity
        except Exception as e:
            logging.error(f"Verification failed: {e}")
            raise

    def register(self, image):
        try:
            embedding = self.preprocess(image)
            # Save embedding logic here
            return embedding
        except Exception as e:
            logging.error(f"Registration failed: {e}")
            raise

# Usage example
if __name__ == '__main__':
    verifier = FaceVerification('path_to_your_onnx_model.onnx')
    # Load images
    image1 = cv2.imread('path_to_image1.jpg')
    image2 = cv2.imread('path_to_image2.jpg')
    similarity_score = verifier.verify(image1, image2)
    print(f'Similarity score: {similarity_score}')
