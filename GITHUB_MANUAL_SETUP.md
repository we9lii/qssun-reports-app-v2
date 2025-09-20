# دليل إنشاء مستودع GitHub ورفع الكود

## 🎯 الخطوات المطلوبة:

### 1. إنشاء Personal Access Token:
1. اذهب إلى: https://github.com/settings/tokens
2. انقر على "Generate new token" (classic)
3. اختر الاسم: "Qssun Reports App"
4. حدد الصلاحيات التالية:
   - ✅ repo (كامل)
   - ✅ workflow
5. انقر على "Generate token"
6. انسخ الرمز واحفظه في مكان آمن

### 2. إنشاء المستودع يدوياً:
1. اذهب إلى: https://github.com/new
2. اسم المستودع: `qssun-reports-app`
3. الوصف: `Qssun Reports - Advanced maintenance and equipment management app`
4. اختر: Public
5. لا تضف README أو .gitignore
6. انقر على "Create repository"

### 3. رفع الكود:
بعد إنشاء المستودع، استخدم الأوامر التالية (استبدل `YOUR_USERNAME` و`YOUR_TOKEN`):

```bash
# إضافة رابط المستودع
git remote add origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/qssun-reports-app.git

# رفع الكود
git push -u origin main
```

### 4. التحقق:
```bash
git remote -v
```

## 📋 ملاحظات مهمة:
- تم إعداد الكود بالكامل وجاهز للرفع
- ملف `.gitignore` شامل لجميع الملفات غير الضرورية
- التطبيق جاهز لـ: iOS، Android، وWeb
- ملف `codemagic.yaml` جاهز للبناء التلقائي

## 🔗 روابط مفيدة:
- GitHub: https://github.com/new
- Personal Tokens: https://github.com/settings/tokens
- Codemagic: https://codemagic.io