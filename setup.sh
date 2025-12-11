#!/bin/bash

# School Biometric Access System - Quick Setup Script
# This script automates the initial setup process

echo "🔐 School Biometric Access System - Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/models
mkdir -p src
echo ""

# Download face-api models
echo "🤖 Downloading face recognition models..."
echo "This may take a few minutes..."
cd public/models

echo "  → Downloading SSD MobileNet..."
wget -q https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json
wget -q https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1

echo "  → Downloading Face Landmarks..."
wget -q https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
wget -q https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

echo "  → Downloading Face Recognition..."
wget -q https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
wget -q https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
wget -q https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2

cd ../..
echo "✅ Models downloaded successfully"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit .env file with your Supabase credentials"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Run the SQL in database-schema.sql in your Supabase SQL Editor"
echo "3. Update .env file with your Supabase credentials"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed instructions, see README.md"
echo ""
echo "Happy coding! 🚀"
