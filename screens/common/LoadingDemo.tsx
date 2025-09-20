import React, { useState } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import LoadingPage from '../../components/ui/LoadingPage';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const LoadingDemo: React.FC = () => {
  const [showFullPageLoader, setShowFullPageLoader] = useState(false);

  const handleShowFullPageLoader = () => {
    setShowFullPageLoader(true);
    // إخفاء اللودر بعد 3 ثواني للعرض التوضيحي
    setTimeout(() => {
      setShowFullPageLoader(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            عرض مكونات التحميل
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            مجموعة متنوعة من مكونات التحميل المصممة خصيصاً لتطبيق قصن
          </p>
        </div>

        {/* أحجام مختلفة */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              الأحجام المختلفة
            </h2>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="text-center">
                <LoadingSpinner size="small" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">صغير</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="medium" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">متوسط</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="large" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">كبير</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ألوان مختلفة */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              الألوان المختلفة
            </h2>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="text-center">
                <LoadingSpinner color="primary" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">أساسي</p>
              </div>
              <div className="text-center">
                <LoadingSpinner color="secondary" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">ثانوي</p>
              </div>
              <div className="text-center bg-gray-800 p-4 rounded-lg">
                <LoadingSpinner color="white" />
                <p className="mt-2 text-sm text-white">أبيض</p>
              </div>
            </div>
          </div>
        </Card>

        {/* استخدامات مختلفة */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              استخدامات مختلفة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* في الأزرار */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  في الأزرار
                </h3>
                <Button className="flex items-center gap-2" disabled>
                  <LoadingSpinner size="small" color="white" />
                  جاري الحفظ...
                </Button>
              </div>

              {/* في البطاقات */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  في البطاقات
                </h3>
                <Card className="p-4 min-h-[120px] flex items-center justify-center">
                  <div className="text-center">
                    <LoadingSpinner size="medium" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      جاري تحميل البيانات...
                    </p>
                  </div>
                </Card>
              </div>

              {/* مضمن في النص */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  مضمن في النص
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                  <LoadingSpinner size="small" />
                  <span>جاري المعالجة</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* صفحة التحميل الكاملة */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              صفحة التحميل الكاملة
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              اضغط على الزر لعرض صفحة التحميل الكاملة (ستختفي تلقائياً بعد 3 ثواني)
            </p>
            <Button onClick={handleShowFullPageLoader}>
              عرض صفحة التحميل الكاملة
            </Button>
          </div>
        </Card>

        {/* كود المثال */}
        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              مثال على الاستخدام
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-800 dark:text-gray-200">
{`// استخدام بسيط
<LoadingSpinner />

// مع خصائص مخصصة
<LoadingSpinner 
  size="large" 
  color="primary" 
  label="جاري تحميل التقارير..." 
/>

// صفحة تحميل كاملة
<LoadingPage 
  message="جاري تحميل لوحة التحكم..." 
  showLogo={true} 
/>`}
              </pre>
            </div>
          </div>
        </Card>
      </div>

      {/* صفحة التحميل الكاملة */}
      {showFullPageLoader && (
        <LoadingPage message="جاري تحميل البيانات..." />
      )}
    </div>
  );
};

export default LoadingDemo;