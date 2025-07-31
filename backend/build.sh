#!/usr/bin/env bash
# Render build script for Smart Note Analyzer Backend

set -o errexit  # Exit on error

echo "🚀 Starting Render build process..."

# Try to install system dependencies for OCR (may fail on Render)
echo "🔧 Attempting to install system dependencies..."
if command -v apt-get &> /dev/null; then
    echo "Found apt-get, installing Tesseract..."
    apt-get update || echo "apt-get update failed, continuing..."
    apt-get install -y tesseract-ocr tesseract-ocr-eng libtesseract-dev libleptonica-dev || echo "Tesseract installation failed, OCR will be unavailable"
else
    echo "apt-get not available, skipping system package installation"
fi

# Verify Tesseract installation
echo "✅ Checking Tesseract installation..."
if command -v tesseract &> /dev/null; then
    tesseract --version
    echo "✅ Tesseract is available"
else
    echo "⚠️ Tesseract not found - OCR functionality will be disabled"
fi

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