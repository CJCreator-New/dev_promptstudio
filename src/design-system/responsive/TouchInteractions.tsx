import React, { ReactNode, useRef, useState } from 'react';
import { useDeviceCapabilities } from '../../hooks/useBreakpoint';

interface TouchTargetProps {
  children: ReactNode;
  onTap?: () => void;
  minSize?: number;
  className?: string;
}

export const TouchTarget: React.FC<TouchTargetProps> = ({ 
  children, 
  onTap,
  minSize = 44,
  className = '' 
}) => {
  const { hasTouch } = useDeviceCapabilities();
  
  return (
    <button
      onClick={onTap}
      className={`
        ${hasTouch ? `min-w-[${minSize}px] min-h-[${minSize}px]` : ''}
        inline-flex items-center justify-center
        touch-manipulation
        ${className}
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
    </button>
  );
};

interface SwipeableProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
}

export const Swipeable: React.FC<SwipeableProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  className = '',
}) => {
  const startX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && onSwipeLeft) onSwipeLeft();
      if (diff < 0 && onSwipeRight) onSwipeRight();
    }
    
    setIsDragging(false);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`touch-pan-y ${className}`}
    >
      {children}
    </div>
  );
};
