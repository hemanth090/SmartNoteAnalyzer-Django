from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import NoteAnalysis, NoteComparison

class AnalyzerAPITestCase(APITestCase):
    
    def test_analyze_text_endpoint(self):
        """Test text analysis endpoint"""
        url = reverse('analyze-text')
        data = {'text': 'This is a test note about photosynthesis.'}
        
        # This will fail without Groq API key, but tests the endpoint structure
        response = self.client.post(url, data, format='json')
        
        # Should return 500 due to missing API key, but endpoint should exist
        self.assertIn(response.status_code, [200, 500])
    
    def test_compare_notes_endpoint(self):
        """Test note comparison endpoint"""
        url = reverse('compare-notes')
        data = {
            'note1': 'First note about plants',
            'note2': 'Second note about trees'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [200, 500])
    
    def test_analysis_history_endpoint(self):
        """Test history endpoint"""
        url = reverse('analysis-history')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('analyses', response.data)
        self.assertIn('comparisons', response.data)

class ModelsTestCase(TestCase):
    
    def test_note_analysis_model(self):
        """Test NoteAnalysis model"""
        analysis = NoteAnalysis.objects.create(
            original_text="Test text",
            summary="Test summary",
            key_points=["Point 1", "Point 2"],
            difficulty="Medium",
            bloom_level="Understand",
            topic_graph=[],
            quiz_questions=[],
            tags=["test"]
        )
        
        self.assertEqual(str(analysis), f"Analysis {analysis.id} - Medium - Understand")
        self.assertEqual(analysis.difficulty, "Medium")
        self.assertEqual(len(analysis.key_points), 2)
    
    def test_note_comparison_model(self):
        """Test NoteComparison model"""
        comparison = NoteComparison.objects.create(
            note1_text="First note",
            note2_text="Second note",
            similarity_score=75.5,
            comparison_summary="Test comparison"
        )
        
        self.assertEqual(str(comparison), f"Comparison {comparison.id} - 75.5% similarity")
        self.assertEqual(comparison.similarity_score, 75.5)