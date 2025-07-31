# Smart Note Analyzer - Setup Guide

## Prerequisites

- Python 3.8+ 
- Node.js 16+
- npm or yarn
- Groq API Key (get from https://console.groq.com/)

## Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your-django-secret-key-here
DEBUG=True
```

### 3. Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional
```

### 4. Install Tesseract OCR (for image processing)

**Windows:**
- Download from: https://github.com/UB-Mannheim/tesseract/wiki
- Add to PATH

**macOS:**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

### 5. Run Backend Server

```bash
python manage.py runserver
```

Backend will be available at: http://localhost:8000

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Run Frontend Server

```bash
npm start
```

Frontend will be available at: http://localhost:3000

## Features Overview

### ✅ Core Features Implemented

1. **Multi-Input Support**
   - Text input
   - PDF file upload
   - Image OCR (PNG, JPG, etc.)

2. **AI Analysis**
   - Summary generation
   - Key points extraction
   - Difficulty assessment (Easy/Medium/Hard)
   - Bloom's Taxonomy classification
   - Topic tagging

3. **Interactive Components**
   - Mind map visualization (React Flow)
   - Quiz generation with MCQs
   - Note comparison tool
   - Analysis history

4. **UI/UX Features**
   - Dark/Light mode toggle
   - Responsive design
   - PDF export functionality
   - Toast notifications

### 🔧 API Endpoints

- `POST /api/analyze-text/` - Analyze text input
- `POST /api/analyze-file/` - Analyze uploaded file
- `POST /api/compare-notes/` - Compare two notes
- `GET /api/analysis-history/` - Get analysis history

### 📱 Usage

1. **Analyze Notes**: Enter text or upload files for AI analysis
2. **View Results**: See summary, key points, difficulty, and Bloom's level
3. **Interactive Mind Map**: Explore topic relationships
4. **Take Quiz**: Test understanding with generated questions
5. **Compare Notes**: Find similarities between different notes
6. **Export**: Download analysis as PDF

## Troubleshooting

### Common Issues

1. **Groq API Errors**
   - Verify API key is correct
   - Check API rate limits
   - Ensure internet connection

2. **OCR Not Working**
   - Install Tesseract OCR
   - Verify PATH configuration
   - Check image quality

3. **File Upload Issues**
   - Check file size (max 10MB)
   - Verify file format (PDF, TXT, images)
   - Ensure proper permissions

4. **CORS Errors**
   - Verify frontend URL in Django CORS settings
   - Check API_URL in frontend .env

### Development Tips

- Use Django admin at http://localhost:8000/admin/ to view stored analyses
- Check browser console for frontend errors
- Monitor Django logs for backend issues
- Test with sample files first

## Production Deployment

### Backend (Django)

1. Set `DEBUG=False` in production
2. Configure proper database (PostgreSQL recommended)
3. Set up static file serving
4. Use environment variables for secrets
5. Configure CORS for production domain

### Frontend (React)

1. Build production version: `npm run build`
2. Serve static files with nginx/Apache
3. Update API_URL for production backend
4. Enable HTTPS

## Architecture

```
Smart Note Analyzer/
├── backend/                 # Django REST API
│   ├── analyzer/           # Main app
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API endpoints
│   │   ├── serializers.py # Data serialization
│   │   └── utils/         # AI processing utilities
│   └── smart_note_analyzer/ # Django project
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API integration
│   │   └── App.js         # Main application
└── README.md
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - see LICENSE file for details