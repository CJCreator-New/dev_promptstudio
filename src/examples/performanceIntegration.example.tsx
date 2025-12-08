/**
 * Performance Monitoring Integration Examples
 * Copy these patterns into your actual components
 */

import { useEffect } from 'react';
import { usePerformanceTracking, useAPITracking, useInteractionTracking } from '../hooks/usePerformanceTracking';
import { performanceMonitor, errorTracker } from '../services/performanceMonitoring';

// Example 1: Track Component Performance
function MyComponent() {
  usePerformanceTracking('MyComponent');
  return <div>My Component</div>;
}

// Example 2: Track API Calls
function EnhancePrompt() {
  const trackAPI = useAPITracking();

  const handleEnhance = async () => {
    await trackAPI('/api/enhance', async () => {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'test' }),
      });
      return response.json();
    });
  };

  return <button onClick={handleEnhance}>Enhance</button>;
}

// Example 3: Track User Interactions
function InteractiveButton() {
  const trackInteraction = useInteractionTracking();

  const handleClick = () => {
    trackInteraction('button_click', { button: 'enhance' });
  };

  return <button onClick={handleClick}>Click Me</button>;
}

// Example 4: Track Custom Metrics
function CustomMetrics() {
  const handleOperation = async () => {
    const start = performance.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    performanceMonitor.trackCustomMetric('heavy_operation', performance.now() - start);
  };

  return <button onClick={handleOperation}>Process Data</button>;
}

// Example 5: Track Page Load
function App() {
  useEffect(() => {
    performanceMonitor.trackCustomMetric('app_load', performance.now());
  }, []);

  return <div>App</div>;
}

// Example 6: Error Tracking
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    errorTracker.trackError({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
    });
  }

  render() {
    return this.props.children;
  }
}
