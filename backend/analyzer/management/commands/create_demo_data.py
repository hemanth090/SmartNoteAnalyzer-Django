from django.core.management.base import BaseCommand
from analyzer.models import NoteAnalysis, NoteComparison

class Command(BaseCommand):
    help = 'Create demo data for testing'

    def handle(self, *args, **options):
        # Create sample analyses
        sample_analyses = [
            {
                'original_text': 'Photosynthesis is the process by which plants convert sunlight into energy.',
                'summary': 'Photosynthesis converts sunlight to energy in plants using chlorophyll.',
                'key_points': [
                    'Plants use sunlight for energy conversion',
                    'Chlorophyll is essential for photosynthesis',
                    'Oxygen is produced as a byproduct',
                    'Carbon dioxide is consumed in the process'
                ],
                'difficulty': 'Medium',
                'bloom_level': 'Understand',
                'topic_graph': [
                    {'id': 'photosynthesis', 'label': 'Photosynthesis', 'children': ['sunlight', 'chlorophyll', 'oxygen']}
                ],
                'quiz_questions': [
                    {
                        'question': 'What is the main purpose of photosynthesis?',
                        'options': ['Energy conversion', 'Water absorption', 'Root growth', 'Seed production'],
                        'correct_answer': 'A'
                    }
                ],
                'tags': ['biology', 'plants', 'energy']
            },
            {
                'original_text': 'Machine learning is a subset of artificial intelligence that enables computers to learn without explicit programming.',
                'summary': 'Machine learning allows computers to learn patterns from data automatically.',
                'key_points': [
                    'Subset of artificial intelligence',
                    'Learns from data patterns',
                    'No explicit programming required',
                    'Improves performance over time'
                ],
                'difficulty': 'Hard',
                'bloom_level': 'Apply',
                'topic_graph': [
                    {'id': 'ml', 'label': 'Machine Learning', 'children': ['algorithms', 'data', 'patterns']}
                ],
                'quiz_questions': [
                    {
                        'question': 'Machine learning is a subset of what?',
                        'options': ['Data Science', 'Artificial Intelligence', 'Programming', 'Statistics'],
                        'correct_answer': 'B'
                    }
                ],
                'tags': ['ai', 'technology', 'programming']
            }
        ]

        for analysis_data in sample_analyses:
            analysis, created = NoteAnalysis.objects.get_or_create(
                original_text=analysis_data['original_text'],
                defaults=analysis_data
            )
            if created:
                self.stdout.write(f'Created analysis: {analysis.id}')

        # Create sample comparison
        comparison_data = {
            'note1_text': 'Photosynthesis converts sunlight to energy',
            'note2_text': 'Solar panels convert sunlight to electricity',
            'similarity_score': 65.0,
            'comparison_summary': 'Both processes involve converting sunlight into usable energy, but photosynthesis is biological while solar panels are technological.'
        }

        comparison, created = NoteComparison.objects.get_or_create(
            note1_text=comparison_data['note1_text'],
            note2_text=comparison_data['note2_text'],
            defaults=comparison_data
        )
        
        if created:
            self.stdout.write(f'Created comparison: {comparison.id}')

        self.stdout.write(self.style.SUCCESS('Demo data created successfully!'))