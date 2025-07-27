from django.contrib import admin
from .models import NoteAnalysis, NoteComparison

@admin.register(NoteAnalysis)
class NoteAnalysisAdmin(admin.ModelAdmin):
    list_display = ['id', 'difficulty', 'bloom_level', 'created_at']
    list_filter = ['difficulty', 'bloom_level', 'created_at']
    search_fields = ['summary', 'tags']
    readonly_fields = ['created_at']

@admin.register(NoteComparison)
class NoteComparisonAdmin(admin.ModelAdmin):
    list_display = ['id', 'similarity_score', 'created_at']
    list_filter = ['similarity_score', 'created_at']
    readonly_fields = ['created_at']