#!/usr/bin/env python3
"""
Deployment validation script for Smart Note Analyzer
Validates the render.yaml configuration and project setup
"""

import os
import json
import yaml
import sys
from pathlib import Path

def validate_yaml_syntax():
    """Validate YAML syntax"""
    try:
        with open('render.yaml', 'r') as f:
            config = yaml.safe_load(f)
        print("✅ render.yaml syntax is valid")
        return config
    except yaml.YAMLError as e:
        print(f"❌ YAML syntax error: {e}")
        return None
    except FileNotFoundError:
        print("❌ render.yaml file not found")
        return None

def validate_backend_config(config):
    """Validate backend service configuration"""
    services = config.get('services', [])
    backend_service = None
    
    for service in services:
        if service.get('name') == 'smart-note-analyzer-backend':
            backend_service = service
            break
    
    if not backend_service:
        print("❌ Backend service not found in render.yaml")
        return False
    
    # Check required fields
    required_fields = ['type', 'env', 'buildCommand', 'startCommand', 'healthCheckPath']
    for field in required_fields:
        if field not in backend_service:
            print(f"❌ Backend service missing required field: {field}")
            return False
    
    # Validate specific configurations
    if backend_service['type'] != 'web':
        print("❌ Backend service type should be 'web'")
        return False
    
    if backend_service['env'] != 'python':
        print("❌ Backend service env should be 'python'")
        return False
    
    if '/api/health/' not in backend_service['healthCheckPath']:
        print("❌ Backend health check path should be '/api/health/'")
        return False
    
    # Check environment variables
    env_vars = backend_service.get('envVars', [])
    required_env_vars = ['GROQ_API_KEY', 'SECRET_KEY', 'DEBUG']
    
    env_var_keys = [var['key'] for var in env_vars]
    for required_var in required_env_vars:
        if required_var not in env_var_keys:
            print(f"❌ Backend missing required environment variable: {required_var}")
            return False
    
    print("✅ Backend service configuration is valid")
    return True

def validate_frontend_config(config):
    """Validate frontend service configuration"""
    services = config.get('services', [])
    frontend_service = None
    
    for service in services:
        if service.get('name') == 'smart-note-analyzer-frontend':
            frontend_service = service
            break
    
    if not frontend_service:
        print("❌ Frontend service not found in render.yaml")
        return False
    
    # Check required fields
    required_fields = ['type', 'buildCommand', 'staticPublishPath']
    for field in required_fields:
        if field not in frontend_service:
            print(f"❌ Frontend service missing required field: {field}")
            return False
    
    # Validate specific configurations
    if frontend_service['type'] != 'static':
        print("❌ Frontend service type should be 'static'")
        return False
    
    if 'npm' not in frontend_service['buildCommand']:
        print("❌ Frontend build command should include npm")
        return False
    
    if 'frontend/build' not in frontend_service['staticPublishPath']:
        print("❌ Frontend static publish path should be 'frontend/build'")
        return False
    
    # Check environment variables
    env_vars = frontend_service.get('envVars', [])
    required_env_vars = ['REACT_APP_API_URL']
    
    env_var_keys = [var['key'] for var in env_vars]
    for required_var in required_env_vars:
        if required_var not in env_var_keys:
            print(f"❌ Frontend missing required environment variable: {required_var}")
            return False
    
    print("✅ Frontend service configuration is valid")
    return True

def validate_database_config(config):
    """Validate database configuration"""
    databases = config.get('databases', [])
    
    if not databases:
        print("❌ No database configuration found")
        return False
    
    db = databases[0]
    required_fields = ['name', 'databaseName']
    
    for field in required_fields:
        if field not in db:
            print(f"❌ Database missing required field: {field}")
            return False
    
    print("✅ Database configuration is valid")
    return True

def validate_project_structure():
    """Validate project file structure"""
    required_files = [
        'backend/manage.py',
        'backend/requirements.txt',
        'backend/smart_note_analyzer/settings.py',
        'backend/smart_note_analyzer/wsgi.py',
        'frontend/package.json',
        'frontend/src/App.js',
        'frontend/public/index.html',
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing required files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        return False
    
    print("✅ Project structure is valid")
    return True

def validate_backend_dependencies():
    """Validate backend dependencies"""
    try:
        with open('backend/requirements.txt', 'r') as f:
            requirements = f.read()
        
        required_packages = [
            'Django',
            'djangorestframework',
            'django-cors-headers',
            'groq',
            'gunicorn',
            'dj-database-url',
            'psycopg2-binary',
            'whitenoise'
        ]
        
        missing_packages = []
        for package in required_packages:
            if package.lower() not in requirements.lower():
                missing_packages.append(package)
        
        if missing_packages:
            print("❌ Missing required Python packages:")
            for package in missing_packages:
                print(f"   - {package}")
            return False
        
        print("✅ Backend dependencies are valid")
        return True
        
    except FileNotFoundError:
        print("❌ requirements.txt not found")
        return False

def validate_frontend_dependencies():
    """Validate frontend dependencies"""
    try:
        with open('frontend/package.json', 'r') as f:
            package_data = json.load(f)
        
        dependencies = package_data.get('dependencies', {})
        required_packages = [
            'react',
            'react-dom',
            'axios',
            'react-scripts'
        ]
        
        missing_packages = []
        for package in required_packages:
            if package not in dependencies:
                missing_packages.append(package)
        
        if missing_packages:
            print("❌ Missing required Node.js packages:")
            for package in missing_packages:
                print(f"   - {package}")
            return False
        
        # Check build script
        scripts = package_data.get('scripts', {})
        if 'build' not in scripts:
            print("❌ Frontend package.json missing 'build' script")
            return False
        
        print("✅ Frontend dependencies are valid")
        return True
        
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error reading package.json: {e}")
        return False

def main():
    """Main validation function"""
    print("🔍 Smart Note Analyzer - Deployment Validation")
    print("=" * 50)
    
    all_valid = True
    
    # Validate YAML syntax
    config = validate_yaml_syntax()
    if not config:
        return False
    
    # Validate configurations
    validations = [
        validate_project_structure(),
        validate_backend_config(config),
        validate_frontend_config(config),
        validate_database_config(config),
        validate_backend_dependencies(),
        validate_frontend_dependencies(),
    ]
    
    all_valid = all(validations)
    
    print("\n" + "=" * 50)
    
    if all_valid:
        print("🎉 All validations passed!")
        print("\n✅ Your project is ready for Render deployment:")
        print("   1. Push to GitHub")
        print("   2. Connect to Render")
        print("   3. Set GROQ_API_KEY environment variable")
        print("   4. Deploy!")
        print("\n🚀 Deploy URL: https://render.com/deploy?repo=https://github.com/hemanth090/SmartNoteAnalyzer-Django")
    else:
        print("❌ Validation failed!")
        print("Please fix the issues above before deploying.")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)