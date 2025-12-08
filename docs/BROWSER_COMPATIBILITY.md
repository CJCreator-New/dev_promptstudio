# Browser Compatibility Guide

## Supported Browsers

### ✅ Fully Supported (Tier 1)
- **Chrome/Edge**: Latest 2 versions (90+)
- **Safari**: Latest 2 versions (14+)
- **Firefox**: Latest + ESR (88+)

### ⚠️ Partially Supported (Tier 2)
- **Mobile Safari**: iOS 14+ (some limitations)
- **Chrome Android**: Android 10+
- **Samsung Internet**: Latest version

### ❌ Not Supported
- Internet Explorer 11 and below
- Opera Mini
- UC Browser

---

## Known Browser-Specific Issues

### Safari (macOS/iOS)

#### IndexedDB Quota Limits
**Issue**: Safari has stricter storage quotas (50MB vs Chrome's 60% of disk)
**Impact**: History may be limited on Safari
**Workaround**: Implemented in `utils/db.ts`
```typescript
// Auto-cleanup when approaching quota
if (quota - usage < 10MB) cleanupOldHistory();
```

#### LocalStorage in Private Mode
**Issue**: Throws `QuotaExceededError` in private browsing
**Impact**: API keys won't persist
**Workaround**: Fallback to memory storage
```typescript
try {
  localStorage.setItem('key', value);
} catch {
  memoryStorage.set('key', value);
}
```

#### 100vh Viewport Bug
**Issue**: `100vh` doesn't account for Safari's dynamic toolbar
**Impact**: Content cut off at bottom
**Fix**: Applied in `index.css`
```css
.min-h-screen {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}
```

#### Input Zoom on Focus
**Issue**: Safari zooms in when input font-size < 16px
**Impact**: Disruptive UX on mobile
**Fix**: All inputs use 16px minimum
```css
input, textarea { font-size: 16px; }
```

---

### Firefox

#### Scrollbar Styling
**Issue**: Firefox uses non-standard scrollbar properties
**Impact**: Custom scrollbars look different
**Fix**: Applied in `index.css`
```css
* {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #1a202c;
}
```

#### Flexbox Min-Height
**Issue**: Flexbox children don't respect min-height
**Impact**: Layout issues in sidebar
**Fix**: Add `min-height: 0` to flex children

---

### Mobile Safari (iOS)

#### Safe Area Insets
**Issue**: Content hidden by notch/home indicator
**Impact**: Buttons unreachable on iPhone X+
**Fix**: Applied padding
```css
padding: env(safe-area-inset-top) env(safe-area-inset-right) 
         env(safe-area-inset-bottom) env(safe-area-inset-left);
```

#### Keyboard Pushing Content
**Issue**: Virtual keyboard changes viewport height
**Impact**: Fixed elements jump
**Fix**: Use `visualViewport` API
```typescript
visualViewport.addEventListener('resize', handleResize);
```

---

### Chrome Android

#### Pull-to-Refresh
**Issue**: Conflicts with scrollable content
**Impact**: Accidental page refreshes
**Fix**: Disable on main container
```css
.main-container {
  overscroll-behavior-y: contain;
}
```

---

## Feature Support Matrix

| Feature | Chrome | Firefox | Safari | Edge | Mobile Safari | Chrome Android |
|---------|--------|---------|--------|------|---------------|----------------|
| IndexedDB | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| LocalStorage | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ |
| Clipboard API | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ✅ |
| Service Workers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| WebRTC | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSS Backdrop Filter | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| WebP Images | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

Legend: ✅ Full support | ⚠️ Partial support | ❌ No support

---

## Testing Checklist

### Before Each Release

#### Desktop (Chrome, Firefox, Safari, Edge)
- [ ] Login/logout flow
- [ ] Prompt enhancement with all providers
- [ ] History save/load
- [ ] Template creation/editing
- [ ] Share link generation
- [ ] Keyboard shortcuts (Ctrl+E, Ctrl+S)
- [ ] Dark/light theme toggle
- [ ] Modal dialogs (ESC to close)
- [ ] Copy to clipboard

#### Mobile (iOS Safari, Chrome Android)
- [ ] Touch navigation
- [ ] Virtual keyboard behavior
- [ ] Responsive layout (portrait/landscape)
- [ ] Touch target sizes (44x44px)
- [ ] Swipe gestures
- [ ] Pull-to-refresh disabled
- [ ] Safe area insets

#### Tablet (iPad)
- [ ] Split-screen layout
- [ ] Keyboard shortcuts (with external keyboard)
- [ ] Pencil input (if applicable)

---

## Reporting Browser Issues

When reporting a browser-specific bug, include:

1. **Browser**: Name and version (e.g., Safari 17.2)
2. **OS**: Operating system and version (e.g., macOS 14.2)
3. **Device**: If mobile (e.g., iPhone 14 Pro)
4. **Steps to reproduce**: Detailed steps
5. **Expected behavior**: What should happen
6. **Actual behavior**: What actually happens
7. **Screenshots**: If visual issue
8. **Console errors**: From DevTools

**Template**:
```markdown
**Browser**: Safari 17.2
**OS**: macOS 14.2
**Device**: MacBook Pro M2

**Steps**:
1. Open DevPrompt Studio
2. Click "Enhance Prompt"
3. Observe error

**Expected**: Prompt enhances successfully
**Actual**: Error "QuotaExceededError"

**Console**: [paste error]
```

---

## Browser Testing Tools

### DevTools
- **Chrome**: F12 or Cmd+Option+I
- **Firefox**: F12 or Cmd+Option+I
- **Safari**: Cmd+Option+I (enable in Preferences → Advanced)
- **Edge**: F12 or Cmd+Option+I

### Remote Debugging
- **iOS Safari**: Connect iPhone → Safari → Develop menu
- **Chrome Android**: chrome://inspect on desktop

### Responsive Testing
- **Chrome DevTools**: Toggle device toolbar (Cmd+Shift+M)
- **Firefox**: Responsive Design Mode (Cmd+Option+M)
- **Safari**: Enter Responsive Design Mode

---

## Performance Targets by Browser

| Browser | FCP | LCP | TTI | CLS |
|---------|-----|-----|-----|-----|
| Chrome | <1.8s | <2.5s | <3.9s | <0.1 |
| Firefox | <2.0s | <2.8s | <4.2s | <0.1 |
| Safari | <2.2s | <3.0s | <4.5s | <0.1 |
| Mobile | <2.5s | <3.5s | <5.0s | <0.1 |

---

## Accessibility by Browser

All browsers must pass:
- ✅ WCAG 2.1 Level AA
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast 4.5:1

### Screen Reader Testing
- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (free) or JAWS
- **iOS**: VoiceOver (Settings → Accessibility)
- **Android**: TalkBack (Settings → Accessibility)
