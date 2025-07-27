#!/usr/bin/env python3
"""
Setup script for Smart Note Analyzer Backend
"""
import subprocess
import sys
import os

def run_command(command, cwd=None):
    """Run a command and return success status"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, 
                              capture_output=True, text=True)
        print(f"✓ {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {command}")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("🚀 Setting up Smart Note Analyzer Backend...")
    
    backend_dir = "backend"
    
    # Install Python dependencies
    print("\n📦 Installing Python dependencies...")
    if not run_command("pip install -r requirements.txt", cwd=backend_dir):
        print("❌ Failed to install dependencies")
        return False
    
    # Create migrations
    print("\n🗄️ Creating database migrations...")
    if not run_command("python manage.py makemigrations", cwd=backend_dir):
        print("❌ Failed to create migrations")
        return False
    
    # Apply migrations
    print("\n🗄️ Applying database migrations...")
    if not run_command("python manage.py migrate", cwd=backend_dir):
        print("❌ Failed to apply migrations")
        return False
    
    # Create superuser (optional)
    print("\n👤 Creating superuser (optional)...")
    print("You can skip this by pressing Ctrl+C")
    try:
        subprocess.run("python manage.py createsuperuser", shell=True, cwd=backend_dir)
    except KeyboardInterrupt:
        print("Skipped superuser creation")
    
    print("\n✅ Backend setup complete!")
    print("\n📝 Next steps:")
    print("1. Create a .env file in the backend directory with your GROQ_API_KEY")
    print("2. Run: cd backend && python manage.py runserver")
    
if __name__ == "__main__":
    main()