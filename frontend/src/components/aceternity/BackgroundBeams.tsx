import React from 'react';
import './BackgroundBeams.css';

export const BackgroundBeams: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`aceternity-beams-container ${className}`} aria-hidden="true">
      <svg
        className="aceternity-beams-svg"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.6">
          <path
            d="M-200 450C200 450 400 100 800 100C1200 100 1400 600 1800 600"
            stroke="url(#beam-gradient-1)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="beam-path beam-path-1"
          />
          <path
            d="M-200 700C300 700 600 300 1000 300C1400 300 1500 800 1800 800"
            stroke="url(#beam-gradient-2)"
            strokeWidth="2"
            strokeDasharray="8 12"
            className="beam-path beam-path-2"
          />
          <path
            d="M-100 200C350 200 550 750 950 750C1350 750 1550 250 1750 250"
            stroke="url(#beam-gradient-3)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="beam-path beam-path-3"
          />
        </g>
        <defs>
          <linearGradient id="beam-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#A1A1AA" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4D4D8" stopOpacity="0" />
            <stop offset="50%" stopColor="#E4E4E7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#71717A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A1A1AA" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#52525B" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default BackgroundBeams;
