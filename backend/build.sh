#!/usr/bin/env bash
# Render build script for Smart Note Analyzer Backend

set -o errexit  # Exit on error

echo "🚀 Starting Render build process..."

# Update system packages
echo "📦 Updating system packages..."
apt-get update

# Install system dependencies
echo "🔧 Installing system dependencies..."
apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    libtesseract-dev \
    libleptonica-dev \
    pkg-config

# Verify Tesseract installation
echo "✅ Verifying Tesseract installation..."
tesseract --version

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Create demo data (optional)
echo "📊 Creating demo data..."
python manage.py create_demo_data || echo "Demo data creation skipped (command may not exist)"

echo "✅ Build completed successfully!"