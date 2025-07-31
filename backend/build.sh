#!/usr/bin/env bash
# Render build script for Smart Note Analyzer Backend

set -o errexit  # Exit on error

echo "🚀 Starting Render build process..."

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
echo "⚠️  Note: Tesseract OCR will be installed automatically by Render"