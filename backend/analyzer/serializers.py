from rest_framework import serializers
from .models import NoteAnalysis, NoteComparison

class NoteAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteAnalysis
        fields = '__all__'

class NoteComparisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteComparison
        fields = '__all__'

class TextInputSerializer(serializers.Serializer):
    text = serializers.CharField()

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

class ComparisonInputSerializer(serializers.Serializer):
    note1 = serializers.CharField()
    note2 = serializers.CharField()