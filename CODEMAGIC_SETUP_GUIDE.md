# 🚀 دليل إعداد Codemagic لبناء تطبيق iOS

## 📋 المتطلبات المطلوبة:

### 1. حسابات مطلوبة:
- [ ] حساب Codemagic (مجاني حتى 500 دقيقة بناء/شهر)
- [ ] حساب Apple Developer ($99/سنة)
- [ ] حساب GitHub (لرفع الكود)

### 2. الملفات المطلوبة:
- [ ] شهادة iOS (iOS Distribution Certificate)
- [ ] ملف Provisioning Profile
- [ ] مفتاح API من App Store Connect

## 🔧 خطوات الإعداد بالتفصيل:

### الخطوة 1: رفع الكود إلى GitHub
```bash
git init
git add .
git commit -m "Initial commit - Qssun Reports App"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### الخطوة 2: إعداد Apple Developer Account
1. سجل دخول إلى [developer.apple.com](https://developer.apple.com)
2. أنشئ معرف التطبيق (Bundle ID): `com.qssun.reports`
3. أنشئ شهادة توزيع (iOS Distribution Certificate)
4. أنشئ ملف Provisioning Profile

### الخطوة 3: إعداد Codemagic
1. اذهب إلى [codemagic.io](https://codemagic.io)
2. سجل الدخول باستخدام GitHub
3. اختر المستودع الخاص بالمشروع
4. اضغط على "Start new build"

### الخطوة 4: إعداد المتغيرات البيئية
في Codemagic، اذهب إلى:
- **Teams** → **Personal Account** → **Team settings** → **Environment variables**

أضف المتغيرات التالية:

```
# iOS Certificates (المحتوى من الملفات التي تنزلها من Apple)
CM_CERTIFICATE: -----BEGIN CERTIFICATE-----(محتوى الشهادة)
CM_CERTIFICATE_PASSWORD: كلمة_مرور_الشهادة
CM_PROVISIONING_PROFILE: (محتوى ملف .mobileprovision)

# App Store Connect API
APP_STORE_CONNECT_ISSUER_ID: (من App Store Connect)
APP_STORE_CONNECT_KEY_IDENTIFIER: (مفتاح API)
APP_STORE_CONNECT_PRIVATE_KEY: -----BEGIN PRIVATE KEY-----(المفتاح الخاص)
```

### الخطوة 5: تعديل ملف codemagic.yaml
استبدل `YOUR_EMAIL@example.com` ببريدك الإلكتروني في الملف.

### الخطوة 6: بدء البناء
1. اذهب إلى صفحة المشروع في Codemagic
2. اختر **Start new build**
3. اختر الفرع (main)
4. اختر المنصة (iOS أو Android أو كليهما)
5. اضغط **Start build**

## 📱 النتائج المتوقعة:

### بعد نجاح البناء ستحصل على:
- **ملف IPA** للـ iOS (جاهز للرفع إلى App Store)
- **ملف APK/AAB** للـ Android (جاهز للرفع إلى Google Play)
- **تقرير مفصل** عن عملية البناء

## 🚨 نصائح مهمة:

1. **للبداية**: جرب البناء بدون توقيع أولاً للتأكد من أن الكود يعمل
2. **الشهادات**: احفظ الشهادات والمفاتيح في مكان آمن
3. **الاختبار**: استخدم TestFlight قبل الرفع إلى App Store
4. **النسخ الاحتياطي**: احرص على عمل نسخ احتياطية للمفاتيح

## 🔍 استكشاف الأخطاء:

### إذا فشل البناء:
1. تحقق من سجلات الأخطاء في Codemagic
2. تأكد من أن جميع المتغيرات البيئية مضافة بشكل صحيح
3. تحقق من صلاحية الشهادات والملفات
4. جرب البناء محلياً أولاً

### للحصول على مساعدة:
- [وثائق Codemagic](https://docs.codemagic.io/)
- [دعم Codemagic](https://codemagic.io/contact/)

## 🎯 الخطوة التالية:
بعد نجاح البناء، يمكنك:
1. رفع التطبيق إلى App Store عبر App Store Connect
2. رفع التطبيق إلى Google Play Store
3. مشاركة ملف APK مباشرة للتحميل

هل تحتاج مساعدة في أي خطوة من هذه الخطوات؟