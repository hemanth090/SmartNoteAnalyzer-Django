import os
import fitz  # PyMuPDF
from pdfminer.high_level import extract_text
from django.core.files.storage import default_storage

class FileHandler:
    """Handle file processing for different formats"""
    
    @staticmethod
    def extract_text_from_file(file):
        """Extract text from uploaded file based on type"""
        file_extension = os.path.splitext(file.name)[1].lower()
        
        # Save file temporarily
        file_path = default_storage.save(f'temp/{file.name}', file)
        full_path = default_storage.path(file_path)
        
        try:
            if file_extension == '.txt':
                return FileHandler._extract_from_txt(full_path)
            elif file_extension == '.pdf':
                return FileHandler._extract_from_pdf(full_path)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
        finally:
            # Clean up temporary file
            if default_storage.exists(file_path):
                default_storage.delete(file_path)
    
    @staticmethod
    def _extract_from_txt(file_path):
        """Extract text from .txt file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except UnicodeDecodeError:
            # Try with different encoding
            with open(file_path, 'r', encoding='latin-1') as file:
                return file.read()
    
    @staticmethod
    def _extract_from_pdf(file_path):
        """Extract text from PDF using PyMuPDF (faster) with fallback to pdfminer"""
        try:
            # Try PyMuPDF first (faster)
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            
            if text.strip():
                return text
            else:
                # Fallback to pdfminer for complex PDFs
                return extract_text(file_path)
                
        except Exception as e:
            print(f"PDF extraction error: {e}")
            # Fallback to pdfminer
            try:
                return extract_text(file_path)
            except Exception as e2:
                print(f"Fallback PDF extraction error: {e2}")
                raise ValueError("Unable to extract text from PDF")
    
    @staticmethod
    def clean_text(text):
        """Clean and normalize extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Remove special characters that might interfere with AI processing
        text = text.replace('\x00', '')  # Remove null characters
        text = text.replace('\ufffd', '')  # Remove replacement characters
        
        # Limit text length to prevent API issues
        max_length = 10000  # Adjust based on API limits
        if len(text) > max_length:
            text = text[:max_length] + "... [truncated]"
        
        return text.strip()