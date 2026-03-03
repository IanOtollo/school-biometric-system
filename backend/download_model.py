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
    if os.path.exists(MODEL_PATH):
        print(f"Model already exists at {MODEL_PATH}")
        return True

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
