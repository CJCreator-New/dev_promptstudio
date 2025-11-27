/**
 * Responsive design utilities
 */

// Breakpoint constants
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  max: 2560
} as const;

// Touch target minimum size (44x44px per WCAG guidelines)
export const MIN_TOUCH_TARGET = 44;

/**
 * Check if element meets minimum touch target size
 */
export const meetsTouchTargetSize = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return rect.width >= MIN_TOUCH_TARGET && rect.height >= MIN_TOUCH_TARGET;
};

/**
 * Handle viewport orientation changes
 */
export const handleOrientationChange = (callback: () => void): (() => void) => {
  const handler = () => {
    // Small delay to ensure viewport dimensions are updated
    setTimeout(callback, 100);
  };
  
  window.addEventListener('orientationchange', handler);
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('orientationchange', handler);
    window.removeEventListener('resize', handler);
  };
};

/**
 * Check if viewport width is within supported range
 */
export const isValidViewportWidth = (width: number): boolean => {
  return width >= BREAKPOINTS.xs && width <= BREAKPOINTS.max;
};

/**
 * Prevent horizontal scrolling by checking element overflow
 */
export const checkHorizontalOverflow = (element: HTMLElement): boolean => {
  return element.scrollWidth > element.clientWidth;
};