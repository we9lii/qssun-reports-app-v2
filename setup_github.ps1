# سكريبت PowerShell لإعداد GitHub ورفع الكود

Write-Host "🚀 إعداد مستودع GitHub ورفع الكود" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# طلب معلومات المستخدم
$githubUsername = Read-Host "📧 أدخل اسم مستخدم GitHub الخاص بك"
$repoName = Read-Host "📁 أدخل اسم المستودع (افتراضي: qssun-reports-app)"

if ([string]::IsNullOrEmpty($repoName)) {
    $repoName = "qssun-reports-app"
}

$token = Read-Host "🔑 أدخل Personal Access Token (من https://github.com/settings/tokens)" -AsSecureString

# تحويل الرمز إلى نص عادي
$tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

Write-Host ""
Write-Host "جاري إنشاء المستودع..." -ForegroundColor Yellow

# إنشاء المستودع باستخدام GitHub API
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
    
    Write-Host "✅ تم إنشاء المستودع بنجاح!" -ForegroundColor Green
    Write-Host "📍 رابط المستودع: $($response.html_url)" -ForegroundColor Cyan
    Write-Host "📂 رابط Git: $($response.clone_url)" -ForegroundColor Cyan
    
    # إضافة رابط المستودع البعيد
    Write-Host ""
    Write-Host "جاري إعداد Git..." -ForegroundColor Yellow
    
    git remote add origin "https://$githubUsername`:$tokenPlain@github.com/$githubUsername/$repoName.git"
    
    # رفع الكود
    Write-Host "جاري رفع الكود..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host ""
    Write-Host "🎉 تم رفع الكود بنجاح!" -ForegroundColor Green
    Write-Host "الآن يمكنك الذهاب إلى: https://github.com/$githubUsername/$repoName" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ حدث خطأ أثناء إنشاء المستودع:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 تأكد من:" -ForegroundColor Yellow
    Write-Host "- صحة Personal Access Token" -ForegroundColor Yellow
    Write-Host "- أنك قمت بإنشاء التوكن بالصلاحيات الصحيحة (repo, workflow)" -ForegroundColor Yellow
    Write-Host "- أن اسم المستودع غير مستخدم مسبقاً" -ForegroundColor Yellow
}

# تنظيف الرمز من الذاكرة
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

Write-Host ""
Write-Host "اضغط على أي مفتاح للخروج..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")