#!/usr/bin/env python3
"""
Downloads the ArcFace ONNX model from the URL set in MODEL_URL env var.
Run this at container startup if the model is not bundled in the image.
"""

import os
import sys
import urllib.request

MODEL_URL = os.environ.get('MODEL_URL', '')
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'arcface.onnx')

def download_model():
    # Allow manual override for re-downloads
    if os.environ.get('FORCE_DOWNLOAD', '').lower() == 'true':
        if os.path.exists(MODEL_PATH):
            print(f"FORCE_DOWNLOAD is true. Deleting existing model at {MODEL_PATH}...")
            os.remove(MODEL_PATH)

    # If the file exists, check if it's actually a model (not a 0-byte or small pointer file)
    if os.path.exists(MODEL_PATH):
        file_size = os.path.getsize(MODEL_PATH)
        if file_size > 10 * 1024 * 1024:  # At least 10MB
            print(f"Model already exists at {MODEL_PATH} ({file_size} bytes)")
            return True
        else:
            print(f"Existing model file is too small ({file_size} bytes). Overwriting...")

    if not MODEL_URL:
        print("ERROR: MODEL_URL env variable not set and model not found locally.")
        return False

    print(f"Downloading model from {MODEL_URL} ...")
    try:
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print(f"Model downloaded to {MODEL_PATH}")
        return True
    except Exception as e:
        print(f"Failed to download model: {e}")
        return False

if __name__ == '__main__':
    if not download_model():
        sys.exit(1)
