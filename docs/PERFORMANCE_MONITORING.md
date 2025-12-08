# Performance Monitoring Setup Guide

Complete guide for monitoring DevPrompt Studio's performance with actionable insights.

---

## 🎯 Overview

**What's Monitored:**
- Core Web Vitals (LCP, FID, CLS, FCP, TTFB, INP)
- Real User Monitoring (RUM)
- Error Tracking
- API Performance
- Component Render Times
- Resource Loading
- Long Tasks

**Performance Budgets:**
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- FCP: < 1.8s
- TTFB: < 800ms
- INP: < 200ms

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install web-vitals
```

### 2. Initialize Monitoring

```typescript
// src/index.tsx or src/App.tsx
import { initPerformanceMonitoring } from './services/performanceMonitoring';

// Initialize on app start
initPerformanceMonitoring();
```

### 3. Track Custom Metrics

```typescript
import { performanceMonitor } from './services/performanceMonitoring';

// Track API calls
const start = performance.now();
await fetch('/api/enhance');
performanceMonitor.trackAPICall('/api/enhance', performance.now() - start, 200);

// Track component renders
useEffect(() => {
  const start = performance.now();
  return () => {
    performanceMonitor.trackRender('MyComponent', performance.now() - start);
  };
}, []);
```

---

## 📊 Tool Recommendations

### Free Options

#### 1. **Google Analytics 4 + Web Vitals** (Recommended)
- **Cost:** Free
- **Setup Time:** 15 minutes
- **Pros:** Built-in Web Vitals, free forever, good reporting
- **Cons:** 24-hour data delay, limited real-time insights

**Setup:**
```typescript
// Install
npm install web-vitals

// src/services/analytics.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

const sendToGA = (metric: any) => {
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      metric_delta: metric.delta,
    });
  }
};

onCLS(sendToGA);
onFID(sendToGA);
onLCP(sendToGA);
```

**Add to index.html:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### 2. **Vercel Analytics** (If hosted on Vercel)
- **Cost:** Free tier available
- **Setup Time:** 2 minutes
- **Pros:** Zero config, automatic Web Vitals, beautiful dashboard
- **Cons:** Vercel hosting only

**Setup:**
```bash
npm install @vercel/analytics
```

```typescript
// src/App.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

#### 3. **Firebase Performance Monitoring**
- **Cost:** Free (generous limits)
- **Setup Time:** 20 minutes
- **Pros:** Real-time, automatic traces, custom metrics
- **Cons:** Requires Firebase setup

**Setup:**
```bash
npm install firebase
```

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getPerformance, trace } from 'firebase/performance';

const app = initializeApp(firebaseConfig);
const perf = getPerformance(app);

// Track custom traces
export const trackTrace = async (name: string, fn: () => Promise<any>) => {
  const t = trace(perf, name);
  t.start();
  try {
    return await fn();
  } finally {
    t.stop();
  }
};
```

#### 4. **Plausible Analytics** (Privacy-focused)
- **Cost:** Free self-hosted, $9/mo cloud
- **Setup Time:** 10 minutes
- **Pros:** Privacy-friendly, lightweight, GDPR compliant
- **Cons:** Limited performance metrics

---

### Paid Options (Worth It)

#### 1. **Sentry** (Recommended for Errors)
- **Cost:** Free tier (5k errors/mo), $26/mo Pro
- **Setup Time:** 10 minutes
- **Best For:** Error tracking, performance monitoring, session replay

**Setup:**
```bash
npm install @sentry/react
```

```typescript
// src/index.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_DSN',
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1, // 10% of transactions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Track Performance:**
```typescript
const transaction = Sentry.startTransaction({ name: 'enhance-prompt' });
try {
  await enhancePrompt();
} finally {
  transaction.finish();
}
```

#### 2. **LogRocket** (Best for Session Replay)
- **Cost:** $99/mo (1k sessions)
- **Setup Time:** 15 minutes
- **Best For:** Session replay, user behavior, debugging

**Setup:**
```bash
npm install logrocket
```

```typescript
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');

// Identify users
LogRocket.identify('user-id', {
  email: 'user@example.com',
});
```

#### 3. **Datadog RUM** (Enterprise)
- **Cost:** $1.27 per 1k sessions
- **Setup Time:** 20 minutes
- **Best For:** Large-scale apps, APM integration

#### 4. **New Relic** (Full Stack)
- **Cost:** $99/mo (100GB data)
- **Setup Time:** 30 minutes
- **Best For:** Backend + frontend monitoring

---

## 🔧 Implementation Steps

### Step 1: Core Web Vitals (5 minutes)

```typescript
// src/index.tsx
import { initPerformanceMonitoring } from './services/performanceMonitoring';

initPerformanceMonitoring();
```

### Step 2: Error Tracking (10 minutes)

**Option A: Sentry (Recommended)**
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_DSN',
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
    }
    return event;
  },
});
```

**Option B: Custom Error Boundary**
```typescript
// Already implemented in src/components/ErrorBoundary.tsx
import { ErrorBoundary } from './components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Step 3: API Performance (5 minutes)

```typescript
// src/services/enhancementService.ts
import { performanceMonitor } from './performanceMonitoring';

export const enhancePrompt = async (prompt: string) => {
  const start = performance.now();
  
  try {
    const response = await fetch('/api/enhance', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    
    const duration = performance.now() - start;
    performanceMonitor.trackAPICall('/api/enhance', duration, response.status);
    
    return response.json();
  } catch (error) {
    performanceMonitor.trackAPICall('/api/enhance', performance.now() - start, 0);
    throw error;
  }
};
```

### Step 4: Component Performance (10 minutes)

```typescript
// src/hooks/usePerformanceTracking.ts
import { useEffect } from 'react';
import { performanceMonitor } from '../services/performanceMonitoring';

export const usePerformanceTracking = (componentName: string) => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      performanceMonitor.trackRender(componentName, duration);
    };
  }, [componentName]);
};

// Usage
function MyComponent() {
  usePerformanceTracking('MyComponent');
  return <div>...</div>;
}
```

### Step 5: Performance Dashboard (15 minutes)

```typescript
// src/components/PerformanceDashboard.tsx
import { performanceMonitor } from '../services/performanceMonitoring';

export const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState(performanceMonitor.getSummary());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getSummary());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {Object.entries(metrics).map(([name, data]) => (
        <div key={name}>
          <h3>{name}</h3>
          <p>Avg: {data.avg.toFixed(2)}ms</p>
          <p>Count: {data.count}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 📈 Performance Budgets

### Set Up Budget Alerts

```typescript
// src/services/performanceMonitoring.ts
const BUDGETS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
};

const checkBudget = (metric: Metric) => {
  const budget = BUDGETS[metric.name];
  if (budget && metric.value > budget) {
    // Send alert
    console.error(`Budget exceeded: ${metric.name} = ${metric.value}`);
    
    // Optional: Send to Slack/Discord
    fetch('YOUR_WEBHOOK_URL', {
      method: 'POST',
      body: JSON.stringify({
        text: `⚠️ ${metric.name} exceeded budget: ${metric.value}ms > ${budget}ms`,
      }),
    });
  }
};
```

### Lighthouse CI (Automated Testing)

```bash
npm install -g @lhci/cli

# .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}]
      }
    }
  }
}

# Run
lhci autorun
```

---

## 🎯 Actionable Insights

### 1. Identify Slow Components

```typescript
// Check render times
const slowComponents = performanceMonitor.getSummary();
Object.entries(slowComponents)
  .filter(([_, data]) => data.avg > 16)
  .forEach(([name, data]) => {
    console.warn(`Slow component: ${name} (${data.avg}ms)`);
  });
```

### 2. Track User Journey

```typescript
// Track critical user paths
performanceMonitor.trackCustomMetric('prompt_to_result', duration, {
  provider: 'gemini',
  mode: 'enhancement',
});
```

### 3. Monitor API Health

```typescript
// Track API success rate
const apiMetrics = performanceMonitor.getSummary();
const successRate = apiMetrics['api_call_success'] / apiMetrics['api_call_total'];
console.log(`API Success Rate: ${(successRate * 100).toFixed(2)}%`);
```

---

## 🔍 Debugging Performance Issues

### 1. Use Chrome DevTools

```javascript
// Performance tab
// 1. Record
// 2. Interact with app
// 3. Stop
// 4. Analyze flame chart

// Coverage tab
// 1. Start instrumenting
// 2. Load page
// 3. Check unused code %
```

### 2. React DevTools Profiler

```bash
npm install react-devtools
```

```typescript
// Wrap components
<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

### 3. Bundle Analysis

```bash
npm install -D webpack-bundle-analyzer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({ open: true })
  ]
}
```

---

## 📊 Recommended Setup (Best Value)

**For Small Projects (Free):**
- Google Analytics 4 + Web Vitals
- Firebase Performance
- Custom error tracking

**For Production Apps ($26/mo):**
- Sentry (errors + performance)
- Vercel Analytics (if on Vercel)
- Google Analytics 4

**For Enterprise ($200+/mo):**
- Datadog RUM
- LogRocket
- Sentry

---

## ✅ Checklist

- [ ] Install web-vitals package
- [ ] Initialize performance monitoring
- [ ] Set up error tracking (Sentry or custom)
- [ ] Track API performance
- [ ] Monitor component renders
- [ ] Set performance budgets
- [ ] Create performance dashboard
- [ ] Set up alerts for budget violations
- [ ] Add Lighthouse CI to pipeline
- [ ] Document performance baselines

---

## 🚨 Common Issues

### High LCP
- Optimize images (WebP, lazy loading)
- Reduce server response time
- Eliminate render-blocking resources

### High CLS
- Set explicit dimensions for images/videos
- Avoid inserting content above existing content
- Use CSS transforms instead of layout properties

### High FID/INP
- Break up long tasks
- Use web workers for heavy computation
- Defer non-critical JavaScript

---

## 📚 Resources

- [Web Vitals](https://web.dev/vitals/)
- [Sentry Docs](https://docs.sentry.io/)
- [Firebase Performance](https://firebase.google.com/docs/perf-mon)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
