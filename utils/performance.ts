import { onCLS, onFID, onLCP } from 'web-vitals';

// Report Core Web Vitals
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onLCP(onPerfEntry);
  } else {
    // Default to console logging in development
    const logMetric = (metric: any) => {
      console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value), metric);
    };
    onCLS(logMetric);
    onFID(logMetric);
    onLCP(logMetric);
  }
};

// Generic Debounce Function
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: any;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}