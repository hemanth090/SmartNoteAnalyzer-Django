from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(), name='health-check'),
    path('test/', views.TestView.as_view(), name='test'),
    path('analyze-text/', views.AnalyzeTextView.as_view(), name='analyze-text'),
    path('analyze-file/', views.AnalyzeFileView.as_view(), name='analyze-file'),
    path('compare-notes/', views.CompareNotesView.as_view(), name='compare-notes'),
    path('analysis-history/', views.AnalysisHistoryView.as_view(), name='analysis-history'),
]