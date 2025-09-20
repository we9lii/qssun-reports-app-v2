# إنشاء مستودع GitHub جديد

# الخطوات اليدوية لإنشاء المستودع:

# 1. اذهب إلى https://github.com/new
# 2. اختر اسم المستودع: qssun-reports-app
# 3. اجعله عام (Public)
# 4. لا تضف README أو .gitignore (لديناها جاهزة)
# 5. انسخ رابط المستودع: https://github.com/YOUR_USERNAME/qssun-reports-app.git

# بعد إنشاء المستودع، شغل الأوامر التالية:

# إضافة رابط المستودع البعيد
git remote add origin https://github.com/YOUR_USERNAME/qssun-reports-app.git

# رفع الكود
git push -u origin main

# أو إذا كنت تريد استخدام رمز الوصول (Personal Access Token):
# git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/qssun-reports-app.git
# git push -u origin main

# للتحقق من الرابط:
git remote -v

# معلومات التطبيق:
# - اسم التطبيق: Qssun Reports Beta
# - Bundle ID: com.qssun.reports
# - الوصف: تطبيق متطور لإدارة تقارير الصيانة والمعدات