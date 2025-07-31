import os
from django.core.wsgi import get_wsgi_application

# Use Render-specific settings when deployed on Render
if 'RENDER' in os.environ:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_note_analyzer.settings_render')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_note_analyzer.settings')

application = get_wsgi_application()