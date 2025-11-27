import { useEffect, RefObject } from 'react';

/**
 * Hook for handling click outside events
 */
export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler]);
};