import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP, Metric } from 'web-vitals';

// Performance Budgets (in milliseconds)
export const PERFORMANCE_BUDGETS = {
  LCP: 2500,    // Largest Contentful Paint
  FID: 100,     // First Input Delay
  CLS: 0.1,     // Cumulative Layout Shift
  FCP: 1800,    // First Contentful Paint
  TTFB: 800,    // Time to First Byte
  INP: 200,     // Interaction to Next Paint
};

interface PerformanceData {
  metric: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
}

class PerformanceMonitor {
  private endpoint = '/api/metrics'; // Replace with your endpoint
  private buffer: PerformanceData[] = [];
  private flushInterval = 30000; // 30s

  constructor() {
    this.startAutoFlush();
  }

  // Track Core Web Vitals
  trackWebVitals() {
    const sendMetric = (metric: Metric) => {
      const data: PerformanceData = {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      this.buffer.push(data);
      this.checkBudget(metric);
      
      // Log to console in dev
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${metric.rating}] ${metric.name}:`, metric.value);
      }
    };

    onCLS(sendMetric);
    onFID(sendMetric);
    onLCP(sendMetric);
    onFCP(sendMetric);
    onTTFB(sendMetric);
    onINP(sendMetric);
  }

  // Check if metric exceeds budget
  private checkBudget(metric: Metric) {
    const budget = PERFORMANCE_BUDGETS[metric.name as keyof typeof PERFORMANCE_BUDGETS];
    if (budget && metric.value > budget) {
      console.warn(`⚠️ ${metric.name} exceeded budget: ${metric.value}ms > ${budget}ms`);
    }
  }

  // Track custom metrics
  trackCustomMetric(name: string, value: number, metadata?: Record<string, any>) {
    this.buffer.push({
      metric: name,
      value,
      rating: 'good',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...metadata,
    } as any);
  }

  // Track API performance
  trackAPICall(endpoint: string, duration: number, status: number) {
    this.trackCustomMetric('api_call', duration, { endpoint, status });
  }

  // Track component render time
  trackRender(component: string, duration: number) {
    if (duration > 16) { // > 1 frame
      this.trackCustomMetric('slow_render', duration, { component });
    }
  }

  // Flush metrics to backend
  private async flush() {
    if (this.buffer.length === 0) return;

    const data = [...this.buffer];
    this.buffer = [];

    try {
      // Send to your analytics endpoint
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
      // Re-add to buffer on failure
      this.buffer.push(...data);
    }
  }

  private startAutoFlush() {
    setInterval(() => this.flush(), this.flushInterval);
    
    // Flush on page unload
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }

  // Get current metrics summary
  getSummary() {
    return this.buffer.reduce((acc, item) => {
      if (!acc[item.metric]) {
        acc[item.metric] = { count: 0, total: 0, avg: 0 };
      }
      acc[item.metric].count++;
      acc[item.metric].total += item.value;
      acc[item.metric].avg = acc[item.metric].total / acc[item.metric].count;
      return acc;
    }, {} as Record<string, { count: number; total: number; avg: number }>);
  }
}

// Error Tracking
class ErrorTracker {
  private errors: Array<{ message: string; stack?: string; timestamp: number }> = [];

  init() {
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise: ${event.reason}`,
        timestamp: Date.now(),
      });
    });
  }

  trackError(error: { message: string; stack?: string; timestamp: number }) {
    this.errors.push(error);
    console.error('[Error Tracked]', error);
    
    // Send to error tracking service (Sentry, LogRocket, etc.)
    // Sentry.captureException(error);
  }

  getErrors() {
    return this.errors;
  }
}

// Resource Timing
export const trackResourceTiming = () => {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const summary = resources.reduce((acc, resource) => {
    const type = resource.initiatorType;
    if (!acc[type]) acc[type] = { count: 0, totalSize: 0, totalDuration: 0 };
    
    acc[type].count++;
    acc[type].totalSize += resource.transferSize || 0;
    acc[type].totalDuration += resource.duration;
    
    return acc;
  }, {} as Record<string, { count: number; totalSize: number; totalDuration: number }>);

  return summary;
};

// Long Task Detection
export const detectLongTasks = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn('Long task detected:', entry.duration, 'ms');
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  }
};

// Singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const errorTracker = new ErrorTracker();

// Initialize all monitoring
export const initPerformanceMonitoring = () => {
  performanceMonitor.trackWebVitals();
  errorTracker.init();
  detectLongTasks();
  
  console.log('✅ Performance monitoring initialized');
};
