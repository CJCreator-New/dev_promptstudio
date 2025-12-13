import React, { useState, useRef, useEffect } from 'react';

interface ImageComparisonProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  defaultPosition?: number;
  className?: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Before',
  afterAlt = 'After',
  defaultPosition = 50,
  className = ''
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => setIsDragging(false));
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', () => setIsDragging(false));
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      <img src={beforeSrc} alt={beforeAlt} className="w-full h-full object-cover" />
      
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={afterSrc} alt={afterAlt} className="w-full h-full object-cover" />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
        {beforeAlt}
      </div>
      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
        {afterAlt}
      </div>
    </div>
  );
};
