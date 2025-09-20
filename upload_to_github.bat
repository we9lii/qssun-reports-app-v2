@echo off
echo 🚀 Setting up GitHub Repository
echo ==============================
echo.
echo 📋 Please create repository manually first:
echo 1. Go to: https://github.com/new
echo 2. Repository name: qssun-reports-app
echo 3. Description: Qssun Reports - Advanced maintenance and equipment management app
echo 4. Set to: Public
echo 5. DON'T add README or .gitignore
echo 6. Click: Create repository
echo.
echo After creating, enter your information:
echo.
set /p USERNAME=GitHub Username: 
set /p TOKEN=Personal Access Token: 
echo.
echo 📤 Uploading code...
echo.

REM Remove existing remote
git remote remove origin 2>nul

REM Add new remote
git remote add origin https://%USERNAME%:%TOKEN%@github.com/%USERNAME%/qssun-reports-app.git

REM Push code
git push -u origin main

echo.
echo ✅ Code uploaded successfully!
echo 🌐 Visit: https://github.com/%USERNAME%/qssun-reports-app
echo.
echo 🎯 NEXT STEPS:
echo 1. Go to Codemagic: https://codemagic.io
echo 2. Sign in with GitHub
echo 3. Select your repository
echo 4. Start building!
echo.
pause