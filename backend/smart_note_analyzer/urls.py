from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Smart Note Analyzer API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'analyze_text': '/api/analyze-text/',
            'analyze_file': '/api/analyze-file/',
            'compare_notes': '/api/compare-notes/',
            'analysis_history': '/api/analysis-history/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('analyzer.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)