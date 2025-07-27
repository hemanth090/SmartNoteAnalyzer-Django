from django.db import models

class NoteAnalysis(models.Model):
    """Store note analysis results"""
    session_key = models.CharField(max_length=40, db_index=True, default='anonymous')  # Session-based isolation
    original_text = models.TextField()
    summary = models.TextField()
    key_points = models.JSONField()
    difficulty = models.CharField(max_length=20)
    bloom_level = models.CharField(max_length=20)
    topic_graph = models.JSONField()
    quiz_questions = models.JSONField()
    tags = models.JSONField()
    learning_objectives = models.JSONField(default=list)
    prerequisites = models.JSONField(default=list)
    applications = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Analysis {self.id} - {self.difficulty} - {self.bloom_level}"

class NoteComparison(models.Model):
    """Store note comparison results"""
    session_key = models.CharField(max_length=40, db_index=True, default='anonymous')  # Session-based isolation
    note1_text = models.TextField()
    note2_text = models.TextField()
    similarity_score = models.FloatField()
    comparison_summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comparison {self.id} - {self.similarity_score}% similarity"