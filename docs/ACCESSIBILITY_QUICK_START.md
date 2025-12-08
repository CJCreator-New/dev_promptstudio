# Accessibility Testing - Quick Start

Get started with WCAG 2.1 AA accessibility testing in 5 minutes.

---

## 🚀 Installation (2 min)

```bash
# Install dependencies
npm install

# Install browser extensions (optional but recommended)
# Chrome: axe DevTools - https://chrome.google.com/webstore/detail/lhdoppojpmngadmnindnejefpokejbdd
# Firefox: axe DevTools - https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/
```

---

## ✅ Run Tests (1 min)

```bash
# Automated Playwright tests
npm run a11y:test

# Pa11y audit
npm run a11y:audit

# View report
npm run a11y:report

# Lint for accessibility issues
npm run lint:a11y
```

---

## 🎯 What Gets Tested

### Automated Tests Check:
- ✅ Color contrast (4.5:1 ratio)
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Form labels
- ✅ Image alt text
- ✅ Heading hierarchy
- ✅ Focus indicators
- ✅ Screen reader compatibility

### Pass Criteria:
- **Zero violations** in automated tests
- **All functionality** accessible via keyboard
- **All content** announced by screen readers

---

## 🔧 Quick Fixes

### Fix Missing Alt Text
```tsx
// ❌ Before
<img src="logo.png" />

// ✅ After
<img src="logo.png" alt="DevPrompt Studio logo" />
```

### Fix Low Contrast
```css
/* ❌ Before: 3.2:1 ratio */
.text { color: #999; }

/* ✅ After: 5.7:1 ratio */
.text { color: #666; }
```

### Fix Missing Label
```tsx
// ❌ Before
<input type="text" placeholder="Email" />

// ✅ After
<label htmlFor="email">Email</label>
<input id="email" type="text" />
```

### Fix Invalid ARIA
```tsx
// ❌ Before
<button aria-labelledby="missing-id">×</button>

// ✅ After
<button aria-label="Close dialog">×</button>
```

---

## ⌨️ Manual Testing (2 min)

### Keyboard Test
1. Unplug mouse
2. Press **Tab** to navigate
3. Press **Enter** to activate buttons
4. Press **Escape** to close modals

**Pass if**: All functionality works without mouse

### Screen Reader Test (Windows)
1. Download [NVDA](https://www.nvaccess.org/) (free)
2. Press **Ctrl+Alt+N** to start
3. Press **Tab** to navigate
4. Listen to announcements

**Pass if**: All content is announced clearly

### Screen Reader Test (Mac)
1. Press **Cmd+F5** to start VoiceOver
2. Press **VO+Right Arrow** to navigate (VO = Ctrl+Option)
3. Listen to announcements

**Pass if**: All content is announced clearly

---

## 🐛 Common Issues

### Issue: Test Fails with "Color contrast"
**Fix**: Use [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Minimum ratio: 4.5:1 for normal text
- Minimum ratio: 3:1 for large text (18pt+)

### Issue: Test Fails with "Missing label"
**Fix**: Add label to form input
```tsx
<label htmlFor="input-id">Label</label>
<input id="input-id" type="text" />
```

### Issue: Test Fails with "Invalid ARIA"
**Fix**: Check ARIA attribute references valid ID
```tsx
// Ensure ID exists
<h2 id="dialog-title">Title</h2>
<div aria-labelledby="dialog-title">Content</div>
```

### Issue: Keyboard navigation doesn't work
**Fix**: Ensure interactive elements are focusable
```tsx
// Use button, not div
<button onClick={handleClick}>Click</button>

// Or add tabIndex
<div tabIndex={0} onClick={handleClick}>Click</div>
```

---

## 📊 CI/CD Integration

Tests run automatically on every commit via GitHub Actions.

**View results**: Check the "Accessibility Tests" workflow in GitHub Actions

**Block merge if**: Any accessibility violations found

---

## 📚 Full Documentation

- **[Accessibility Compliance Guide](./ACCESSIBILITY_COMPLIANCE.md)** - Complete guide
- **[Manual Testing Procedures](./ACCESSIBILITY_MANUAL_TESTING.md)** - Step-by-step tests
- **[WCAG 2.1 Checklist](./ACCESSIBILITY_COMPLIANCE.md#wcag-21-aa-checklist)** - Full checklist

---

## 🎓 Learning Resources

### Quick Reads (5 min each)
- [WebAIM WCAG Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Visual feedback
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Color contrast

### Screen Readers
- [NVDA](https://www.nvaccess.org/) - Windows (free)
- VoiceOver - Mac/iOS (built-in, Cmd+F5)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) - Windows (paid)

---

## ✨ Quick Commands Reference

```bash
# Run all accessibility tests
npm run a11y:test

# Run Pa11y audit
npm run a11y:audit

# View audit report
npm run a11y:report

# Lint for accessibility
npm run lint:a11y

# Run in CI/CD
npm run a11y:test && npm run a11y:audit
```

---

## 🎯 Success Criteria

### Before Merging PR
- ✅ `npm run a11y:test` passes (zero violations)
- ✅ `npm run lint:a11y` passes (no errors)
- ✅ Manual keyboard test passes
- ✅ Manual screen reader test passes (if UI changes)

### Before Release
- ✅ All automated tests pass
- ✅ Full manual testing complete
- ✅ No critical or high severity issues
- ✅ Documentation updated

---

**You're ready!** Run `npm run a11y:test` to start testing. 🎉
