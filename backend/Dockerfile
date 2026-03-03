# Use a slim Python image for a smaller footprint
FROM python:3.11-slim

# Install OS-level dependencies for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Railway injects PORT env var; Flask needs to listen on it
ENV PORT=8000
EXPOSE $PORT

# Download model (if MODEL_URL is set) then start Flask
CMD python download_model.py && python main.py
