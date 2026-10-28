import React from 'react';
import './LampEffect.css';

interface LampEffectProps {
  children?: React.ReactNode;
  className?: string;
}

export const LampEffect: React.FC<LampEffectProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`aceternity-lamp-container ${className}`}>
      <div className="aceternity-lamp-structure" aria-hidden="true">
        {/* Left lamp cone */}
        <div className="lamp-cone lamp-cone-left" />
        {/* Right lamp cone */}
        <div className="lamp-cone lamp-cone-right" />
        {/* Center lamp glow ball */}
        <div className="lamp-center-glow" />
        {/* Lamp horizontal ceiling line */}
        <div className="lamp-light-bar" />
        {/* Ambient floor shadow */}
        <div className="lamp-ambient-blur" />
      </div>

      <div className="aceternity-lamp-content">{children}</div>
    </div>
  );
};

export default LampEffect;
