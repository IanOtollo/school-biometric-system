import onnxruntime as ort
import numpy as np
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_model(model_path):
    try:
        session = ort.InferenceSession(model_path)
        logging.info("Model loaded successfully.")
        return session
    except Exception as e:
        logging.error(f"Failed to load model: {e}")
        raise

def preprocess_input(input_data):
    if input_data.shape != (1, 112, 112, 3):
        logging.error(f"Input shape is incorrect: {input_data.shape}. Expected shape is (1, 112, 112, 3).")
        raise ValueError("Input shape is incorrect.")
    logging.info("Input data preprocessed successfully.")
    return input_data

def predict(model, input_data):
    try:
        input_name = model.get_inputs()[0].name
        result = model.run(None, {input_name: input_data})
        logging.info(f"Prediction made successfully: {result}")
        return result
    except Exception as e:
        logging.error(f"Prediction failed: {e}")
        raise

def main():
    model_path = 'path/to/your/model.onnx' # Update this to your ONNX model path
    input_data = np.random.rand(1, 112, 112, 3).astype(np.float32)  # Dummy input for demonstration

    model = load_model(model_path)
    preprocessed_data = preprocess_input(input_data)
    predictions = predict(model, preprocessed_data)

if __name__ == "__main__":
    main()