#!/usr/bin/env python3
"""
Post-deployment script to install Tesseract OCR if possible
"""

import subprocess
import sys
import os

def install_tesseract():
    """Try to install Tesseract OCR"""
    print("🔧 Attempting to install Tesseract OCR...")
    
    try:
        # Check if we're on a system with apt-get
        result = subprocess.run(['which', 'apt-get'], capture_output=True)
        if result.returncode == 0:
            print("Found apt-get, attempting installation...")
            
            # Update package list
            subprocess.run(['apt-get', 'update'], check=False)
            
            # Install Tesseract
            result = subprocess.run([
                'apt-get', 'install', '-y', 
                'tesseract-ocr', 'tesseract-ocr-eng', 
                'libtesseract-dev', 'libleptonica-dev'
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Tesseract installed successfully!")
                return True
            else:
                print(f"❌ Tesseract installation failed: {result.stderr}")
                return False
        else:
            print("❌ apt-get not available, cannot install Tesseract")
            return False
            
    except Exception as e:
        print(f"❌ Error installing Tesseract: {e}")
        return False

def verify_tesseract():
    """Verify Tesseract installation"""
    try:
        result = subprocess.run(['tesseract', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Tesseract verified: {result.stdout.split()[1]}")
            return True
        else:
            print("❌ Tesseract verification failed")
            return False
    except Exception as e:
        print(f"❌ Error verifying Tesseract: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Tesseract OCR Installation Script")
    print("=" * 40)
    
    # Check if already installed
    if verify_tesseract():
        print("✅ Tesseract is already installed and working!")
        sys.exit(0)
    
    # Try to install
    if install_tesseract():
        if verify_tesseract():
            print("🎉 Tesseract installation completed successfully!")
            sys.exit(0)
    
    print("⚠️ Tesseract installation failed - OCR will be unavailable")
    print("📄 PDF and TXT file processing will still work")
    sys.exit(1)