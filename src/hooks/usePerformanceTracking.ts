import { useEffect, useRef } from 'react';
import { performanceMonitor } from '../services/performanceMonitoring';

/**
 * Track component render performance
 */
export const usePerformanceTracking = (componentName: string) => {
  const startTime = useRef(performance.now());

  useEffect(() => {
    return () => {
      const duration = performance.now() - startTime.current;
      performanceMonitor.trackRender(componentName, duration);
    };
  }, [componentName]);
};

/**
 * Track API call performance
 */
export const useAPITracking = () => {
  return async <T>(
    endpoint: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    let status = 200;

    try {
      const result = await fn();
      return result;
    } catch (error: any) {
      status = error.status || 0;
      throw error;
    } finally {
      performanceMonitor.trackAPICall(endpoint, performance.now() - start, status);
    }
  };
};

/**
 * Track custom user interactions
 */
export const useInteractionTracking = () => {
  return (action: string, metadata?: Record<string, any>) => {
    performanceMonitor.trackCustomMetric(`interaction_${action}`, performance.now(), metadata);
  };
};
