import React, { useRef, useCallback, useEffect } from 'react';
import './FollowingPointer.css';

export interface FollowerPointerCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
  pointerClassName?: string;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export const FollowerPointerCard: React.FC<FollowerPointerCardProps> = ({
  children,
  className = '',
  title,
  pointerClassName = '',
  onMouseMove: onMouseMoveProp,
  onClick,
  style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!cardRef.current || !followerRef.current) return;
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    const x = clientX - rectRef.current.left;
    const y = clientY - rectRef.current.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseMoveProp) onMouseMoveProp(e);
    updatePosition(e.clientX, e.clientY);
  }, [onMouseMoveProp, updatePosition]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    if (followerRef.current) {
      // Position instantly before becoming visible to prevent jumping from (0,0)
      if (rectRef.current) {
        const x = e.clientX - rectRef.current.left;
        const y = e.clientY - rectRef.current.top;
        followerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      followerRef.current.classList.add('is-active');
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (followerRef.current) {
      followerRef.current.classList.remove('is-active');
    }
  }, []);

  useEffect(() => {
    // Invalidate cached rect on scroll/resize without forcing synchronous layout
    const handleScrollOrResize = () => {
      rectRef.current = null;
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
      onClick={onClick}
      style={style}
      className={`follower-pointer-card-container ${className}`}
    >
      {/* Zero-render direct DOM follower */}
      <div
        ref={followerRef}
        className={`follower-pointer-wrapper ${pointerClassName}`}
        aria-hidden="true"
      >
        {/* Authentic Aceternity cursor arrow with calibrated tip origin */}
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="1"
          viewBox="0 0 16 16"
          className="follower-pointer-arrow"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
        </svg>

        {/* Studio Metadata Pill */}
        {title && (
          <div className="follower-pointer-pill">
            {title}
          </div>
        )}
      </div>

      {children}
    </div>
  );
};

export default FollowerPointerCard;
