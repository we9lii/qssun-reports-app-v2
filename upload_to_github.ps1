# Manual GitHub Upload Script
# This script helps you upload your code after manually creating the GitHub repository

Write-Host "🚀 GitHub Code Upload Helper" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

Write-Host ""
Write-Host "📋 STEP 1: Create GitHub Repository Manually" -ForegroundColor Yellow
Write-Host "1. Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host "2. Repository name: qssun-reports-app" -ForegroundColor Cyan
Write-Host "3. Description: Qssun Reports - Advanced maintenance and equipment management app" -ForegroundColor Cyan
Write-Host "4. Set to: Public" -ForegroundColor Cyan
Write-Host "5. DON'T add README or .gitignore" -ForegroundColor Cyan
Write-Host "6. Click: Create repository" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 STEP 2: Get Your Information" -ForegroundColor Yellow
$githubUsername = Read-Host "Enter your GitHub username"
$repoName = "qssun-reports-app"

Write-Host ""
Write-Host "📋 STEP 3: Choose Authentication Method" -ForegroundColor Yellow
Write-Host "1. Personal Access Token (Recommended)" -ForegroundColor Cyan
Write-Host "2. Password (Less secure)" -ForegroundColor Cyan
$choice = Read-Host "Choose method (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "To create Personal Access Token:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host "2. Click: Generate new token (classic)" -ForegroundColor Cyan
    Write-Host "3. Select scopes: repo, workflow" -ForegroundColor Cyan
    Write-Host "4. Copy the token" -ForegroundColor Cyan
    
    $token = Read-Host "Enter your Personal Access Token" -AsSecureString
    $tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))
    $repoUrl = "https://$githubUsername`:$tokenPlain@github.com/$githubUsername/$repoName.git"
} else {
    $password = Read-Host "Enter your GitHub password" -AsSecureString
    $passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
    $repoUrl = "https://$githubUsername`:$passwordPlain@github.com/$githubUsername/$repoName.git"
}

Write-Host ""
Write-Host "📤 Uploading code..." -ForegroundColor Yellow

try {
    # Remove existing remote if any
    git remote remove origin 2>$null
    
    # Add new remote
    git remote add origin $repoUrl
    
    # Push code
    git push -u origin main
    
    Write-Host ""
    Write-Host "✅ Code uploaded successfully!" -ForegroundColor Green
    Write-Host "📍 Repository URL: https://github.com/$githubUsername/$repoName" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error uploading code:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Green
Write-Host "1. Go to Codemagic: https://codemagic.io" -ForegroundColor Cyan
Write-Host "2. Sign in with GitHub" -ForegroundColor Cyan
Write-Host "3. Select your repository" -ForegroundColor Cyan
Write-Host "4. Start building!" -ForegroundColor Cyan

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")