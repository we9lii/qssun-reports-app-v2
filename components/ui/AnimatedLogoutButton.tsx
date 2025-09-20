import React from 'react';
import { LogOut } from 'lucide-react';

interface AnimatedLogoutButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
  disabled?: boolean;
}

export const AnimatedLogoutButton: React.FC<AnimatedLogoutButtonProps> = ({
  onClick,
  text = "تسجيل الخروج",
  className = '',
  disabled = false
}) => {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`animated-logout-btn ${className}`}
        aria-label={text}
      >
        <div className="sign">
          <LogOut size={12} />
        </div>
        <div className="text">{text}</div>
      </button>
      
      <style>{`
        .animated-logout-btn {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 25px;
          height: 25px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition-duration: .3s;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .animated-logout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .animated-logout-btn:disabled:hover {
          width: 25px;
          border-radius: 50%;
        }

        /* plus sign */
        .sign {
          width: 100%;
          transition-duration: .3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sign svg {
          width: 12px;
          color: white;
        }

        /* text */
        .text {
          position: absolute;
          right: 0%;
          width: 0%;
          opacity: 0;
          color: white;
          font-size: 0.8em;
          font-weight: 600;
          transition-duration: .3s;
          white-space: nowrap;
        }

        /* hover effect on button width */
        .animated-logout-btn:hover:not(:disabled) {
          width: 90px;
          border-radius: 15px;
          transition-duration: .3s;
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .animated-logout-btn:hover:not(:disabled) .sign {
          width: 30%;
          transition-duration: .3s;
          padding-left: 8px;
        }

        /* hover effect button's text */
        .animated-logout-btn:hover:not(:disabled) .text {
          opacity: 1;
          width: 70%;
          transition-duration: .3s;
          padding-right: 6px;
        }

        /* button click effect */
        .animated-logout-btn:active:not(:disabled) {
          transform: translate(2px, 2px);
        }
      `}</style>
    </>
  );
};