import React from 'react';
import './MovingBorder.css';

interface MovingBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
}

export const MovingBorderButton: React.FC<MovingBorderButtonProps> = ({
  borderRadius = '9999px',
  children,
  containerClassName = '',
  className = '',
  ...otherProps
}) => {
  return (
    <button
      className={`aceternity-moving-border-btn-wrapper ${containerClassName}`}
      style={{ borderRadius }}
      {...otherProps}
    >
      <span className="aceternity-border-glow" aria-hidden="true" />
      <span
        className={`aceternity-moving-border-content ${className}`}
        style={{ borderRadius }}
      >
        {children}
      </span>
    </button>
  );
};

export default MovingBorderButton;
