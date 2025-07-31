from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from django.conf import settings

from .models import NoteAnalysis, NoteComparison
from .serializers import (
    NoteAnalysisSerializer, NoteComparisonSerializer,
    TextInputSerializer, FileUploadSerializer, ComparisonInputSerializer
)
from .utils.groq_ai import GroqAIProcessor
from .utils.file_handler import FileHandler

class HealthCheckView(APIView):
    """Health check endpoint - minimal and bulletproof"""
    
    def get(self, request):
        # Always return 200 OK - no exceptions allowed
        return Response({
            'status': 'healthy',
            'message': 'Smart Note Analyzer API is running',
            'version': '1.0.0'
        }, status=status.HTTP_200_OK)



class AnalyzeTextView(APIView):
    """Analyze text input directly"""
    
    def post(self, request):
        serializer = TextInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        text = serializer.validated_data['text']
        cleaned_text = FileHandler.clean_text(text)
        
        if not cleaned_text:
            return Response(
                {'error': 'No valid text provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Initialize AI processor
            ai_processor = GroqAIProcessor()
            
            # Get analysis
            analysis = ai_processor.analyze_note(cleaned_text)
            topic_graph = ai_processor.generate_topic_graph(cleaned_text)
            quiz_questions = ai_processor.generate_quiz(cleaned_text)
            
            # Ensure session exists
            if not request.session.session_key:
                request.session.create()
            
            # Save to database with session isolation
            note_analysis = NoteAnalysis.objects.create(
                session_key=request.session.session_key,
                original_text=cleaned_text,
                summary=analysis['summary'],
                key_points=analysis['key_points'],
                difficulty=analysis['difficulty'],
                bloom_level=analysis['bloom_level'],
                topic_graph=topic_graph,
                quiz_questions=quiz_questions,
                tags=analysis['tags'],
                learning_objectives=analysis.get('learning_objectives', []),
                prerequisites=analysis.get('prerequisites', []),
                applications=analysis.get('applications', [])
            )
            
            # Return response
            response_data = {
                'id': note_analysis.id,
                'summary': analysis['summary'],
                'key_points': analysis['key_points'],
                'difficulty': analysis['difficulty'],
                'bloom_level': analysis['bloom_level'],
                'topic_graph': topic_graph,
                'quiz_questions': quiz_questions,
                'tags': analysis['tags'],
                'learning_objectives': analysis.get('learning_objectives', []),
                'prerequisites': analysis.get('prerequisites', []),
                'applications': analysis.get('applications', []),
                'created_at': note_analysis.created_at
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Analysis failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AnalyzeFileView(APIView):
    """Analyze uploaded file (PDF, TXT, or image)"""
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        serializer = FileUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = serializer.validated_data['file']
        
        try:
            # Extract text based on file type
            from .utils.cloud_ocr import free_ocr
            
            if free_ocr.is_image_file(uploaded_file.name):
                # Use FREE OCR for images - no cost!
                text = free_ocr.extract_text_from_image(uploaded_file)
            else:
                # Use file handler for PDF/TXT
                text = FileHandler.extract_text_from_file(uploaded_file)
            
            cleaned_text = FileHandler.clean_text(text)
            
            if not cleaned_text:
                return Response(
                    {'error': 'No text could be extracted from the file'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Process with AI (same as text analysis)
            ai_processor = GroqAIProcessor()
            
            analysis = ai_processor.analyze_note(cleaned_text)
            topic_graph = ai_processor.generate_topic_graph(cleaned_text)
            quiz_questions = ai_processor.generate_quiz(cleaned_text)
            
            # Ensure session exists
            if not request.session.session_key:
                request.session.create()
            
            # Save to database with session isolation
            note_analysis = NoteAnalysis.objects.create(
                session_key=request.session.session_key,
                original_text=cleaned_text,
                summary=analysis['summary'],
                key_points=analysis['key_points'],
                difficulty=analysis['difficulty'],
                bloom_level=analysis['bloom_level'],
                topic_graph=topic_graph,
                quiz_questions=quiz_questions,
                tags=analysis['tags'],
                learning_objectives=analysis.get('learning_objectives', []),
                prerequisites=analysis.get('prerequisites', []),
                applications=analysis.get('applications', [])
            )
            
            response_data = {
                'id': note_analysis.id,
                'summary': analysis['summary'],
                'key_points': analysis['key_points'],
                'difficulty': analysis['difficulty'],
                'bloom_level': analysis['bloom_level'],
                'topic_graph': topic_graph,
                'quiz_questions': quiz_questions,
                'tags': analysis['tags'],
                'learning_objectives': analysis.get('learning_objectives', []),
                'prerequisites': analysis.get('prerequisites', []),
                'applications': analysis.get('applications', []),
                'created_at': note_analysis.created_at,
                'extracted_text': cleaned_text[:500] + '...' if len(cleaned_text) > 500 else cleaned_text
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            error_message = str(e)
            
            # Provide specific error messages
            if 'Unsupported file type' in error_message:
                return Response(
                    {
                        'error': 'Unsupported file format.',
                        'message': 'Please upload PDF, TXT, or image files.',
                        'supported_formats': ['PDF', 'TXT', 'PNG', 'JPG', 'JPEG', 'GIF', 'BMP', 'TIFF', 'WEBP']
                    }, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif 'OCR services are temporarily unavailable' in error_message:
                return Response(
                    {
                        'error': 'OCR service temporarily unavailable.',
                        'message': 'Please try again in a moment or upload PDF/TXT files instead.',
                        'supported_formats': ['PDF', 'TXT', 'Images (when OCR is available)']
                    }, 
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            else:
                return Response(
                    {'error': f'File processing failed: {error_message}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

class CompareNotesView(APIView):
    """Compare two notes semantically"""
    
    def post(self, request):
        serializer = ComparisonInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        note1 = FileHandler.clean_text(serializer.validated_data['note1'])
        note2 = FileHandler.clean_text(serializer.validated_data['note2'])
        
        if not note1 or not note2:
            return Response(
                {'error': 'Both notes must contain valid text'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            ai_processor = GroqAIProcessor()
            comparison = ai_processor.compare_notes(note1, note2)
            
            # Ensure session exists
            if not request.session.session_key:
                request.session.create()
            
            # Save comparison to database with session isolation
            note_comparison = NoteComparison.objects.create(
                session_key=request.session.session_key,
                note1_text=note1,
                note2_text=note2,
                similarity_score=comparison['similarity_score'],
                comparison_summary=comparison['comparison_summary']
            )
            
            response_data = {
                'id': note_comparison.id,
                'similarity_score': comparison['similarity_score'],
                'comparison_summary': comparison['comparison_summary'],
                'created_at': note_comparison.created_at
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Comparison failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AnalysisHistoryView(APIView):
    """Get analysis history for current session"""
    
    def get(self, request):
        try:
            # Ensure session exists
            if not request.session.session_key:
                request.session.create()
            
            # Get recent analyses for this session only
            analyses = NoteAnalysis.objects.filter(
                session_key=request.session.session_key
            ).order_by('-created_at')[:20]
            
            comparisons = NoteComparison.objects.filter(
                session_key=request.session.session_key
            ).order_by('-created_at')[:10]
            
            analyses_data = NoteAnalysisSerializer(analyses, many=True).data
            comparisons_data = NoteComparisonSerializer(comparisons, many=True).data
            
            return Response({
                'analyses': analyses_data,
                'comparisons': comparisons_data,
                'session_info': {
                    'session_key': request.session.session_key,
                    'total_analyses': analyses.count(),
                    'total_comparisons': comparisons.count()
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch history: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )