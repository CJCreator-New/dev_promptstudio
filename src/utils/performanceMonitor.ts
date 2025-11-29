/**
 * Performance monitoring utilities for tracking operations
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

const metrics: PerformanceMetric[] = [];

export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  
  performance.mark(startMark);
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      performance.mark(endMark);
      recordMetric(name, startMark, endMark);
    });
  } else {
    performance.mark(endMark);
    recordMetric(name, startMark, endMark);
    return undefined;
  }
};

const recordMetric = (name: string, startMark: string, endMark: string) => {
  performance.measure(name, startMark, endMark);
  const measure = performance.getEntriesByName(name)[0];
  
  if (measure) {
    const metric: PerformanceMetric = {
      name,
      duration: measure.duration,
      timestamp: Date.now()
    };
    
    metrics.push(metric);
    console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
    
    if (measure.duration > 1000) {
      console.warn(`⚠️ Slow operation: ${name} took ${measure.duration.toFixed(2)}ms`);
    }
    
    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.shift();
    }
  }
};

export const getMetrics = () => [...metrics];

export const clearMetrics = () => {
  metrics.length = 0;
  performance.clearMarks();
  performance.clearMeasures();
};
