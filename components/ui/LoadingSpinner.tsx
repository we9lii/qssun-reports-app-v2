import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = '',
  label = 'جاري التحميل...'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-11 h-11',
    large: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-amber-500',
    secondary: 'text-amber-400',
    white: 'text-white'
  };

  return (
    <div 
      className={`loading-spinner-container ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status" 
      aria-label={label}
      style={{
        '--uib-size': size === 'small' ? '24px' : size === 'medium' ? '45px' : '64px',
        '--uib-color': color === 'primary' ? '#f59e0b' : color === 'secondary' ? '#fbbf24' : '#ffffff',
        '--uib-speed': '1.75s',
        '--uib-bg-opacity': '0.1'
      } as React.CSSProperties}
    >
      <div className="half first-half"></div>
      <div className="half second-half"></div>
      
      <style>{`
        .loading-spinner-container {
          position: relative;
          display: flex;
          flex-direction: column;
          height: var(--uib-size);
          width: var(--uib-size);
          transform: rotate(45deg);
          animation: rotate calc(var(--uib-speed) * 2) ease-in-out infinite;
        }

        .half {
          --uib-half-size: calc(var(--uib-size) * 0.435);
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--uib-half-size);
          height: var(--uib-half-size);
          overflow: hidden;
          isolation: isolate;
        }

        .first-half {
          top: 8.25%;
          left: 8.25%;
          border-radius: 50% 50% calc(var(--uib-size) / 15);
        }

        .second-half {
          bottom: 8.25%;
          right: 8.25%;
          transform: rotate(180deg);
          align-self: flex-end;
          border-radius: 50% 50% calc(var(--uib-size) / 15);
        }

        .second-half::after {
          animation-delay: calc(var(--uib-speed) * -1);
        }

        .half::before {
          content: '';
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: var(--uib-color);
          opacity: var(--uib-bg-opacity);
          transition: background-color 0.3s ease;
        }

        .half::after {
          content: '';
          position: relative;
          z-index: 1;
          display: block;
          background-color: var(--uib-color);
          height: 100%;
          transform: rotate(45deg) translate(-3%, 50%) scaleX(1.2);
          width: 100%;
          transform-origin: bottom right;
          border-radius: 0 0 calc(var(--uib-size) / 20) 0;
          animation: flow calc(var(--uib-speed) * 2) linear infinite both;
          transition: background-color 0.3s ease;
        }

        @keyframes flow {
          0% {
            transform: rotate(45deg) translate(-3%, 50%) scaleX(1.2);
          }
          30% {
            transform: rotate(45deg) translate(115%, 50%) scaleX(1.2);
          }
          30.001%, 50% {
            transform: rotate(0deg) translate(-85%, -85%) scaleX(1);
          }
          80%, 100% {
            transform: rotate(0deg) translate(0%, 0%) scaleX(1);
          }
        }

        @keyframes rotate {
          0%, 30% {
            transform: rotate(45deg);
          }
          50%, 80% {
            transform: rotate(225deg);
          }
          100% {
            transform: rotate(405deg);
          }
        }

        /* تحسينات للشاشات الصغيرة */
        @media (max-width: 768px) {
          .loading-spinner-container {
            --uib-size: ${size === 'large' ? '48px' : size === 'medium' ? '35px' : '20px'};
          }
        }

        /* تحسينات للوضع المظلم */
        @media (prefers-color-scheme: dark) {
          .half::before {
            opacity: calc(var(--uib-bg-opacity) * 1.5);
          }
        }

        /* تقليل الحركة للمستخدمين الذين يفضلون ذلك */
        @media (prefers-reduced-motion: reduce) {
          .loading-spinner-container {
            animation-duration: calc(var(--uib-speed) * 4);
          }
          .half::after {
            animation-duration: calc(var(--uib-speed) * 4);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;