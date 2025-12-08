# Testing Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DevPrompt Studio                             │
│                   Testing Architecture                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Test Layers                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  E2E Tests (Playwright)                                   │  │
│  │  • 9 Browser/Device Configs                              │  │
│  │  • Critical Path Testing                                 │  │
│  │  • Cross-Browser Validation                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Integration Tests                                        │  │
│  │  • Component Integration                                 │  │
│  │  • API Integration                                       │  │
│  │  • State Management                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Unit Tests (Vitest)                                      │  │
│  │  • Component Logic                                       │  │
│  │  • Utility Functions                                     │  │
│  │  • Hooks & Services                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Browser Coverage Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser Test Matrix                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Desktop Browsers                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Chrome  │  │ Firefox  │  │  Safari  │  │   Edge   │      │
│  │  Latest  │  │  Latest  │  │  Latest  │  │  Latest  │      │
│  │  Latest-1│  │   ESR    │  │  Latest-1│  │  Latest-1│      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│      63%           3%            9%            11%              │
│   CRITICAL       MEDIUM        HIGH          HIGH              │
│                                                                  │
│  Mobile Devices                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ iPhone12 │  │ iPhone14 │  │ Pixel 5  │  │Galaxy S23│      │
│  │ iOS 16+  │  │ iOS 17+  │  │Android12+│  │Android13+│      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│      28%           28%           4%            18%              │
│   CRITICAL      CRITICAL      MEDIUM         HIGH              │
│                                                                  │
│  Tablet Devices                                                 │
│  ┌──────────┐                                                   │
│  │ iPad Pro │                                                   │
│  │iPadOS 17+│                                                   │
│  └──────────┘                                                   │
│       8%                                                         │
│    MEDIUM                                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## CI/CD Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      CI/CD Pipeline                              │
└─────────────────────────────────────────────────────────────────┘

Developer Commits Code
         ↓
    ┌────────┐
    │  Git   │
    │  Push  │
    └────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│                   GitHub Actions Triggered                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Stage 1: Critical Tests (5-10 min) - PARALLEL                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Chromium   │  │   Firefox    │  │    WebKit    │         │
│  │  Smoke Tests │  │  Smoke Tests │  │  Smoke Tests │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         ↓                 ↓                  ↓                   │
│         └─────────────────┴──────────────────┘                  │
│                           ↓                                      │
│                    All Pass? ────→ ❌ Fail → Notify Developer   │
│                           ↓                                      │
│                          ✅ Pass                                 │
│                           ↓                                      │
│  Stage 2: Extended Tests (15-20 min) - ON PULL REQUEST         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Desktop    │  │    Mobile    │  │     Edge     │         │
│  │  Full Suite  │  │  Full Suite  │  │  Full Suite  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         ↓                 ↓                  ↓                   │
│         └─────────────────┴──────────────────┘                  │
│                           ↓                                      │
│                    All Pass? ────→ ❌ Fail → Block Merge        │
│                           ↓                                      │
│                          ✅ Pass                                 │
│                           ↓                                      │
│  Stage 3: Visual Regression (Optional)                          │
│  ┌──────────────────────────────────────────┐                  │
│  │  Percy Visual Comparison                 │                  │
│  │  • Capture screenshots                   │                  │
│  │  • Compare with baseline                 │                  │
│  │  • Flag visual changes                   │                  │
│  └──────────────────────────────────────────┘                  │
│                           ↓                                      │
│                    Approved? ────→ ❌ Reject → Review Required  │
│                           ↓                                      │
│                          ✅ Approved                             │
│                           ↓                                      │
│                    ┌──────────────┐                             │
│                    │ Merge to Main│                             │
│                    └──────────────┘                             │
│                           ↓                                      │
│                    ┌──────────────┐                             │
│                    │    Deploy    │                             │
│                    └──────────────┘                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Test Execution Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                   Test Execution Schedule                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Every Commit (Automated)                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Critical Tests                                         │    │
│  │  • Chrome, Firefox, Safari                             │    │
│  │  • Smoke tests only                                    │    │
│  │  • Duration: 5-10 minutes                              │    │
│  │  • Fail fast on errors                                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                      │
│  Every Pull Request (Automated)                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Full Test Suite                                       │    │
│  │  • All 9 browsers/devices                             │    │
│  │  • Complete E2E tests                                  │    │
│  │  • Duration: 15-20 minutes                             │    │
│  │  • Block merge on failure                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                      │
│  Nightly (Automated - 2 AM)                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Visual Regression                                     │    │
│  │  • All browsers                                        │    │
│  │  • Screenshot comparison                               │    │
│  │  • Duration: 30 minutes                                │    │
│  │  • Report visual changes                               │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                      │
│  Weekly (Automated - Sunday)                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Full Regression Suite                                 │    │
│  │  • All tests + performance                             │    │
│  │  • Accessibility audit                                 │    │
│  │  • Duration: 1 hour                                    │    │
│  │  • Generate report                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                      │
│  Monthly (Manual)                                               │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Real Device Testing                                   │    │
│  │  • BrowserStack/Physical devices                       │    │
│  │  • Exploratory testing                                 │    │
│  │  • Duration: 2-4 hours                                 │    │
│  │  • Document findings                                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Test Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Test Data Flow                              │
└─────────────────────────────────────────────────────────────────┘

Test Execution
      ↓
┌─────────────────┐
│  Test Runner    │
│  (Playwright)   │
└─────────────────┘
      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Browser Instances                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Chrome   │  │ Firefox  │  │  Safari  │  │   Edge   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Test Application                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  DevPrompt Studio (http://localhost:3000)                │  │
│  │  • skipAuth flag set                                     │  │
│  │  • Test data injected                                    │  │
│  │  • Mock API responses                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Test Results                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Pass/Fail Status                                      │  │
│  │  • Screenshots (on failure)                              │  │
│  │  • Video Recordings                                      │  │
│  │  • Console Logs                                          │  │
│  │  • Network Traces                                        │  │
│  │  • Performance Metrics                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Reporting                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  HTML Report │  │  JSON Report │  │  JUnit XML   │         │
│  │  (Interactive)│  │  (Metrics)   │  │  (CI/CD)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Testing Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                  Component Test Pyramid                          │
└─────────────────────────────────────────────────────────────────┘

                         ▲
                        ╱ ╲
                       ╱   ╲
                      ╱ E2E ╲          ← Slow, Expensive
                     ╱ Tests ╲            Few tests
                    ╱─────────╲           High confidence
                   ╱           ╲
                  ╱             ╲
                 ╱ Integration  ╲     ← Medium speed
                ╱     Tests      ╲       Medium cost
               ╱─────────────────╲       Good coverage
              ╱                   ╲
             ╱                     ╲
            ╱      Unit Tests      ╲  ← Fast, Cheap
           ╱                         ╲    Many tests
          ╱───────────────────────────╲   Quick feedback
         ▼                             ▼

┌─────────────────────────────────────────────────────────────────┐
│  E2E Tests (10%)                                                │
│  • Full user workflows                                          │
│  • Cross-browser validation                                     │
│  • Critical path testing                                        │
│  Example: Login → Enhance → Save → Share                       │
├─────────────────────────────────────────────────────────────────┤
│  Integration Tests (30%)                                        │
│  • Component interactions                                       │
│  • API integration                                              │
│  • State management                                             │
│  Example: PromptInput + PromptOutput + History                 │
├─────────────────────────────────────────────────────────────────┤
│  Unit Tests (60%)                                               │
│  • Individual functions                                         │
│  • Component logic                                              │
│  • Utility functions                                            │
│  Example: formatDate(), validateEmail(), parsePrompt()         │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling & Reporting

```
┌─────────────────────────────────────────────────────────────────┐
│                   Error Handling Flow                            │
└─────────────────────────────────────────────────────────────────┘

Test Failure Detected
         ↓
    ┌────────┐
    │Capture │
    │Context │
    └────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Failure Artifacts                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Screenshot   │  │    Video     │  │  Console Log │         │
│  │  (PNG)       │  │   (WebM)     │  │    (Text)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │Network Trace │  │  Stack Trace │  │   DOM State  │         │
│  │   (HAR)      │  │    (Text)    │  │    (HTML)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Failure Analysis                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Automatic Classification:                               │  │
│  │  • Timeout → Increase wait time                          │  │
│  │  • Element not found → Fix selector                      │  │
│  │  • Network error → Check API                             │  │
│  │  • Assertion failed → Logic error                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Notification                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   GitHub     │  │    Slack     │  │    Email     │         │
│  │  Comment     │  │  Notification│  │   (Optional) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Performance Monitoring

```
┌─────────────────────────────────────────────────────────────────┐
│                  Performance Test Flow                           │
└─────────────────────────────────────────────────────────────────┘

Test Execution
      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Metrics Collection                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Core Web Vitals:                                        │  │
│  │  • First Contentful Paint (FCP)                          │  │
│  │  • Largest Contentful Paint (LCP)                        │  │
│  │  • Time to Interactive (TTI)                             │  │
│  │  • Cumulative Layout Shift (CLS)                         │  │
│  │  • First Input Delay (FID)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Performance Budgets                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Thresholds:                                             │  │
│  │  • FCP < 1.8s  ✅ Pass / ❌ Fail                         │  │
│  │  • LCP < 2.5s  ✅ Pass / ❌ Fail                         │  │
│  │  • TTI < 3.9s  ✅ Pass / ❌ Fail                         │  │
│  │  • CLS < 0.1   ✅ Pass / ❌ Fail                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Lighthouse Report                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Scores:                                                 │  │
│  │  • Performance:    95/100                                │  │
│  │  • Accessibility:  100/100                               │  │
│  │  • Best Practices: 96/100                                │  │
│  │  • SEO:            100/100                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Metrics Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                    Test Metrics Dashboard                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Test Coverage                                                  │
│  ████████████████████░░░░  80%                                  │
│                                                                  │
│  Pass Rate                                                      │
│  ███████████████████████░  95%                                  │
│                                                                  │
│  Execution Time                                                 │
│  Critical:  ████░░░░░░░░░░  5 min                              │
│  Full:      ████████░░░░░░  20 min                             │
│                                                                  │
│  Browser Coverage                                               │
│  Chrome:    ████████████████████████  100%                     │
│  Firefox:   ████████████████████████  100%                     │
│  Safari:    ████████████████████████  100%                     │
│  Edge:      ████████████████████████  100%                     │
│  Mobile:    ████████████████████████  100%                     │
│                                                                  │
│  Flakiness Rate                                                 │
│  ██░░░░░░░░░░░░░░░░░░░░  3%  (Target: <5%)                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture Benefits

### 1. Fast Feedback
- Critical tests in 5 minutes
- Parallel execution
- Early failure detection

### 2. Comprehensive Coverage
- 9 browser/device configurations
- Unit + Integration + E2E
- Visual + Performance + Accessibility

### 3. Scalable
- Add new browsers easily
- Parallel execution
- Cloud-based testing ready

### 4. Maintainable
- Clear test organization
- Reusable test utilities
- Comprehensive documentation

### 5. Cost-Effective
- Free tier available
- Efficient resource usage
- Pay only for what you need
