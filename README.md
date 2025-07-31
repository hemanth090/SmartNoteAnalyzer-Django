# 🧠 Smart Note Analyzer

A comprehensive AI-powered web application that transforms your notes into actionable insights with advanced analysis, interactive visualizations, and intelligent learning tools.

![Smart Note Analyzer](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![Django](https://img.shields.io/badge/Django-4.2+-092E20)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Key Features

### 🔍 **Multi-Input Analysis**
- **📝 Text Input**: Direct typing or pasting
- **📄 File Upload**: PDF and TXT file support  
- **🖼️ Image OCR**: Extract text from images using Tesseract

### 🤖 **Advanced AI Analysis**
- **� Compraehensive Summaries**: 15-25 sentence detailed analysis
- **🎯 Key Points**: 8-12 detailed explanations with context
- **📊 Difficulty Assessment**: Easy/Medium/Hard with justification
- **🧠 Bloom's Taxonomy**: Cognitive level classification
- **🏷️ Smart Tagging**: 8-12 relevant topic keywords
- **🎯 Learning Objectives**: 5-8 specific, measurable goals
- **📚 Prerequisites**: Required knowledge identification
- **🌍 Real-world Applications**: Practical use cases and examples

### 📊 **Interactive Features**
- **🗺️ Mind Maps**: Beautiful visualizations using React Flow
- **❓ Quiz Generation**: Auto-generated MCQ questions with explanations
- **⚖️ Note Comparison**: Semantic similarity analysis with detailed insights
- **📈 Analysis History**: Session-based private history tracking

### 🎨 **Modern UI/UX**
- **🌗 Dark/Light Mode**: Seamless theme switching
- **📱 Responsive Design**: Mobile-first approach
- **📄 PDF Export**: Professional analysis reports
- **🔔 Smart Notifications**: Real-time feedback system
- **🔒 Privacy-First**: Session-based data isolation

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API Key ([Get free key](https://console.groq.com/))

### 🐍 Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Setup database
python manage.py makemigrations
python manage.py migrate

# Create demo data (optional)
python manage.py create_demo_data

# Run development server
python manage.py runserver
```

### ⚛️ Frontend Setup
```bash
cd frontend
npm install

# Create environment file
cp .env.example .env
# Edit .env if needed (default: http://localhost:8000/api)

# Run development server
npm start
```

**🌐 Visit: http://localhost:3000**

## 🏗️ Architecture

### Backend (Django REST API)
```
backend/
├── smart_note_analyzer/     # Django project configuration
├── analyzer/                # Main application
│   ├── models.py           # Database models with session isolation
│   ├── views.py            # API endpoints with comprehensive analysis
│   ├── serializers.py      # Data serialization and validation
│   ├── utils/              # AI processing utilities
│   │   ├── groq_ai.py      # Advanced Groq API integration
│   │   ├── file_handler.py # Multi-format file processing
│   │   └── ocr_extractor.py # Tesseract OCR implementation
│   └── management/commands/ # Custom Django commands
```

### Frontend (React SPA)
```
frontend/src/
├── components/              # Reusable React components
│   ├── HomePage.jsx        # Landing page with features
│   ├── NoteInput.jsx       # Multi-input interface
│   ├── ResultCard.jsx      # Comprehensive analysis display
│   ├── GraphMap.jsx        # Interactive mind map
│   ├── QuizCard.jsx        # Engaging quiz interface
│   ├── ComparisonView.jsx  # Note comparison tool
│   └── HistoryView.jsx     # Session-based history
├── services/
│   └── api.js              # Axios-based API integration
└── App.js                  # Main application with routing
```

## 📡 API Endpoints

| Endpoint | Method | Description | Features |
|----------|--------|-------------|----------|
| `/api/health/` | GET | System health check | Status, API config |
| `/api/analyze-text/` | POST | Analyze text input | Comprehensive analysis |
| `/api/analyze-file/` | POST | Process uploaded files | PDF, TXT, Image support |
| `/api/compare-notes/` | POST | Compare two notes | Semantic similarity |
| `/api/analysis-history/` | GET | User's analysis history | Session-isolated data |

## 🔧 Technology Stack

### **Frontend Technologies**
- **React 18** - Modern hooks-based architecture
- **TailwindCSS** - Utility-first styling framework
- **React Flow** - Interactive mind map visualizations
- **jsPDF** - Client-side PDF generation
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Beautiful notification system
- **Lucide React** - Consistent icon library

### **Backend Technologies**
- **Django 4.2** - Robust web framework
- **Django REST Framework** - API development
- **Groq API** - Advanced AI processing (deepseek-r1-distill-llama-70b)
- **Tesseract OCR** - Image text extraction
- **PyMuPDF** - PDF text processing
- **SQLite** - Development database (PostgreSQL ready)
- **Django CORS Headers** - Cross-origin support

## 🎯 Usage Examples

### Text Analysis Response
```json
{
  "summary": "Comprehensive 15-25 sentence analysis covering historical context, mechanisms, applications, and future directions...",
  "key_points": [
    "Detailed explanation with context and examples spanning 2-3 sentences...",
    "Another comprehensive point with practical implications..."
  ],
  "difficulty": "Medium",
  "bloom_level": "Apply",
  "learning_objectives": [
    "Understand the fundamental principles and their applications",
    "Analyze the relationship between different components"
  ],
  "prerequisites": ["Basic understanding of...", "Familiarity with..."],
  "applications": ["Real-world use case 1", "Practical application 2"],
  "tags": ["primary_topic", "subtopic1", "methodology", "application"]
}
```

### Note Comparison Response
```json
{
  "similarity_score": 78,
  "comparison_summary": "Detailed analysis of similarities and differences with specific examples and contextual insights..."
}
```

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests  
cd frontend
npm test
```

### Code Quality
```bash
# Python linting
flake8 backend/

# JavaScript linting
cd frontend && npm run lint
```

## 🚀 Production Deployment

### Render Deployment (Recommended)

**One-Click Deploy:**
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/hemanth090/SmartNoteAnalyzer-Django)

**Manual Deploy:**
1. **Create Render account** at [render.com](https://render.com)
2. **Connect GitHub repository**
3. **Deploy backend:**
   - Service type: Web Service
   - Build command: `./build.sh`
   - Start command: `gunicorn smart_note_analyzer.wsgi:application --bind 0.0.0.0:$PORT`
   - Add environment variable: `GROQ_API_KEY=your_key`
4. **Deploy frontend:**
   - Service type: Static Site
   - Build command: `npm ci && npm run build`
   - Publish directory: `build`

### Alternative Deployment Options

**Traditional Server:**
```bash
pip install -r requirements.txt gunicorn
export DEBUG=False
export GROQ_API_KEY=your_production_key
python manage.py migrate
python manage.py collectstatic
gunicorn smart_note_analyzer.wsgi:application --bind 0.0.0.0:8000
```

## 🔒 Security & Privacy

- **🛡️ CORS Protection** - Configured for secure cross-origin requests
- **✅ Input Validation** - Comprehensive data sanitization
- **📁 File Security** - Type and size restrictions
- **🔐 Session Isolation** - Private user data separation
- **🌐 Environment Variables** - Secure configuration management
- **🚫 Rate Limiting Ready** - API abuse prevention

## 🎨 User Interface

### **Home Page Features**
- Hero section with clear value proposition
- Feature showcase with icons and descriptions
- Step-by-step usage guide
- Call-to-action buttons

### **Analysis Interface**
- Multi-tab navigation (Home, Analyze, Compare, History)
- Drag-and-drop file upload
- Real-time analysis progress
- Comprehensive results display

### **Results Display**
- Tabbed interface (Summary, Key Points, Learning, Mind Map, Quiz)
- Professional typography and spacing
- Statistics and reading time estimates
- Export functionality

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Groq](https://groq.com/)** - Advanced AI processing capabilities
- **[React Flow](https://reactflow.dev/)** - Interactive mind map visualizations  
- **[TailwindCSS](https://tailwindcss.com/)** - Beautiful, responsive styling
- **[Django REST Framework](https://www.django-rest-framework.org/)** - Robust API development
- **[Tesseract OCR](https://github.com/tesseract-ocr/tesseract)** - Image text extraction

## 📞 Support

- **📧 Issues**: [GitHub Issues](https://github.com/yourusername/smart-note-analyzer/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/smart-note-analyzer/discussions)
- **📖 Documentation**: [Setup Guide](SETUP_GUIDE.md)

---

**🚀 Built with passion for enhanced learning and knowledge analysis**

[![Made with Python](https://img.shields.io/badge/Made%20with-Python-blue)](https://python.org)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB)](https://reactjs.org)
