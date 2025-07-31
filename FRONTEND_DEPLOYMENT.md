# 🌐 Frontend Deployment Guide - React Static Site

Complete guide to deploy the React frontend on Render after the backend is deployed.

## 📋 Prerequisites

- ✅ Backend already deployed and running
- ✅ Backend URL available (e.g., `https://smart-note-analyzer-backend.onrender.com`)
- ✅ Render account

## 🚀 Method 1: Manual Static Site Deployment (Recommended)

### **Step 1: Create Static Site**

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Static Site"**
3. **Connect Repository:**
   - Repository: `hemanth090/SmartNoteAnalyzer-Django`
   - Branch: `main`

### **Step 2: Configure Static Site**

```
Name: smart-note-analyzer-frontend
Branch: main
Root Directory: frontend
Build Command: npm ci && npm run build
Publish Directory: build
Auto-Deploy: Yes
```

### **Step 3: Add Environment Variables**

Add this environment variable:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

**Important:** Replace `your-backend-url` with your actual backend URL from the backend deployment.

### **Step 4: Deploy**

1. **Click "Create Static Site"**
2. **Wait for build** (3-5 minutes)
3. **Your frontend will be live!**

## 🚀 Method 2: Blueprint Deployment (Alternative)

If you prefer using a blueprint for the frontend:

### **Step 1: Create Frontend Blueprint**

1. **Create a new repository** or branch with just the frontend code
2. **Add the `frontend-render.yaml` file** to the root
3. **Deploy via Blueprint**

### **Step 2: Use Frontend Blueprint**

```yaml
# frontend-render.yaml content
services:
  - type: static
    name: smart-note-analyzer-frontend
    buildCommand: npm ci && npm run build
    staticPublishPath: build
    envVars:
      - key: REACT_APP_API_URL
        value: https://smart-note-analyzer-backend.onrender.com/api
```

## 🔧 Configuration Details

### **Build Settings**
- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `build`
- **Node Version:** Latest stable (auto-detected)

### **Environment Variables**
```env
REACT_APP_API_URL=https://smart-note-analyzer-backend.onrender.com/api
GENERATE_SOURCEMAP=false
CI=false
```

### **Custom Headers (Optional)**
```yaml
headers:
  - key: X-Frame-Options
    value: DENY
  - key: X-Content-Type-Options
    value: nosniff
  - key: Cache-Control
    value: public, max-age=31536000
```

## ✅ Post-Deployment Checklist

### **1. Verify Frontend is Live**
- Visit your frontend URL
- Check that the home page loads correctly
- Verify dark/light mode toggle works

### **2. Test Backend Connection**
- Try text analysis feature
- Check if API calls are working
- Verify CORS is configured correctly

### **3. Test All Features**
- [ ] Home page loads
- [ ] Text analysis works
- [ ] File upload works
- [ ] Image OCR works (if available)
- [ ] Note comparison works
- [ ] History shows data
- [ ] PDF export works
- [ ] Responsive design on mobile

## 🔍 Troubleshooting

### **Common Issues & Solutions**

#### **1. Build Fails**
```bash
# Check build logs for errors
# Common fixes:
- Ensure package.json is in frontend directory
- Check for missing dependencies
- Verify Node.js version compatibility
```

#### **2. API Connection Errors**
```bash
# Frontend can't connect to backend
# Solutions:
- Verify REACT_APP_API_URL is correct
- Check backend CORS settings
- Ensure backend is running and accessible
```

#### **3. Environment Variables Not Working**
```bash
# React environment variables must start with REACT_APP_
# Correct: REACT_APP_API_URL
# Incorrect: API_URL
```

#### **4. Routing Issues (404 on Refresh)**
```bash
# Add redirect rules for SPA routing
# In Render dashboard:
# Redirects & Rewrites → Add Rule
# Source: /*
# Destination: /index.html
# Status: 200 (Rewrite)
```

## 🌐 Expected URLs

After successful deployment:

- **Frontend:** `https://smart-note-analyzer-frontend.onrender.com`
- **API Connection:** Should connect to your backend automatically
- **Health Check:** Frontend should show "connected" status

## 🔄 Continuous Deployment

### **Auto-Deploy Setup**
- **Enabled by default** when connected to GitHub
- **Deploys automatically** on push to main branch
- **Build logs available** in Render dashboard

### **Manual Deploy**
- Go to service dashboard
- Click "Manual Deploy"
- Select "Deploy latest commit"

## 📊 Performance Optimization

### **Build Optimizations**
```json
// package.json optimizations
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build"
  }
}
```

### **Caching Headers**
```yaml
# Add to render.yaml for better caching
headers:
  - key: Cache-Control
    value: public, max-age=31536000
    path: /static/*
```

## 💰 Cost

- **Static Site:** Free tier includes:
  - Unlimited bandwidth
  - Global CDN
  - SSL certificates
  - Custom domains

## 🎉 Success!

Your React frontend is now deployed and connected to your Django backend!

### **Complete Stack URLs:**
- **Frontend:** `https://smart-note-analyzer-frontend.onrender.com`
- **Backend:** `https://smart-note-analyzer-backend.onrender.com`
- **Full App:** Ready for users!

## 🔗 Next Steps

1. **Test the complete application**
2. **Add custom domain** (optional)
3. **Set up monitoring** and analytics
4. **Share with users** and get feedback

---

**Need help?** Check the Render dashboard logs or refer to the main [README.md](README.md) for additional support.