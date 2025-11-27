/**
 * Performance optimization utilities
 */
import { onCLS, onFID, onLCP } from 'web-vitals';

/**
 * Report Core Web Vitals
 */
export const reportWebVitals = (onPerfEntry?: (metric: any) => void): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onLCP(onPerfEntry);
  } else {
    const logMetric = (metric: any) => {
      console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value), metric);
    };
    onCLS(logMetric);
    onFID(logMetric);
    onLCP(logMetric);
  }
};

/**
 * Debounce function to limit execution frequency
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function to limit execution rate
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Measure component render time
 */
export const measureRenderTime = (componentName: string) => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    const renderTime = end - start;
    
    if (renderTime > 16) { // > 1 frame at 60fps
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
    
    return renderTime;
  };
};