# Testing Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Playwright Browsers
```bash
npx playwright install --with-deps
```

### 2. Run Your First Test
```bash
# Critical tests only (fastest)
npm run test:e2e:critical

# Full suite
npm run test:e2e

# View results
npm run test:e2e:report
```

### 3. Test Specific Browsers
```bash
npm run test:e2e:chromium  # Chrome
npm run test:e2e:firefox   # Firefox
npm run test:e2e:webkit    # Safari
npm run test:e2e:edge      # Edge (Windows only)
npm run test:e2e:mobile    # iOS + Android
```

---

## 📋 What's Already Configured

✅ **9 Browser/Device Configurations**:
- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: iPhone 12, iPhone 14, Pixel 5, Galaxy S23
- Tablet: iPad Pro

✅ **Test Infrastructure**:
- Playwright for automation
- GitHub Actions for CI/CD
- HTML reports with screenshots/videos
- JUnit XML for test reporting

✅ **Test Suites**:
- Critical smoke tests (5 min)
- Authentication tests
- Full E2E tests (20 min)

---

## 🎯 Testing Strategy Overview

### Every Commit (Automated)
- ✅ Critical tests on Chrome, Firefox, Safari
- ⏱️ Duration: 5-10 minutes
- 🎯 Goal: Catch breaking changes fast

### Every Pull Request (Automated)
- ✅ Full test suite on all browsers
- ✅ Mobile device testing
- ✅ Visual regression (if Percy configured)
- ⏱️ Duration: 15-20 minutes
- 🎯 Goal: Comprehensive validation

### Weekly (Automated)
- ✅ Full E2E suite
- ✅ Performance testing
- ✅ Accessibility audit
- ⏱️ Duration: 1 hour
- 🎯 Goal: Catch regressions

### Monthly (Manual)
- ✅ Real device testing
- ✅ Exploratory testing
- ✅ Browser compatibility review
- ⏱️ Duration: 2-4 hours
- 🎯 Goal: Real-world validation

---

## 🔧 Common Tasks

### Debug a Failing Test
```bash
# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug with Playwright Inspector
npm run test:e2e:debug

# Run specific test
npm run test:e2e -- --grep "login"
```

### Update Visual Snapshots
```bash
npm run test:e2e -- --update-snapshots
```

### Test on Real Devices
1. Sign up for [BrowserStack](https://browserstack.com) (free for open source)
2. Add credentials to `.env`:
   ```
   BROWSERSTACK_USERNAME=your_username
   BROWSERSTACK_ACCESS_KEY=your_key
   ```
3. Run: `npm run test:browserstack`

### Check Performance
```bash
# Lighthouse audit
npm run perf:lighthouse

# Bundle size analysis
npm run perf:analyze
```

---

## 📊 Understanding Test Results

### Test Report Location
- **HTML Report**: `test-results/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`

### Reading Test Output
```
✓ auth.spec.ts:8:3 › should login successfully (chromium) [2.5s]
  - ✓ = Passed
  - chromium = Browser
  - [2.5s] = Duration
```

### Common Failure Reasons
1. **Timeout**: Element not found → Increase timeout or fix selector
2. **Flaky**: Passes sometimes → Add proper waits
3. **Browser-specific**: Works in Chrome, fails in Safari → Check compatibility

---

## 🐛 Troubleshooting

### Tests Stuck on Authentication
**Solution**: Already fixed! Tests now bypass auth with `skipAuth` flag.

### "Browser not installed"
```bash
npx playwright install chromium firefox webkit
```

### "Port 3000 already in use"
```bash
# Kill existing process
npx kill-port 3000

# Or change port in playwright.config.ts
```

### Tests Fail Locally but Pass in CI
- Clear browser cache: `npx playwright install --force`
- Check Node version matches CI (18+)
- Ensure `.env` variables set

### Slow Test Execution
```bash
# Run in parallel (default: 4 workers)
npm run test:e2e -- --workers=8

# Run only changed tests
npm run test:e2e -- --only-changed
```

---

## 📈 Success Metrics

### Current Status
- ✅ 5 browsers configured
- ✅ 4 mobile devices configured
- ✅ CI/CD pipeline ready
- ✅ Auth bypass for tests
- ⏳ Visual regression (pending Percy setup)
- ⏳ Real device testing (pending BrowserStack)

### Goals
- **Test Coverage**: >80% of critical paths
- **Test Speed**: Critical tests <10 min
- **Flakiness**: <5% flaky tests
- **Browser Coverage**: Chrome, Firefox, Safari, Edge
- **Mobile Coverage**: iOS + Android

---

## 🎓 Learning Resources

### Playwright
- [Official Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

### Cross-Browser Testing
- [Can I Use](https://caniuse.com) - Feature compatibility
- [MDN Web Docs](https://developer.mozilla.org) - Browser APIs
- [BrowserStack Blog](https://browserstack.com/blog) - Testing tips

### Performance
- [Web.dev](https://web.dev) - Performance guides
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://webpagetest.org)

---

## 📞 Getting Help

### Test Failures
1. Check test report: `npm run test:e2e:report`
2. Review screenshots in `test-results/`
3. Watch video recording of failure
4. Check console logs in report

### Browser Issues
1. Consult [BROWSER_COMPATIBILITY.md](./BROWSER_COMPATIBILITY.md)
2. Search [Can I Use](https://caniuse.com)
3. Check browser DevTools console

### CI/CD Issues
1. Check GitHub Actions logs
2. Compare local vs CI environment
3. Verify secrets are set in GitHub

---

## 🚢 Pre-Release Checklist

Quick checklist before deploying:

```bash
# 1. Run all tests
npm run test:e2e

# 2. Check performance
npm run perf:lighthouse

# 3. Build production
npm run build

# 4. Preview production build
npm run preview

# 5. Manual smoke test
# - Open http://localhost:4173
# - Test login
# - Test prompt enhancement
# - Test on mobile device
```

✅ All tests pass
✅ Performance score >90
✅ No console errors
✅ Mobile responsive
✅ Accessibility compliant

**Ready to deploy!** 🎉

---

## 📝 Next Steps

### Immediate (This Week)
1. ✅ Run first test suite
2. ✅ Review test results
3. ✅ Fix any failures
4. ✅ Commit changes

### Short-term (This Month)
1. ⏳ Set up Percy for visual regression
2. ⏳ Configure BrowserStack for real devices
3. ⏳ Add more E2E test coverage
4. ⏳ Set up performance monitoring

### Long-term (This Quarter)
1. ⏳ Achieve 80% test coverage
2. ⏳ Implement A/B testing
3. ⏳ Add load testing
4. ⏳ Create test data factories

---

## 💡 Pro Tips

1. **Run tests in watch mode during development**
   ```bash
   npm run test:e2e -- --watch
   ```

2. **Use test.only() to focus on one test**
   ```typescript
   test.only('debug this test', async ({ page }) => {
     // ...
   });
   ```

3. **Take screenshots for debugging**
   ```typescript
   await page.screenshot({ path: 'debug.png' });
   ```

4. **Use Playwright Inspector**
   ```bash
   PWDEBUG=1 npm run test:e2e
   ```

5. **Check test coverage**
   ```bash
   npm run test:coverage
   ```

---

**Happy Testing! 🧪**

For detailed documentation, see:
- [Cross-Browser Testing Strategy](./CROSS_BROWSER_TESTING_STRATEGY.md)
- [Browser Compatibility Guide](./BROWSER_COMPATIBILITY.md)
- [Testing Checklist](../.github/TESTING_CHECKLIST.md)
