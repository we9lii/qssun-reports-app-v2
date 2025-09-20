import React from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  isLoading = false
}) => {
  const sizeClasses = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4'
  };

  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`btn ${sizeClasses[size]} ${className}`}
      >
        {isLoading ? 'جاري التحميل...' : children}
      </button>
      
      <style>{`
        .btn {
          position: relative;
          display: inline-block;
          margin: 0;
          padding: 8px 16px;
          text-align: center;
          font-size: 14px;
          font-family: 'Cairo', 'Segoe UI', sans-serif;
          letter-spacing: 0.5px;
          text-decoration: none;
          color: #f59e0b;
          background: transparent;
          cursor: pointer;
          transition: ease-out 0.5s;
          border: 2px solid #f59e0b;
          border-radius: 6px;
          box-shadow: inset 0 0 0 0 #fbbf24;
        }

        .btn:hover {
          color: white;
          box-shadow: inset 0 -100px 0 0 #f59e0b;
        }

        .btn:active {
          transform: scale(0.9);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn:disabled:hover {
          transform: none;
          box-shadow: inset 0 0 0 0 #fbbf24;
          color: #f59e0b;
        }
      `}</style>
    </>
  );
};