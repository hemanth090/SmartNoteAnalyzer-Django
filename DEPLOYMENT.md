# 🚀 Deployment Guide - Smart Note Analyzer

This guide covers deploying the Smart Note Analyzer to various platforms for production use.

## 📋 Pre-deployment Checklist

### Environment Variables
Ensure you have the following environment variables configured:

**Backend (.env):**
```env
GROQ_API_KEY=your_production_groq_api_key
SECRET_KEY=your_secure_django_secret_key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=your_database_url (if using PostgreSQL)
```

**Frontend (.env):**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Security Considerations
- [ ] Change Django SECRET_KEY for production
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS properly
- [ ] Use HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Configure session security settings

## 🐳 Docker Deployment

### Backend Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "smart_note_analyzer.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - GROQ_API_KEY=${GROQ_API_KEY}
      - SECRET_KEY=${SECRET_KEY}
    volumes:
      - ./backend:/app
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=smart_note_analyzer
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## ☁️ Cloud Platform Deployments

### Heroku Deployment

#### Backend (Django)
1. **Install Heroku CLI and login**
```bash
heroku login
```

2. **Create Heroku app**
```bash
cd backend
heroku create your-app-name-backend
```

3. **Add buildpacks**
```bash
heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-apt
heroku buildpacks:add --index 2 heroku/python
```

4. **Create Aptfile for Tesseract**
```bash
echo "tesseract-ocr" > Aptfile
echo "tesseract-ocr-eng" >> Aptfile
```

5. **Configure environment variables**
```bash
heroku config:set GROQ_API_KEY=your_key
heroku config:set SECRET_KEY=your_secret
heroku config:set DEBUG=False
```

6. **Create Procfile**
```bash
echo "web: gunicorn smart_note_analyzer.wsgi:application --bind 0.0.0.0:\$PORT" > Procfile
```

7. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
heroku run python manage.py migrate
```

#### Frontend (React)
1. **Deploy to Netlify/Vercel**
```bash
# Build the project
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=build

# Or deploy to Vercel
npm install -g vercel
vercel --prod
```

### AWS Deployment

#### Backend (EC2 + RDS)
1. **Launch EC2 instance** (Ubuntu 20.04)
2. **Install dependencies**
```bash
sudo apt update
sudo apt install python3-pip nginx postgresql-client tesseract-ocr
```

3. **Clone and setup application**
```bash
git clone your-repo-url
cd smart-note-analyzer/backend
pip3 install -r requirements.txt
```

4. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/your/staticfiles/;
    }
}
```

5. **Setup systemd service**
```ini
[Unit]
Description=Smart Note Analyzer
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/smart-note-analyzer/backend
ExecStart=/usr/local/bin/gunicorn smart_note_analyzer.wsgi:application --bind 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

#### Frontend (S3 + CloudFront)
1. **Build the application**
```bash
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync build/ s3://your-bucket-name --delete
```

3. **Configure CloudFront distribution**
- Origin: S3 bucket
- Default root object: index.html
- Error pages: 404 → /index.html (for SPA routing)

### DigitalOcean App Platform

#### Backend
```yaml
name: smart-note-analyzer-backend
services:
- name: backend
  source_dir: /backend
  github:
    repo: your-username/smart-note-analyzer
    branch: main
  run_command: gunicorn smart_note_analyzer.wsgi:application --bind 0.0.0.0:8080
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: GROQ_API_KEY
    value: your_key
    type: SECRET
  - key: DEBUG
    value: "False"
```

#### Frontend
```yaml
name: smart-note-analyzer-frontend
static_sites:
- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/smart-note-analyzer
    branch: main
  build_command: npm run build
  output_dir: build
  envs:
  - key: REACT_APP_API_URL
    value: https://your-backend-url.com/api
```

## 🗄️ Database Configuration

### PostgreSQL (Production)
1. **Install PostgreSQL adapter**
```bash
pip install psycopg2-binary
```

2. **Update Django settings**
```python
import dj_database_url

DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
}
```

3. **Run migrations**
```bash
python manage.py migrate
```

### Redis (Session Storage)
```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL', 'redis://localhost:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'
```

## 🔧 Performance Optimization

### Backend Optimizations
1. **Enable gzip compression**
```python
MIDDLEWARE = [
    'django.middleware.gzip.GZipMiddleware',
    # ... other middleware
]
```

2. **Configure static files**
```python
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

3. **Add caching**
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### Frontend Optimizations
1. **Enable build optimizations**
```json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build"
  }
}
```

2. **Configure CDN for assets**
```javascript
// In build process
const PUBLIC_URL = process.env.PUBLIC_URL || 'https://your-cdn.com';
```

## 📊 Monitoring & Logging

### Backend Monitoring
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Health Checks
```python
# Add to urls.py
path('health/', views.HealthCheckView.as_view()),
```

## 🔒 SSL/HTTPS Configuration

### Let's Encrypt (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Django HTTPS Settings
```python
# settings.py (production)
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        cd backend
        python manage.py test
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 📝 Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test API endpoints
- [ ] Verify file upload functionality
- [ ] Test OCR functionality
- [ ] Check database connections
- [ ] Verify SSL certificates
- [ ] Test frontend-backend communication
- [ ] Monitor application logs
- [ ] Set up backup procedures
- [ ] Configure monitoring alerts

## 🆘 Troubleshooting

### Common Issues

1. **Tesseract not found**
   - Install tesseract-ocr on the server
   - Verify PATH configuration

2. **Database connection errors**
   - Check DATABASE_URL format
   - Verify database server is running

3. **CORS errors**
   - Update CORS_ALLOWED_ORIGINS
   - Check frontend API URL configuration

4. **Static files not loading**
   - Run `python manage.py collectstatic`
   - Configure web server to serve static files

5. **Memory issues**
   - Increase server memory
   - Optimize file processing
   - Add request size limits

---

For additional support, please refer to the main [README.md](README.md) or create an issue in the repository.