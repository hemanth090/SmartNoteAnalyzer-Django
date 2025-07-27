import os
from django.core.files.storage import default_storage

try:
    import pytesseract
    from PIL import Image
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    print("Warning: Tesseract OCR not available. Image processing will be limited.")

class OCRExtractor:
    """Extract text from images using Tesseract OCR"""
    
    @staticmethod
    def extract_text_from_image(image_file):
        """Extract text from image file using OCR"""
        if not TESSERACT_AVAILABLE:
            raise ValueError("OCR functionality is not available. Tesseract OCR is not installed or configured properly.")
        
        # Save image temporarily
        file_path = default_storage.save(f'temp/{image_file.name}', image_file)
        full_path = default_storage.path(file_path)
        
        try:
            # Open image with PIL
            image = Image.open(full_path)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using Tesseract
            text = pytesseract.image_to_string(image, lang='eng')
            
            return OCRExtractor._clean_ocr_text(text)
            
        except Exception as e:
            print(f"OCR extraction error: {e}")
            raise ValueError(f"Unable to extract text from image: {str(e)}")
        finally:
            # Clean up temporary file
            if default_storage.exists(file_path):
                default_storage.delete(file_path)
    
    @staticmethod
    def _clean_ocr_text(text):
        """Clean OCR extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace and line breaks
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            if line:  # Skip empty lines
                cleaned_lines.append(line)
        
        # Join lines with single spaces
        cleaned_text = ' '.join(cleaned_lines)
        
        # Remove multiple spaces
        cleaned_text = ' '.join(cleaned_text.split())
        
        return cleaned_text.strip()
    
    @staticmethod
    def is_image_file(filename):
        """Check if file is a supported image format"""
        image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp'}
        return os.path.splitext(filename.lower())[1] in image_extensions