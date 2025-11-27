import React, { useEffect, useRef } from 'react';
import { trapFocus, restoreFocus } from '../utils/accessibility';

interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  restoreElement?: HTMLElement | null;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ 
  children, 
  active, 
  restoreElement 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (active && containerRef.current) {
      cleanupRef.current = trapFocus(containerRef.current);
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (!active && restoreElement) {
        restoreFocus(restoreElement);
      }
    };
  }, [active, restoreElement]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};