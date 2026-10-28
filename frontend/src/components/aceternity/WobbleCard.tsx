import React, { useRef, useCallback, useEffect } from 'react';
import './WobbleCard.css';

export interface WobbleCardProps {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const WobbleCard: React.FC<WobbleCardProps> = ({
  children,
  containerClassName = '',
  className = '',
  style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    const x = (e.clientX - (rectRef.current.left + rectRef.current.width / 2)) / 22;
    const y = (e.clientY - (rectRef.current.top + rectRef.current.height / 2)) / 22;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale3d(1, 1, 1)`;
      }
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
      // Remove transition while actively tracking mouse to prevent transition-fighting stutter
      cardRef.current.style.transition = 'none';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current) {
      // Smoothly animate back to center
      cardRef.current.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      cardRef.current.style.transform = 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)';
    }
  }, []);

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
    };
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`aceternity-wobble-card-container ${containerClassName}`}
    >
      {/* Studio Corner Crosshairs */}
      <span className="wobble-crosshair wobble-crosshair-tl" aria-hidden="true">+</span>
      <span className="wobble-crosshair wobble-crosshair-tr" aria-hidden="true">+</span>

      {/* Radial Dot Matrix Grid Texture */}
      <div className="wobble-card-noise-layer" aria-hidden="true" />

      {/* Content wrapper */}
      <div className={`wobble-card-content ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default WobbleCard;
