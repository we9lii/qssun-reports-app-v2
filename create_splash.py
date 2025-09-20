from PIL import Image
import requests
from io import BytesIO

# تحميل الأيقونة الأصلية
response = requests.get('https://www2.0zz0.com/2025/09/20/11/982485578.png')
icon = Image.open(BytesIO(response.content))

# إنشاء صورة بيضاء بحجم 1920x1920
splash = Image.new('RGB', (1920, 1920), 'white')

# حساب موقع وضع الأيقونة في المنتصف
icon_width, icon_height = icon.size
x = (1920 - icon_width) // 2
y = (1920 - icon_height) // 2

# وضع الأيقونة في المنتصف
splash.paste(icon, (x, y), icon if icon.mode == 'RGBA' else None)

# حفظ الصورة
splash.save('resources/splash.png')
print("✅ تم إنشاء صورة splash بنجاح!")