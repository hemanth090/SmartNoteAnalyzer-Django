# 🚀 Render Deployment Guide - Smart Note Analyzer

Complete guide to deploy the Smart Note Analyzer on Render.com with both backend and frontend.

## 📋 Prerequisites

- ✅ GitHub repository with your code
- ✅ Render account (sign up at [render.com](https://render.com))
- ✅ Groq API key from [console.groq.com](https://console.groq.com)

## 🐍 Step 1: Deploy Backend (Django API)

### 1.1 Create Web Service on Render

1. **Go to Render Dashboard** → Click "New +" → Select "Web Service"

2. **Connect Repository:**
   - Connect your GitHub account
   - Select your `smart-note-analyzer` repository
   - Choose the `main` branch

3. **Configure Service:**
   ```
   Name: smart-note-analyzer-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: ./build.sh
   Start Command: gunicorn smart_note_analyzer.wsgi:application
   Plan: Free (or Starter for better performance)
   ```

### 1.2 Set Environment Variables

In the Render dashboard, add these environment variables:

```env
GROQ_API_KEY=your_groq_api_key_here
DEBUG=False
PYTHON_VERSION=3.9.16
WEB_CONCURRENCY=4
```

**Important:** 
- Replace `your_groq_api_key_here` with your actual Groq API key
- Render will auto-generate `SECRET_KEY` for you

### 1.3 Add PostgreSQL Database (Optional but Recommended)

1. **Create Database:**
   - In Render Dashboard → "New +" → "PostgreSQL"
   - Name: `smart-note-analyzer-db`
   - Plan: Free
   - Region: Same as your web service

2. **Connect Database:**
   - Copy the "Internal Database URL"
   - Add to your web service environment variables:
   ```env
   DATABASE_URL=your_internal_database_url_here
   ```

### 1.4 Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes for first deploy)
3. **Your backend will be available at:** `https://smart-note-analyzer-backend.onrender.com`

## ⚛️ Step 2: Deploy Frontend (React App)

### 2.1 Create Static Site on Render

1. **Go to Render Dashboard** → Click "New +" → Select "Static Site"

2. **Connect Repository:**
   - Select your `smart-note-analyzer` repository
   - Choose the `main` branch

3. **Configure Static Site:**
   ```
   Name: smart-note-analyzer-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm run build
   Publish Directory: build
   ```

### 2.2 Set Environment Variables

Add this environment variable:

```env
REACT_APP_API_URL=https://smart-note-analyzer-backend.onrender.com/api
```

**Important:** Replace the URL with your actual backend URL from Step 1.

### 2.3 Deploy Frontend

1. **Click "Create Static Site"**
2. **Wait for deployment** (3-5 minutes)
3. **Your frontend will be available at:** `https://smart-note-analyzer-frontend.onrender.com`

## 🔧 Step 3: Update CORS Settings

After both services are deployed, update your backend CORS settings:

1. **Go to your backend service** on Render
2. **Add environment variable:**
   ```env
   FRONTEND_URL=https://smart-note-analyzer-frontend.onrender.com
   ```

3. **Update your Django settings** (this is already configured in the code):
   ```python
   # The code already handles this automatically
   CORS_ALLOWED_ORIGINS.extend([
       "https://smart-note-analyzer.onrender.com",
       "https://your-frontend-name.onrender.com",
   ])
   ```

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend API

Visit your backend URL and test these endpoints:

- **Health Check:** `https://your-backend-url.onrender.com/api/health/`
- **Admin Panel:** `https://your-backend-url.onrender.com/admin/`

### 4.2 Test Frontend Application

1. **Visit your frontend URL**
2. **Test all features:**
   - ✅ Home page loads
   - ✅ Text analysis works
   - ✅ File upload works
   - ✅ Image OCR works
   - ✅ Note comparison works
   - ✅ History shows data
   - ✅ PDF export works
   - ✅ Dark/light mode toggle

## 🎯 Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain to Frontend

1. **In Render Dashboard** → Your static site → "Settings"
2. **Custom Domains** → "Add Custom Domain"
3. **Enter your domain:** `yourdomain.com`
4. **Update DNS records** as instructed by Render

### 5.2 Add Custom Domain to Backend

1. **In Render Dashboard** → Your web service → "Settings"
2. **Custom Domains** → "Add Custom Domain"
3. **Enter your API subdomain:** `api.yourdomain.com`
4. **Update DNS records** as instructed by Render

### 5.3 Update Environment Variables

Update your frontend environment variable:
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. **Build Fails - Tesseract Not Found**
**Solution:** The build script installs Tesseract automatically. If it fails:
- Check the build logs in Render dashboard
- Ensure `build.sh` has the correct Tesseract installation commands

#### 2. **CORS Errors**
**Solution:** 
- Verify `REACT_APP_API_URL` points to correct backend URL
- Check CORS settings in Django settings
- Ensure both services are deployed and running

#### 3. **Database Connection Errors**
**Solution:**
- Verify `DATABASE_URL` is correctly set
- Check PostgreSQL database is running
- Run migrations: The build script handles this automatically

#### 4. **Static Files Not Loading**
**Solution:**
- WhiteNoise is configured to handle static files
- Run `python manage.py collectstatic` (handled in build script)
- Check static file paths in Django settings

#### 5. **API Key Errors**
**Solution:**
- Verify `GROQ_API_KEY` is correctly set in environment variables
- Test API key at [console.groq.com](https://console.groq.com)
- Check for any typos in the key

#### 6. **Slow Performance**
**Solution:**
- Upgrade to Render's Starter plan ($7/month) for better performance
- Add Redis for caching (optional)
- Optimize database queries

## 📊 Monitoring Your Deployment

### 1. **Render Dashboard**
- Monitor service health and logs
- Check deployment history
- View resource usage

### 2. **Application Logs**
```bash
# View backend logs in Render dashboard
# Or use Render CLI:
render logs -s smart-note-analyzer-backend
```

### 3. **Health Checks**
Your backend includes a health check endpoint:
- `GET /api/health/` - Returns service status and configuration

## 🚀 Deployment Commands Summary

### Quick Deploy Checklist:

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Backend Service Configuration:**
   - Name: `smart-note-analyzer-backend`
   - Root Directory: `backend`
   - Build Command: `./build.sh`
   - Start Command: `gunicorn smart_note_analyzer.wsgi:application`

3. **Frontend Static Site Configuration:**
   - Name: `smart-note-analyzer-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `build`

4. **Environment Variables:**
   - Backend: `GROQ_API_KEY`, `DEBUG=False`
   - Frontend: `REACT_APP_API_URL`

## 💰 Cost Breakdown

### Free Tier Limits:
- **Web Service:** 750 hours/month (enough for 24/7)
- **Static Site:** Unlimited bandwidth
- **PostgreSQL:** 1GB storage, 1 million rows
- **Build Time:** 500 minutes/month

### Paid Plans:
- **Starter ($7/month):** Better performance, no sleep
- **Pro ($25/month):** More resources, priority support

## 🎉 Success!

Your Smart Note Analyzer is now live on Render! 

**Frontend URL:** `https://smart-note-analyzer-frontend.onrender.com`
**Backend API:** `https://smart-note-analyzer-backend.onrender.com/api`

### Share Your Deployment:
- Add URLs to your GitHub README
- Share with users and get feedback
- Monitor usage and performance

---

**Need help?** Check the [main README](README.md) or create an issue in the repository.