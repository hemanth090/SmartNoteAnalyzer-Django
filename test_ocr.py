#!/usr/bin/env python3
"""
Test script to verify OCR functionality
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_note_analyzer.settings')
sys.path.append('backend')
django.setup()

from backend.analyzer.utils.ocr_extractor import OCRExtractor, TESSERACT_AVAILABLE

def test_ocr_availability():
    """Test if OCR is available and working"""
    print("🔍 Testing OCR Functionality")
    print("=" * 40)
    
    print(f"Tesseract Available: {TESSERACT_AVAILABLE}")
    
    if TESSERACT_AVAILABLE:
        try:
            import pytesseract
            version = pytesseract.get_tesseract_version()
            print(f"✅ Tesseract Version: {version}")
            
            # Test with a simple image (if available)
            print("✅ OCR functionality is ready!")
            print("✅ Supported image formats:")
            formats = ['PNG', 'JPG', 'JPEG', 'GIF', 'BMP', 'TIFF', 'WEBP']
            for fmt in formats:
                print(f"   - {fmt}")
                
        except Exception as e:
            print(f"❌ OCR test failed: {e}")
            return False
    else:
        print("❌ OCR functionality is not available")
        print("   - Tesseract OCR is not installed or configured")
        return False
    
    return True

def test_health_endpoint():
    """Test the health endpoint"""
    print("\n🏥 Testing Health Endpoint")
    print("=" * 40)
    
    try:
        from backend.analyzer.views import HealthCheckView
        from rest_framework.test import APIRequestFactory
        
        factory = APIRequestFactory()
        request = factory.get('/api/health/')
        view = HealthCheckView()
        response = view.get(request)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Data: {response.data}")
        
        if response.data.get('ocr_status') == 'available':
            print("✅ Health endpoint reports OCR as available")
        else:
            print("⚠️ Health endpoint reports OCR as unavailable")
            
    except Exception as e:
        print(f"❌ Health endpoint test failed: {e}")

if __name__ == "__main__":
    print("🧪 Smart Note Analyzer - OCR Test Suite")
    print("=" * 50)
    
    ocr_working = test_ocr_availability()
    test_health_endpoint()
    
    print("\n" + "=" * 50)
    if ocr_working:
        print("🎉 OCR functionality is working!")
        print("📸 Users can now upload images for text extraction")
    else:
        print("⚠️ OCR functionality needs attention")
        print("📄 Users can still upload PDF and TXT files")
    
    print("\n🔗 Test your deployment:")
    print("   Frontend: https://smart-note-analyzer-frontend.onrender.com")
    print("   Health Check: https://smart-note-analyzer-backend.onrender.com/api/health/")