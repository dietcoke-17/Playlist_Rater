import React from 'react';
import './BackgroundGrid.css';

interface BackgroundGridProps {
  children?: React.ReactNode;
  className?: string;
  pattern?: 'grid' | 'dots';
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  children,
  className = '',
  pattern = 'grid',
}) => {
  return (
    <div className={`aceternity-bg-wrapper ${className}`}>
      <div
        className={`aceternity-bg-pattern ${pattern === 'dots' ? 'pattern-dots' : 'pattern-grid'}`}
        aria-hidden="true"
      />
      <div className="aceternity-bg-radial-mask" aria-hidden="true" />
      {children}
    </div>
  );
};

export default BackgroundGrid;
