# Performance Monitoring - Quick Setup

## 🚀 5-Minute Setup

### Step 1: Initialize Monitoring (2 min)

Add to your `src/index.tsx` or `src/App.tsx`:

```typescript
import { initPerformanceMonitoring } from './services/performanceMonitoring';

// At the top of your app
initPerformanceMonitoring();
```

### Step 2: Add Performance Dashboard (1 min)

```typescript
import { PerformanceDashboard } from './components/PerformanceDashboard';

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <PerformanceDashboard />}
    </>
  );
}
```

### Step 3: Track Components (2 min)

```typescript
import { usePerformanceTracking } from './hooks/usePerformanceTracking';

function MyComponent() {
  usePerformanceTracking('MyComponent');
  return <div>...</div>;
}
```

**Done!** You now have:
- ✅ Core Web Vitals tracking
- ✅ Error monitoring
- ✅ Component performance tracking
- ✅ Real-time dashboard

---

## 📊 Recommended Tools by Budget

### Free ($0/month)
**Best for:** Side projects, MVPs, small apps

```bash
# Already included
npm install web-vitals  # ✅ Installed

# Add Google Analytics (optional)
# Add GA4 tag to index.html
```

**What you get:**
- Core Web Vitals (LCP, FID, CLS, FCP, TTFB, INP)
- Error tracking (console)
- Performance dashboard (dev mode)
- Resource timing

---

### Starter ($26/month)
**Best for:** Production apps, startups

**Sentry** - Error tracking + Performance
```bash
npm install @sentry/react

# src/index.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_DSN',
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 0.1,
});
```

**What you get:**
- Everything from Free tier
- Error tracking with stack traces
- Performance monitoring
- Release tracking
- Source maps
- 5,000 errors/month

**Sign up:** https://sentry.io/signup/

---

### Professional ($99/month)
**Best for:** Growing companies, SaaS products

**Sentry Pro** ($26) + **LogRocket** ($99)

```bash
npm install logrocket

# src/index.tsx
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');
```

**What you get:**
- Everything from Starter
- Session replay
- User behavior tracking
- Console logs
- Network requests
- Redux/Zustand state
- 1,000 sessions/month

**Sign up:** https://logrocket.com/

---

### Enterprise ($200+/month)
**Best for:** Large companies, high-traffic apps

**Datadog RUM** or **New Relic**

```bash
npm install @datadog/browser-rum

# src/index.tsx
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: 'YOUR_APP_ID',
  clientToken: 'YOUR_CLIENT_TOKEN',
  site: 'datadoghq.com',
  service: 'devprompt-studio',
  env: 'production',
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
});
```

**What you get:**
- Everything from Professional
- APM integration
- Infrastructure monitoring
- Custom dashboards
- Advanced analytics
- Unlimited sessions

---

## 🎯 My Recommendation

### For DevPrompt Studio:

**Phase 1: Launch (Free)**
- Use built-in monitoring
- Google Analytics 4
- Firebase Performance (already using Firebase)

**Phase 2: Growth ($26/mo)**
- Add Sentry for errors
- Keep GA4 for analytics

**Phase 3: Scale ($125/mo)**
- Add LogRocket for session replay
- Keep Sentry + GA4

---

## 🔧 Firebase Performance (Recommended)

Since you're already using Firebase:

```bash
# Already installed
npm install firebase
```

```typescript
// src/config/firebase.ts
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);

// Automatic traces for:
// - Page loads
// - HTTP requests
// - Custom code traces
```

**Benefits:**
- ✅ Free (generous limits)
- ✅ Already integrated
- ✅ Real-time dashboard
- ✅ Automatic traces
- ✅ Custom metrics

**Setup:** https://firebase.google.com/docs/perf-mon/get-started-web

---

## 📈 Performance Budgets

Current budgets in `performanceMonitoring.ts`:

```typescript
LCP: 2500ms   // Largest Contentful Paint
FID: 100ms    // First Input Delay
CLS: 0.1      // Cumulative Layout Shift
FCP: 1800ms   // First Contentful Paint
TTFB: 800ms   // Time to First Byte
INP: 200ms    // Interaction to Next Paint
```

**Adjust based on your needs:**
- E-commerce: Stricter budgets
- Content sites: Moderate budgets
- Internal tools: Relaxed budgets

---

## 🚨 Alert Setup

### Slack Webhook (Free)

```typescript
// src/services/performanceMonitoring.ts
const sendSlackAlert = async (message: string) => {
  await fetch('YOUR_SLACK_WEBHOOK', {
    method: 'POST',
    body: JSON.stringify({ text: message }),
  });
};

// Use in checkBudget()
if (metric.value > budget) {
  sendSlackAlert(`⚠️ ${metric.name} exceeded: ${metric.value}ms`);
}
```

### Discord Webhook (Free)

```typescript
const sendDiscordAlert = async (message: string) => {
  await fetch('YOUR_DISCORD_WEBHOOK', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message }),
  });
};
```

---

## ✅ Quick Checklist

- [ ] Run `npm install` (web-vitals already included)
- [ ] Add `initPerformanceMonitoring()` to index.tsx
- [ ] Add `<PerformanceDashboard />` to App.tsx (dev only)
- [ ] Test in browser (open console, check metrics)
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure performance budgets
- [ ] Set up alerts (Slack/Discord)
- [ ] Add to CI/CD (Lighthouse CI)

---

## 🎓 Next Steps

1. **Monitor for 1 week** - Collect baseline metrics
2. **Identify bottlenecks** - Check dashboard for slow components
3. **Optimize** - Fix issues one by one
4. **Measure impact** - Compare before/after metrics
5. **Set alerts** - Get notified of regressions

---

## 📚 Resources

- [Web Vitals Guide](https://web.dev/vitals/)
- [Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Firebase Performance](https://firebase.google.com/docs/perf-mon)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/)
