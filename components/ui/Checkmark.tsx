import React from 'react';

interface CheckmarkProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkmark: React.FC<CheckmarkProps> = ({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="checkmark-container">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="checkmark-input"
        />
        <label htmlFor={id} className="checkmark" />
      </div>
      {label && (
        <label htmlFor={id} className="text-sm font-medium cursor-pointer select-none">
          {label}
        </label>
      )}
      
      <style>{`
        .checkmark-container {
          position: relative;
          display: inline-block;
        }

        .checkmark-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          display: block;
          width: 30px;
          height: 30px;
          background-color: #ddd;
          border-radius: 10px;
          position: relative;
          transition: background-color 0.4s;
          overflow: hidden;
          cursor: pointer;
        }

        .checkmark-input:checked ~ .checkmark {
          background-color: #08bb68;
        }

        .checkmark::after {
          content: "";
          position: absolute;
          width: 5px;
          height: 10px;
          border-right: 3px solid #fff;
          border-bottom: 3px solid #fff;
          top: 44%;
          left: 50%;
          transform: translate(-50%, -50%) rotateZ(40deg) scale(10);
          opacity: 0;
          transition: all 0.4s;
        }

        .checkmark-input:checked ~ .checkmark::after {
          opacity: 1;
          transform: translate(-50%, -50%) rotateZ(40deg) scale(1);
        }

        .checkmark-input:disabled ~ .checkmark {
          background-color: #f0f0f0;
          cursor: not-allowed;
        }

        .checkmark-input:disabled:checked ~ .checkmark {
          background-color: #a0a0a0;
        }

        /* Dark mode support */
        :global(.dark) .checkmark {
          background-color: #4a5568;
        }

        :global(.dark) .checkmark-input:checked ~ .checkmark {
          background-color: #08bb68;
        }

        :global(.dark) .checkmark-input:disabled ~ .checkmark {
          background-color: #2d3748;
        }

        :global(.dark) .checkmark-input:disabled:checked ~ .checkmark {
          background-color: #4a5568;
        }
      `}</style>
    </div>
  );
};

export default Checkmark;