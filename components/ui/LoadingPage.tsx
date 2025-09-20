import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingPageProps {
  message?: string;
  showLogo?: boolean;
  className?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'جاري تحميل البيانات...',
  showLogo = true,
  className = ''
}) => {
  return (
    <div className={`loading-page-container ${className}`}>
      <div className="loading-content">
        {showLogo && (
          <div className="logo-container mb-8">
            <div className="logo-placeholder">
              {/* يمكن استبدال هذا بشعار قصن الفعلي */}
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">ق</span>
              </div>
            </div>
          </div>
        )}
        
        <LoadingSpinner size="large" color="primary" />
        
        <div className="message-container mt-6">
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            {message}
          </p>
          <div className="loading-dots mt-2">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>

      <style>{`
        .loading-page-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .dark .loading-page-container {
          background: #0f172a;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
        }

        .logo-container {
          animation: logoFloat 3s ease-in-out infinite;
        }

        .message-container {
          max-width: 300px;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 4px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background-color: #f59e0b;
          border-radius: 50%;
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes dotPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        /* تحسينات للشاشات الصغيرة */
        @media (max-width: 768px) {
          .loading-content {
            padding: 1rem;
          }
          
          .message-container p {
            font-size: 1rem;
          }
        }

        /* تقليل الحركة للمستخدمين الذين يفضلون ذلك */
        @media (prefers-reduced-motion: reduce) {
          .logo-container {
            animation: none;
          }
          
          .dot {
            animation: none;
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;