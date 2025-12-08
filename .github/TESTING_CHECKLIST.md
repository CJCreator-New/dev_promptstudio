# Pre-Release Testing Checklist

## Quick Start
```bash
# Run all critical tests (5 min)
npm run test:e2e:critical

# Run full cross-browser suite (20 min)
npm run test:e2e

# Run mobile tests only
npm run test:e2e:mobile

# View test report
npm run test:e2e:report
```

---

## Critical Path Testing (Every Release)

### 🔐 Authentication
- [ ] **Chrome**: Login with email/password
- [ ] **Firefox**: Anonymous login
- [ ] **Safari**: Session persistence after refresh
- [ ] **Mobile Safari**: Login on iPhone
- [ ] **Edge**: Logout and re-login

### ✨ Core Features
- [ ] **Chrome**: Enhance prompt with Gemini
- [ ] **Firefox**: Enhance prompt with OpenAI
- [ ] **Safari**: Enhance prompt with Claude
- [ ] **Mobile**: Streaming response works
- [ ] **All**: Copy enhanced prompt to clipboard

### 💾 Data Persistence
- [ ] **Chrome**: History saves to IndexedDB
- [ ] **Safari**: LocalStorage works (not private mode)
- [ ] **Firefox**: Auto-save recovers draft
- [ ] **Mobile**: Cloud sync works
- [ ] **All**: Export/import templates

### 📱 Responsive Design
- [ ] **Desktop (1920x1080)**: Three-column layout
- [ ] **Tablet (768x1024)**: Two-column layout
- [ ] **Mobile (375x667)**: Single column, hamburger menu
- [ ] **iPhone 14**: Safe area insets respected
- [ ] **iPad Pro**: Split-screen works

---

## Browser-Specific Tests

### Safari (macOS)
- [ ] IndexedDB quota doesn't exceed 50MB
- [ ] Clipboard API requires user gesture
- [ ] 100vh viewport height correct
- [ ] CSS backdrop-filter works
- [ ] WebP images load

### Safari (iOS)
- [ ] Virtual keyboard doesn't break layout
- [ ] Input fields don't zoom (16px font)
- [ ] Pull-to-refresh disabled
- [ ] Touch targets ≥44x44px
- [ ] Swipe gestures work

### Firefox
- [ ] Custom scrollbars render
- [ ] Flexbox layout correct
- [ ] IndexedDB transactions don't hang
- [ ] CSS Grid works

### Edge
- [ ] Windows high contrast mode
- [ ] Touch input on Surface devices
- [ ] Chromium features work

### Chrome Android
- [ ] Pull-to-refresh disabled
- [ ] Address bar hide/show smooth
- [ ] Hardware back button works
- [ ] Touch events responsive

---

## Accessibility Tests (All Browsers)

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter activates buttons
- [ ] ESC closes modals
- [ ] Ctrl+E enhances prompt
- [ ] Ctrl+S saves project
- [ ] Focus indicators visible

### Screen Reader
- [ ] VoiceOver (Safari): All content announced
- [ ] NVDA (Firefox): Proper ARIA labels
- [ ] TalkBack (Android): Navigation works
- [ ] Landmarks identified
- [ ] Form labels associated

### Visual
- [ ] Color contrast ≥4.5:1
- [ ] Text resizable to 200%
- [ ] No content loss at 400% zoom
- [ ] Dark mode readable
- [ ] Light mode readable

---

## Performance Tests

### Lighthouse Scores (Target: >90)
```bash
# Run Lighthouse CI
npm run perf:lighthouse
```

- [ ] **Chrome Desktop**: Performance >90
- [ ] **Chrome Mobile**: Performance >85
- [ ] **Firefox**: Performance >85
- [ ] **Safari**: Performance >85

### Core Web Vitals
- [ ] FCP <1.8s (all browsers)
- [ ] LCP <2.5s (all browsers)
- [ ] TTI <3.9s (all browsers)
- [ ] CLS <0.1 (all browsers)
- [ ] FID <100ms (all browsers)

---

## Visual Regression Tests

### Key Screens to Capture
- [ ] Homepage (logged out)
- [ ] Main workspace (logged in)
- [ ] History sidebar
- [ ] Template gallery
- [ ] Settings modal
- [ ] Share modal
- [ ] Mobile navigation
- [ ] Dark mode
- [ ] Light mode

### Tools
```bash
# Percy visual testing (if configured)
PERCY_TOKEN=xxx npm run test:visual

# Manual screenshot comparison
npm run test:e2e -- --update-snapshots
```

---

## Real Device Testing (Monthly)

### iOS Devices
- [ ] iPhone SE (2022) - iOS 16
- [ ] iPhone 14 Pro - iOS 17
- [ ] iPad Air - iPadOS 17

### Android Devices
- [ ] Samsung Galaxy S23 - Android 13
- [ ] Google Pixel 7 - Android 14
- [ ] OnePlus 11 - Android 13

### Testing Locations
- **BrowserStack Live**: Real device cloud
- **Local devices**: Team member devices
- **AWS Device Farm**: Automated testing

---

## Regression Test Matrix

| Feature | Chrome | Firefox | Safari | Edge | iOS | Android |
|---------|--------|---------|--------|------|-----|---------|
| Login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Enhance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| History | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ |
| Templates | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Share | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ |
| Cloud Sync | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Keyboard | ✅ | ✅ | ✅ | ✅ | N/A | N/A |
| Touch | N/A | N/A | N/A | ⚠️ | ✅ | ✅ |

Legend: ✅ Pass | ⚠️ Known issues | ❌ Fail | N/A Not applicable

---

## Sign-Off Checklist

### Before Merging PR
- [ ] All critical tests pass on Chrome, Firefox, Safari
- [ ] No new accessibility violations
- [ ] Visual regression approved
- [ ] Performance budgets met
- [ ] No console errors in production build

### Before Production Deploy
- [ ] Full test suite passes (all browsers)
- [ ] Manual testing on real iOS device
- [ ] Manual testing on real Android device
- [ ] Smoke test on production URL
- [ ] Rollback plan documented

### Post-Deploy Verification
- [ ] Production URL loads in all browsers
- [ ] Analytics tracking works
- [ ] Error monitoring active (Sentry)
- [ ] No spike in error rates
- [ ] User feedback monitored

---

## Emergency Rollback Criteria

Rollback immediately if:
- ❌ Critical feature broken in >1 browser
- ❌ Data loss or corruption
- ❌ Security vulnerability
- ❌ Error rate >5%
- ❌ Performance degradation >50%

---

## Test Failure Triage

### Priority 1 (Block Release)
- Authentication broken
- Data loss
- App crashes
- Security issue

### Priority 2 (Fix Before Release)
- Core feature broken in major browser
- Accessibility violation
- Performance regression >20%

### Priority 3 (Can Ship)
- Minor UI glitch
- Edge case bug
- Non-critical browser (Opera)
- Known workaround exists

---

## Useful Commands

```bash
# Install all browsers
npx playwright install --with-deps

# Run specific test file
npm run test:e2e -- auth.spec.ts

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug -- --grep "login"

# Generate test report
npm run test:e2e:report

# Update snapshots
npm run test:e2e -- --update-snapshots

# Run on specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
npm run test:e2e:edge

# Run mobile tests
npm run test:e2e:mobile

# Run with retries
npm run test:e2e -- --retries=3

# Parallel execution
npm run test:e2e -- --workers=4
```

---

## Resources

- [Playwright Docs](https://playwright.dev)
- [BrowserStack](https://browserstack.com)
- [Can I Use](https://caniuse.com)
- [MDN Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/API)
- [WebPageTest](https://webpagetest.org)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
