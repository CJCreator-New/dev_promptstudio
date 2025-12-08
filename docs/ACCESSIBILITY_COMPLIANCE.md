# WCAG 2.1 AA Accessibility Compliance Guide

Complete guide to accessibility testing, compliance, and best practices for DevPrompt Studio.

---

## 🎯 Compliance Target

**Standard**: WCAG 2.1 Level AA  
**Goal**: 100% compliance with zero violations  
**Testing**: Automated + Manual validation

---

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Accessibility Tests
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

## 🛠️ Tools & Setup

### 1. Automated Testing (Playwright + axe-core)

**Installation**: Already configured ✅

**Usage**:
```bash
npm run a11y:test
```

**What it tests**:
- Color contrast (4.5:1 ratio)
- Keyboard navigation
- ARIA attributes
- Form labels
- Image alt text
- Heading hierarchy
- Focus indicators
- Screen reader compatibility

**Configuration**: `e2e/accessibility/wcag-compliance.spec.ts`

### 2. Pa11y CI Audits

**Installation**: Already configured ✅

**Usage**:
```bash
# Run audit
npm run a11y:audit

# View report
npm run a11y:report
```

**Configuration**: `.pa11yci.json`

**Features**:
- Tests multiple URLs
- Screenshots on failure
- JSON reports
- CI/CD integration

### 3. ESLint Accessibility Linting

**Installation**: Already configured ✅

**Usage**:
```bash
npm run lint:a11y
```

**Configuration**: `.eslintrc.a11y.json`

**Rules enforced**:
- Alt text on images
- Valid ARIA attributes
- Keyboard event handlers
- Form label associations
- Interactive element focus
- No positive tabindex
- Valid heading structure

### 4. Browser Extensions (Manual Testing)

#### Chrome/Edge
- **axe DevTools** (Free)
  - Install: [Chrome Web Store](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
  - Usage: F12 → axe DevTools tab
  - Features: Automated scans, guided tests, issue highlighting

- **WAVE** (Free)
  - Install: [Chrome Web Store](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
  - Usage: Click extension icon
  - Features: Visual feedback, contrast checker

- **Lighthouse** (Built-in)
  - Usage: F12 → Lighthouse tab → Accessibility
  - Features: Performance + accessibility scores

#### Firefox
- **axe DevTools** (Free)
  - Install: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)

- **WAVE** (Free)
  - Install: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool/)

#### Safari
- **Web Developer** (Free)
  - Install: Safari Extensions
  - Features: Outline elements, disable styles

### 5. Screen Readers

#### Windows
- **NVDA** (Free)
  - Download: [nvaccess.org](https://www.nvaccess.org/)
  - Shortcut: Ctrl+Alt+N to start
  - Usage: Tab to navigate, Enter to activate

- **JAWS** (Paid - $95/year)
  - Download: [freedomscientific.com](https://www.freedomscientific.com/products/software/jaws/)
  - Trial: 40 minutes per session

#### macOS
- **VoiceOver** (Built-in)
  - Shortcut: Cmd+F5 to toggle
  - Usage: VO+Right Arrow to navigate
  - Practice: System Preferences → Accessibility → VoiceOver → Open VoiceOver Training

#### iOS
- **VoiceOver** (Built-in)
  - Enable: Settings → Accessibility → VoiceOver
  - Shortcut: Triple-click home/side button
  - Usage: Swipe right to navigate

#### Android
- **TalkBack** (Built-in)
  - Enable: Settings → Accessibility → TalkBack
  - Shortcut: Volume keys
  - Usage: Swipe right to navigate

---

## 📋 WCAG 2.1 AA Checklist

### Perceivable

#### 1.1 Text Alternatives
- [ ] All images have alt text
- [ ] Decorative images use `alt=""`
- [ ] Icons have aria-label
- [ ] SVGs have title/desc elements

#### 1.2 Time-based Media
- [ ] Videos have captions (if applicable)
- [ ] Audio has transcripts (if applicable)

#### 1.3 Adaptable
- [ ] Semantic HTML (header, nav, main, footer)
- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] Lists use ul/ol/li
- [ ] Tables have th and scope
- [ ] Form inputs have labels

#### 1.4 Distinguishable
- [ ] Color contrast ≥4.5:1 (normal text)
- [ ] Color contrast ≥3:1 (large text 18pt+)
- [ ] Color not sole indicator
- [ ] Text resizable to 200%
- [ ] No horizontal scroll at 320px width
- [ ] Line height ≥1.5
- [ ] Paragraph spacing ≥2x font size

### Operable

#### 2.1 Keyboard Accessible
- [ ] All functionality via keyboard
- [ ] No keyboard traps
- [ ] Skip links present
- [ ] Focus order logical
- [ ] Keyboard shortcuts documented

#### 2.2 Enough Time
- [ ] No time limits (or adjustable)
- [ ] Pause/stop animations
- [ ] Auto-save implemented

#### 2.3 Seizures
- [ ] No flashing >3 times/second
- [ ] Reduced motion respected

#### 2.4 Navigable
- [ ] Page title descriptive
- [ ] Focus order logical
- [ ] Link purpose clear
- [ ] Multiple navigation methods
- [ ] Headings and labels descriptive
- [ ] Focus visible

#### 2.5 Input Modalities
- [ ] Touch targets ≥44x44px
- [ ] Pointer cancellation
- [ ] Label in name matches

### Understandable

#### 3.1 Readable
- [ ] Page language set (lang="en")
- [ ] Language changes marked

#### 3.2 Predictable
- [ ] Focus doesn't trigger changes
- [ ] Input doesn't trigger changes
- [ ] Navigation consistent
- [ ] Components consistent

#### 3.3 Input Assistance
- [ ] Error identification
- [ ] Labels/instructions provided
- [ ] Error suggestions
- [ ] Error prevention (confirmations)

### Robust

#### 4.1 Compatible
- [ ] Valid HTML
- [ ] ARIA attributes valid
- [ ] Status messages announced
- [ ] No duplicate IDs

---

## 🧪 Testing Procedures

### Automated Testing (Every Commit)

```bash
# Run in CI/CD
npm run a11y:test
```

**Checks**:
- WCAG 2.1 AA violations
- Color contrast
- ARIA validity
- Keyboard navigation
- Form labels
- Image alt text

**Pass Criteria**: Zero violations

### Manual Testing (Weekly)

#### Keyboard Navigation Test
1. Unplug mouse
2. Tab through all interactive elements
3. Verify focus indicators visible
4. Test Enter/Space on buttons
5. Test ESC to close modals
6. Test arrow keys in dropdowns

**Pass Criteria**: All functionality accessible

#### Screen Reader Test (NVDA/VoiceOver)
1. Start screen reader
2. Navigate with Tab/Arrow keys
3. Verify all content announced
4. Test form inputs
5. Test modals and dialogs
6. Test error messages

**Pass Criteria**: All content understandable

#### Color Contrast Test
1. Open axe DevTools
2. Run "Scan for issues"
3. Check contrast violations
4. Test in dark/light mode

**Pass Criteria**: All text ≥4.5:1 ratio

#### Zoom Test
1. Zoom to 200% (Ctrl/Cmd + +)
2. Verify no horizontal scroll
3. Verify all content visible
4. Test at 400% zoom

**Pass Criteria**: No content loss

#### Mobile Touch Test
1. Test on real device
2. Verify touch targets ≥44x44px
3. Test swipe gestures
4. Test pinch zoom

**Pass Criteria**: All targets tappable

### Regression Testing (Before Release)

```bash
# Full test suite
npm run a11y:test
npm run a11y:audit
npm run lint:a11y

# Manual checklist
# - Keyboard navigation
# - Screen reader (NVDA/VoiceOver)
# - Color contrast
# - Zoom to 200%
# - Mobile touch targets
```

---

## 🐛 Common Issues & Fixes

### Issue: Missing Alt Text
**Error**: `<img>` element missing alt attribute

**Fix**:
```tsx
// ❌ Bad
<img src="logo.png" />

// ✅ Good
<img src="logo.png" alt="DevPrompt Studio logo" />

// ✅ Decorative
<img src="divider.png" alt="" />
```

### Issue: Low Color Contrast
**Error**: Text color contrast ratio 3.2:1 (needs 4.5:1)

**Fix**:
```css
/* ❌ Bad */
.text { color: #999; background: #fff; } /* 2.8:1 */

/* ✅ Good */
.text { color: #666; background: #fff; } /* 5.7:1 */
```

**Tool**: [Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Issue: Missing Form Labels
**Error**: Form input missing associated label

**Fix**:
```tsx
// ❌ Bad
<input type="text" placeholder="Email" />

// ✅ Good
<label htmlFor="email">Email</label>
<input id="email" type="text" />

// ✅ Also good (implicit)
<label>
  Email
  <input type="text" />
</label>
```

### Issue: Invalid ARIA
**Error**: aria-labelledby references non-existent ID

**Fix**:
```tsx
// ❌ Bad
<button aria-labelledby="missing-id">Click</button>

// ✅ Good
<button aria-label="Close dialog">×</button>

// ✅ Also good
<h2 id="dialog-title">Confirm</h2>
<button aria-labelledby="dialog-title">OK</button>
```

### Issue: Keyboard Trap
**Error**: Cannot Tab out of modal

**Fix**:
```tsx
// Use focus trap library
import { FocusTrap } from '@/components/FocusTrap';

<FocusTrap>
  <Modal>
    <button onClick={close}>Close</button>
  </Modal>
</FocusTrap>
```

### Issue: No Focus Indicator
**Error**: Focus outline removed with CSS

**Fix**:
```css
/* ❌ Bad */
*:focus { outline: none; }

/* ✅ Good */
*:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

### Issue: Positive Tabindex
**Error**: tabindex="1" creates unpredictable tab order

**Fix**:
```tsx
// ❌ Bad
<button tabIndex={1}>First</button>
<button tabIndex={2}>Second</button>

// ✅ Good (natural DOM order)
<button>First</button>
<button>Second</button>

// ✅ Remove from tab order
<div tabIndex={-1}>Not focusable</div>
```

---

## 📝 Documentation Templates

### Component Accessibility Documentation

```markdown
## Accessibility

### Keyboard Support
- **Tab**: Move focus to next element
- **Shift+Tab**: Move focus to previous element
- **Enter/Space**: Activate button
- **Escape**: Close modal

### Screen Reader Support
- Component announces as "Button, Close dialog"
- State changes announced via aria-live
- Error messages announced immediately

### ARIA Attributes
- `role="dialog"`: Identifies modal
- `aria-labelledby`: References title
- `aria-describedby`: References description
- `aria-modal="true"`: Indicates modal state

### Focus Management
- Focus trapped within modal
- Focus returns to trigger on close
- First focusable element focused on open

### Color Contrast
- All text meets WCAG AA (4.5:1)
- Focus indicators meet 3:1 contrast
- Tested in light and dark modes

### Testing
- ✅ Automated: axe-core
- ✅ Manual: NVDA, VoiceOver
- ✅ Keyboard: Full navigation
```

### Feature Accessibility Checklist

```markdown
## [Feature Name] Accessibility Checklist

### Implementation
- [ ] Semantic HTML used
- [ ] ARIA attributes added
- [ ] Keyboard navigation works
- [ ] Focus management implemented
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Touch targets ≥44x44px
- [ ] Error messages accessible
- [ ] Loading states announced
- [ ] Success messages announced

### Testing
- [ ] Automated tests pass
- [ ] Manual keyboard test
- [ ] NVDA screen reader test
- [ ] VoiceOver screen reader test
- [ ] Color contrast check
- [ ] Zoom to 200% test
- [ ] Mobile touch test

### Documentation
- [ ] Keyboard shortcuts documented
- [ ] ARIA attributes documented
- [ ] Screen reader behavior documented
- [ ] Known issues documented
```

---

## 🎓 Best Practices

### 1. Semantic HTML
```tsx
// ✅ Good
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>
<footer>
  <p>© 2024</p>
</footer>
```

### 2. ARIA Landmarks
```tsx
<div role="banner">Header</div>
<div role="navigation">Nav</div>
<div role="main">Content</div>
<div role="complementary">Sidebar</div>
<div role="contentinfo">Footer</div>
```

### 3. Focus Management
```tsx
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    // Save current focus
    const previousFocus = document.activeElement;
    
    // Focus first element in modal
    modalRef.current?.querySelector('button')?.focus();
    
    return () => {
      // Restore focus on close
      (previousFocus as HTMLElement)?.focus();
    };
  }
}, [isOpen]);
```

### 4. Live Regions
```tsx
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>
```

### 5. Skip Links
```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Content */}
</main>
```

---

## 📊 Compliance Dashboard

### Current Status
- ✅ **Automated Tests**: Configured
- ✅ **CI/CD Integration**: Active
- ✅ **Linting Rules**: Enforced
- ✅ **Browser Extensions**: Documented
- ✅ **Screen Readers**: Tested

### Metrics
- **WCAG 2.1 AA Compliance**: Target 100%
- **Automated Test Coverage**: All critical paths
- **Manual Test Frequency**: Weekly
- **Violation Response Time**: <24 hours

### Quality Gates
- ✅ Zero automated violations
- ✅ Keyboard navigation works
- ✅ Screen reader compatible
- ✅ Color contrast ≥4.5:1
- ✅ Touch targets ≥44x44px

---

## 🔗 Resources

### Standards
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Section 508](https://www.section508.gov/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Pa11y](https://pa11y.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Testing
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [Keyboard Testing](https://webaim.org/articles/keyboard/)

### Learning
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Deque University](https://dequeuniversity.com/)

---

**Last Updated**: December 2024  
**Standard**: WCAG 2.1 Level AA  
**Status**: Production Ready ✅
