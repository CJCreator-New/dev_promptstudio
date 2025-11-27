# Manual Testing Checklist

## Pre-Testing Setup

- [ ] Build production version: `npm run build`
- [ ] Preview build: `npm run preview`
- [ ] Clear browser cache
- [ ] Open DevTools console
- [ ] Check for console errors

## Critical User Flows

### 1. Prompt Enhancement Flow

**Steps:**
1. Open app
2. Enter prompt: "Build a todo app with React"
3. Wait for auto-save (2 seconds)
4. Verify "Saved" indicator appears
5. Click "Enhance Prompt"
6. Verify loading state shows
7. Wait for enhanced prompt
8. Verify output displays
9. Check history updated

**Expected:**
- ✅ Auto-save triggers at 2s
- ✅ Loading spinner shows
- ✅ Enhanced prompt streams in
- ✅ History item created
- ✅ No console errors

---

### 2. Draft Recovery Flow

**Steps:**
1. Enter text: "Test draft recovery"
2. Wait for auto-save
3. Close browser tab
4. Reopen app
5. Verify recovery modal shows
6. Click "Recover"
7. Verify text restored

**Expected:**
- ✅ Modal appears on load
- ✅ Draft timestamp shown
- ✅ Text fully restored
- ✅ Options preserved

---

### 3. Template Creation

**Steps:**
1. Enter prompt
2. Click "Save as Template"
3. Enter name: "React Component"
4. Click "Save"
5. Verify success message
6. Open templates
7. Verify template listed
8. Click template
9. Verify prompt loaded

**Expected:**
- ✅ Template saves
- ✅ Appears in list
- ✅ Loads correctly

---

### 4. History Navigation

**Steps:**
1. Complete 3 enhancements
2. Click "History"
3. Verify 3 items shown
4. Click history item
5. Verify prompt loads
6. Verify output shows

**Expected:**
- ✅ All items listed
- ✅ Timestamps correct
- ✅ Click loads data

---

## Error Recovery

### API Error

**Steps:**
1. Disconnect internet
2. Enter prompt
3. Click "Enhance"
4. Verify error message
5. Reconnect internet
6. Click "Retry"
7. Verify success

**Expected:**
- ✅ User-friendly error
- ✅ Retry button visible
- ✅ Retry works

---

### Component Error

**Steps:**
1. Trigger error (if possible)
2. Verify error boundary
3. Check error message
4. Click "Try Again"
5. Verify app resets

**Expected:**
- ✅ Fallback UI shows
- ✅ Error logged
- ✅ Reset works
- ✅ Data preserved

---

## Offline Behavior

**Steps:**
1. Open app online
2. Disconnect internet
3. Verify offline indicator
4. Enter text
5. Verify auto-save works
6. Try to enhance
7. Verify queue message
8. Reconnect internet
9. Verify sync

**Expected:**
- ✅ Offline indicator shows
- ✅ Local save works
- ✅ Queue message clear
- ✅ Syncs when online

---

## Cross-Browser Testing

### Chrome (Windows/Mac/Linux)

- [ ] App loads
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] IndexedDB works

### Firefox (Windows/Mac/Linux)

- [ ] App loads
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] IndexedDB works

### Safari (Mac)

- [ ] App loads
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] IndexedDB works

### Edge (Windows)

- [ ] App loads
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] IndexedDB works

---

## Mobile Testing

### iOS Safari (iPhone)

**Device:** iPhone 12/13/14
**Viewport:** 390x844

**Tests:**
- [ ] App loads
- [ ] Touch interactions work
- [ ] Swipe gestures work
- [ ] Virtual keyboard doesn't break layout
- [ ] Text readable (no zoom needed)
- [ ] Buttons tappable (44x44px min)
- [ ] Scrolling smooth
- [ ] No horizontal scroll

**Steps:**
1. Open Safari
2. Navigate to app
3. Test all flows
4. Rotate device
5. Test landscape mode

---

### Chrome Android

**Device:** Pixel 5/6/7
**Viewport:** 393x851

**Tests:**
- [ ] App loads
- [ ] Touch interactions work
- [ ] Swipe gestures work
- [ ] Virtual keyboard doesn't break layout
- [ ] Text readable
- [ ] Buttons tappable
- [ ] Scrolling smooth
- [ ] No horizontal scroll

---

### Tablet (iPad)

**Device:** iPad Air/Pro
**Viewport:** 820x1180

**Tests:**
- [ ] App loads
- [ ] Layout adapts
- [ ] Touch interactions work
- [ ] Split view works
- [ ] Keyboard shortcuts work (if connected)

---

## Accessibility Testing

### Keyboard Navigation

**Steps:**
1. Tab through all elements
2. Verify focus visible
3. Verify logical order
4. Press Enter on buttons
5. Press Escape on modals
6. Use arrow keys in dropdowns

**Expected:**
- ✅ All interactive elements reachable
- ✅ Focus indicators visible
- ✅ Order makes sense
- ✅ Enter activates
- ✅ Escape closes
- ✅ Arrows navigate

---

### Screen Reader (NVDA)

**Steps:**
1. Start NVDA (Ctrl+Alt+N)
2. Navigate with Tab
3. Listen to announcements
4. Check form labels
5. Check button labels
6. Check loading states
7. Check error messages

**Expected:**
- ✅ All text announced
- ✅ Labels clear
- ✅ States announced
- ✅ Errors announced

---

### Color Contrast

**Tools:** Chrome DevTools

**Steps:**
1. Open DevTools
2. Inspect text elements
3. Check contrast ratio
4. Verify ≥ 4.5:1 (normal)
5. Verify ≥ 3:1 (large text)

**Expected:**
- ✅ All text meets WCAG AA
- ✅ UI components ≥ 3:1

---

## Performance Testing

### Lighthouse Audit

**Steps:**
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Desktop"
4. Click "Generate report"
5. Review scores

**Target Scores:**
- Performance: > 90
- Accessibility: 100
- Best Practices: > 90
- SEO: > 90

**Metrics:**
- FCP: < 1.5s
- LCP: < 2.5s
- TBT: < 200ms
- CLS: < 0.1

---

### Network Throttling

**Steps:**
1. Open DevTools Network tab
2. Select "Slow 3G"
3. Reload app
4. Test interactions
5. Verify loading states
6. Check timeouts

**Expected:**
- ✅ App loads (slower)
- ✅ Loading states show
- ✅ No timeouts
- ✅ Graceful degradation

---

## Edge Cases

### Long Input

**Steps:**
1. Enter 10,000 character prompt
2. Verify no lag
3. Submit
4. Verify handles correctly

---

### Rapid Clicks

**Steps:**
1. Click submit rapidly (10x)
2. Verify only one request
3. Verify no duplicate history

---

### Browser Back/Forward

**Steps:**
1. Navigate through app
2. Click browser back
3. Verify state preserved
4. Click forward
5. Verify state preserved

---

### Multiple Tabs

**Steps:**
1. Open app in 2 tabs
2. Make changes in tab 1
3. Switch to tab 2
4. Verify sync (if applicable)

---

## Security Testing

### XSS Prevention

**Steps:**
1. Enter: `<script>alert('XSS')</script>`
2. Submit
3. Verify sanitized
4. Check output

**Expected:**
- ✅ Script not executed
- ✅ Text escaped

---

### API Key Protection

**Steps:**
1. Open DevTools Network
2. Submit prompt
3. Check request headers
4. Verify API key not exposed

**Expected:**
- ✅ Key not in client
- ✅ Requests secure

---

## Sign-Off Checklist

### Functionality
- [ ] All features work
- [ ] No critical bugs
- [ ] Error handling works
- [ ] Data persists

### Performance
- [ ] Lighthouse > 90
- [ ] FCP < 1.5s
- [ ] No lag on interactions
- [ ] Animations smooth

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes
- [ ] Focus management correct

### Cross-Browser
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works

### Mobile
- [ ] iOS Safari works
- [ ] Chrome Android works
- [ ] Tablet works
- [ ] Touch interactions work

### Security
- [ ] XSS prevented
- [ ] API key protected
- [ ] Data sanitized
- [ ] HTTPS enforced

---

## Issue Reporting

**Template:**
```
Title: [Brief description]

Environment:
- Browser: [Chrome 120]
- OS: [Windows 11]
- Device: [Desktop/Mobile]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected: [What should happen]
Actual: [What actually happened]

Screenshots: [If applicable]
Console Errors: [If any]
```

---

## Testing Schedule

**Before Release:**
- [ ] All critical flows
- [ ] Cross-browser (desktop)
- [ ] Mobile (iOS + Android)
- [ ] Accessibility
- [ ] Performance

**After Release:**
- [ ] Monitor errors
- [ ] Check analytics
- [ ] User feedback
- [ ] Performance metrics
