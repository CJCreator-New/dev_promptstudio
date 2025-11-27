import React, { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({ 
  message, 
  priority = 'polite', 
  clearAfter = 3000 
}) => {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && clearAfter > 0) {
      const timer = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = '';
        }
      }, clearAfter);
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      ref={regionRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};