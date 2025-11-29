interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: number;
}

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  const analyticsEvent: AnalyticsEvent = {
    event,
    properties,
    timestamp: Date.now()
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties);
  }

  // Store in localStorage for debugging
  try {
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(analyticsEvent);
    // Keep only last 100 events
    if (events.length > 100) events.shift();
    localStorage.setItem('analytics_events', JSON.stringify(events));
  } catch (e) {
    console.error('Failed to store analytics event', e);
  }
};

export const getAnalytics = (): AnalyticsEvent[] => {
  try {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  } catch {
    return [];
  }
};

export const clearAnalytics = () => {
  localStorage.removeItem('analytics_events');
};
