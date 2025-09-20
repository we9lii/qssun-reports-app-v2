# GitHub Repository Setup Script for Qssun Reports App

Write-Host "🚀 Setting up GitHub Repository and Uploading Code" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Get user information
$githubUsername = Read-Host "📧 Enter your GitHub username"
$repoName = Read-Host "📁 Enter repository name (default: qssun-reports-app)"

if ([string]::IsNullOrEmpty($repoName)) {
    $repoName = "qssun-reports-app"
}

$token = Read-Host "🔑 Enter Personal Access Token (from https://github.com/settings/tokens)" -AsSecureString

# Convert secure string to plain text
$tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

Write-Host ""
Write-Host "Creating repository..." -ForegroundColor Yellow

# Create repository using GitHub API
$headers = @{
    "Authorization" = "token $tokenPlain"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "Qssun-Reports-App"
}

$body = @{
    name = $repoName
    description = "Qssun Reports - Advanced maintenance and equipment management app"
    private = $false
    has_issues = $true
    has_projects = $true
    has_wiki = $true
    auto_init = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "✅ Repository created successfully!" -ForegroundColor Green
    Write-Host "📍 Repository URL: $($response.html_url)" -ForegroundColor Cyan
    Write-Host "📂 Git URL: $($response.clone_url)" -ForegroundColor Cyan
    
    # Setup Git remote
    Write-Host ""
    Write-Host "Setting up Git..." -ForegroundColor Yellow
    
    git remote add origin "https://$githubUsername`:$tokenPlain@github.com/$githubUsername/$repoName.git"
    
    # Push code
    Write-Host "Pushing code..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host ""
    Write-Host "🎉 Code uploaded successfully!" -ForegroundColor Green
    Write-Host "Now visit: https://github.com/$githubUsername/$repoName" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error creating repository:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Make sure:" -ForegroundColor Yellow
    Write-Host "- Personal Access Token is valid" -ForegroundColor Yellow
    Write-Host "- Token has correct scopes (repo, workflow)" -ForegroundColor Yellow
    Write-Host "- Repository name is not already used" -ForegroundColor Yellow
}

# Clean up token from memory
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")