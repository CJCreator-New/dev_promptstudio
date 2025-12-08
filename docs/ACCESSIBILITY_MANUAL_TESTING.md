# Manual Accessibility Testing Procedures

Step-by-step guide for manual WCAG 2.1 AA testing.

---

## 🎯 Testing Schedule

- **Daily**: Automated tests (CI/CD)
- **Weekly**: Keyboard + Screen reader
- **Monthly**: Full manual audit
- **Pre-release**: Complete checklist

---

## ⌨️ Keyboard Navigation Testing (15 min)

### Setup
1. Unplug mouse or don't use trackpad
2. Open DevPrompt Studio
3. Start from top of page

### Test Procedure

#### 1. Tab Order Test
```
Action: Press Tab repeatedly
Expected: Focus moves through all interactive elements in logical order

✓ Header navigation
✓ Main input textarea
✓ Enhancement button
✓ Settings button
✓ History sidebar items
✓ Modal buttons (if open)
✓ Footer links

❌ Fail if: Focus jumps unexpectedly or skips elements
```

#### 2. Reverse Tab Test
```
Action: Press Shift+Tab
Expected: Focus moves backward through elements

✓ Reverse order matches forward order
✓ No elements skipped

❌ Fail if: Different elements focused than forward Tab
```

#### 3. Focus Visibility Test
```
Action: Tab through all elements
Expected: Clear visual focus indicator on each element

✓ Outline or border visible
✓ Contrast ratio ≥3:1 against background
✓ Not hidden by other elements

❌ Fail if: Focus indicator missing or invisible
```

#### 4. Skip Link Test
```
Action: Press Tab on page load
Expected: "Skip to main content" link appears

✓ Skip link visible on focus
✓ Pressing Enter jumps to main content
✓ Focus moves to main content area

❌ Fail if: Skip link missing or doesn't work
```

#### 5. Button Activation Test
```
Action: Tab to button, press Enter or Space
Expected: Button activates

Test buttons:
✓ Enhance Prompt (Enter/Space)
✓ Save Project (Enter/Space)
✓ Close Modal (Enter/Space/Escape)
✓ Settings (Enter/Space)

❌ Fail if: Button doesn't activate or requires mouse
```

#### 6. Form Input Test
```
Action: Tab to input, type text
Expected: Input accepts keyboard input

✓ Main textarea accepts text
✓ Email input accepts text
✓ Password input accepts text
✓ Search input accepts text

❌ Fail if: Cannot type or focus trapped
```

#### 7. Modal Dialog Test
```
Action: Open modal with keyboard
Expected: Focus trapped in modal

✓ Tab cycles within modal
✓ Shift+Tab cycles backward
✓ Escape closes modal
✓ Focus returns to trigger button

❌ Fail if: Focus escapes modal or Escape doesn't work
```

#### 8. Dropdown Menu Test
```
Action: Tab to dropdown, press Enter
Expected: Menu opens, arrow keys navigate

✓ Enter/Space opens menu
✓ Arrow Down moves to next item
✓ Arrow Up moves to previous item
✓ Enter selects item
✓ Escape closes menu

❌ Fail if: Arrow keys don't work or menu doesn't close
```

#### 9. Keyboard Shortcuts Test
```
Action: Press documented shortcuts
Expected: Shortcuts work

✓ Ctrl+E: Enhance prompt
✓ Ctrl+S: Save project
✓ Ctrl+K: Focus search
✓ Escape: Close modal

❌ Fail if: Shortcuts don't work or conflict
```

#### 10. No Keyboard Trap Test
```
Action: Tab through entire page
Expected: Can reach all elements and return to browser

✓ Can Tab to browser address bar
✓ No infinite loops
✓ No dead ends

❌ Fail if: Stuck in any element
```

### Results Template
```
Date: ___________
Tester: ___________

Keyboard Navigation: ✅ Pass / ❌ Fail
Issues found: ___________
Notes: ___________
```

---

## 🔊 Screen Reader Testing (30 min)

### NVDA (Windows)

#### Setup
1. Download NVDA: https://www.nvaccess.org/
2. Install and restart
3. Press Ctrl+Alt+N to start
4. Open DevPrompt Studio

#### Test Procedure

##### 1. Page Structure Test
```
Action: Press H to jump between headings
Expected: Headings announced in order

✓ H1: "DevPrompt Studio" (or page title)
✓ H2: Section headings
✓ H3: Subsection headings
✓ Logical hierarchy (no skipped levels)

Commands:
- H: Next heading
- Shift+H: Previous heading
- 1-6: Jump to heading level

❌ Fail if: Headings missing or out of order
```

##### 2. Landmark Navigation Test
```
Action: Press D to jump between landmarks
Expected: Landmarks announced

✓ Banner (header)
✓ Navigation
✓ Main content
✓ Complementary (sidebar)
✓ Contentinfo (footer)

Commands:
- D: Next landmark
- Shift+D: Previous landmark

❌ Fail if: Landmarks missing or mislabeled
```

##### 3. Link Navigation Test
```
Action: Press K to jump between links
Expected: Links announced with purpose

✓ Link text descriptive
✓ "Link, [text]" announced
✓ Current page links identified

Commands:
- K: Next link
- Shift+K: Previous link
- Enter: Activate link

❌ Fail if: Links say "click here" or "read more"
```

##### 4. Form Navigation Test
```
Action: Press F to jump between form fields
Expected: Labels announced

✓ "Edit, [label]" for inputs
✓ "Button, [label]" for buttons
✓ Required fields announced
✓ Error messages announced

Commands:
- F: Next form field
- Shift+F: Previous form field
- E: Next edit field

❌ Fail if: Labels missing or unclear
```

##### 5. Button Test
```
Action: Tab to button
Expected: Button announced with label

✓ "Button, Enhance Prompt"
✓ "Button, Save Project"
✓ State announced (pressed/not pressed)

❌ Fail if: Button says "Button" only
```

##### 6. Image Test
```
Action: Press G to jump to graphics
Expected: Alt text announced

✓ "Graphic, [alt text]"
✓ Decorative images skipped
✓ Icons have labels

Commands:
- G: Next graphic
- Shift+G: Previous graphic

❌ Fail if: Images say "Graphic" only
```

##### 7. Table Test (if applicable)
```
Action: Press T to jump to tables
Expected: Table structure announced

✓ "Table with X rows and Y columns"
✓ Headers announced
✓ Cell content announced

Commands:
- T: Next table
- Ctrl+Alt+Arrow: Navigate cells

❌ Fail if: Table structure unclear
```

##### 8. Live Region Test
```
Action: Trigger status message
Expected: Message announced automatically

✓ Success: "Prompt enhanced"
✓ Error: "Error: [message]"
✓ Loading: "Loading..."

❌ Fail if: Messages not announced
```

##### 9. Modal Dialog Test
```
Action: Open modal
Expected: Dialog announced

✓ "Dialog, [title]"
✓ Content announced
✓ Escape closes dialog
✓ Focus returns to trigger

❌ Fail if: Dialog not announced or focus lost
```

##### 10. Dynamic Content Test
```
Action: Trigger content change
Expected: Change announced

✓ New content announced
✓ Removed content announced
✓ Loading states announced

❌ Fail if: Changes silent
```

### VoiceOver (macOS)

#### Setup
1. Press Cmd+F5 to start VoiceOver
2. Open DevPrompt Studio
3. Use VO+Right Arrow to navigate

#### Quick Commands
```
VO = Ctrl+Option

VO+Right Arrow: Next item
VO+Left Arrow: Previous item
VO+Space: Activate
VO+H: Next heading
VO+L: Next link
VO+J: Next form control
VO+U: Rotor (navigation menu)
```

#### Test Same Items as NVDA
Follow same test procedure as NVDA section above.

### Results Template
```
Date: ___________
Tester: ___________
Screen Reader: NVDA / VoiceOver / JAWS

Page Structure: ✅ Pass / ❌ Fail
Landmarks: ✅ Pass / ❌ Fail
Links: ✅ Pass / ❌ Fail
Forms: ✅ Pass / ❌ Fail
Buttons: ✅ Pass / ❌ Fail
Images: ✅ Pass / ❌ Fail
Live Regions: ✅ Pass / ❌ Fail
Modals: ✅ Pass / ❌ Fail

Issues found: ___________
Notes: ___________
```

---

## 🎨 Color Contrast Testing (10 min)

### Using axe DevTools

#### Setup
1. Install axe DevTools extension
2. Open DevPrompt Studio
3. Press F12 → axe DevTools tab

#### Test Procedure

##### 1. Automated Scan
```
Action: Click "Scan ALL of my page"
Expected: Zero contrast violations

✓ All text ≥4.5:1 ratio
✓ Large text (18pt+) ≥3:1 ratio
✓ UI components ≥3:1 ratio

❌ Fail if: Any contrast violations
```

##### 2. Manual Spot Check
```
Action: Use color picker on text
Expected: Contrast ratio displayed

Test areas:
✓ Body text on background
✓ Button text on button
✓ Link text on background
✓ Placeholder text
✓ Disabled text (if ≥3:1)

Tool: https://webaim.org/resources/contrastchecker/
```

##### 3. Dark Mode Test
```
Action: Switch to dark mode
Expected: All text still meets contrast

✓ Re-run automated scan
✓ Check all text colors
✓ Check focus indicators

❌ Fail if: Dark mode has violations
```

##### 4. Focus Indicator Test
```
Action: Tab to element, check focus outline
Expected: Outline ≥3:1 contrast

✓ Outline visible against background
✓ Outline visible against element
✓ Outline thickness ≥2px

❌ Fail if: Focus indicator invisible
```

### Results Template
```
Date: ___________
Tester: ___________

Light Mode Contrast: ✅ Pass / ❌ Fail
Dark Mode Contrast: ✅ Pass / ❌ Fail
Focus Indicators: ✅ Pass / ❌ Fail

Violations found: ___________
Notes: ___________
```

---

## 🔍 Zoom & Reflow Testing (10 min)

### 200% Zoom Test

#### Setup
1. Open DevPrompt Studio
2. Press Ctrl/Cmd + + to zoom to 200%

#### Test Procedure
```
Action: Zoom to 200%
Expected: All content visible, no horizontal scroll

✓ All text readable
✓ No horizontal scrollbar
✓ No content cut off
✓ No overlapping elements
✓ All buttons clickable

❌ Fail if: Horizontal scroll or content hidden
```

### 400% Zoom Test
```
Action: Zoom to 400%
Expected: Content reflows, no loss

✓ Content stacks vertically
✓ All text readable
✓ All functionality works
✓ No horizontal scroll

❌ Fail if: Content lost or unusable
```

### Mobile Width Test
```
Action: Resize to 320px width
Expected: Content fits without horizontal scroll

✓ Responsive layout activates
✓ No horizontal scroll
✓ Touch targets ≥44x44px
✓ Text readable

❌ Fail if: Horizontal scroll required
```

### Results Template
```
Date: ___________
Tester: ___________

200% Zoom: ✅ Pass / ❌ Fail
400% Zoom: ✅ Pass / ❌ Fail
320px Width: ✅ Pass / ❌ Fail

Issues found: ___________
Notes: ___________
```

---

## 📱 Mobile Touch Testing (15 min)

### Setup
1. Test on real device (iPhone/Android)
2. Or use browser DevTools device emulation

### Test Procedure

#### 1. Touch Target Size Test
```
Action: Tap all interactive elements
Expected: Easy to tap, no mis-taps

✓ Buttons ≥44x44px
✓ Links ≥44x44px
✓ Form inputs ≥44x44px
✓ Adequate spacing between targets

Tool: Measure with browser DevTools

❌ Fail if: Targets <44x44px or too close
```

#### 2. Gesture Test
```
Action: Test swipe gestures
Expected: Gestures work

✓ Swipe to dismiss (if applicable)
✓ Pinch to zoom
✓ Scroll with finger
✓ Pull to refresh disabled

❌ Fail if: Gestures don't work or conflict
```

#### 3. Orientation Test
```
Action: Rotate device
Expected: Layout adapts

✓ Portrait mode works
✓ Landscape mode works
✓ Content doesn't get cut off
✓ Functionality preserved

❌ Fail if: Layout breaks or content lost
```

#### 4. Keyboard Test (iOS/Android)
```
Action: Tap input field
Expected: Keyboard appears, doesn't break layout

✓ Keyboard appears
✓ Input visible above keyboard
✓ Can scroll to see content
✓ Keyboard dismisses properly

❌ Fail if: Input hidden or layout broken
```

### Results Template
```
Date: ___________
Tester: ___________
Device: ___________

Touch Targets: ✅ Pass / ❌ Fail
Gestures: ✅ Pass / ❌ Fail
Orientation: ✅ Pass / ❌ Fail
Keyboard: ✅ Pass / ❌ Fail

Issues found: ___________
Notes: ___________
```

---

## 📋 Complete Manual Test Checklist

### Pre-Release Testing (60 min)

```
□ Keyboard Navigation (15 min)
  □ Tab order logical
  □ Focus visible
  □ Skip links work
  □ Buttons activate with Enter/Space
  □ Modals trap focus
  □ Escape closes modals
  □ No keyboard traps
  □ Shortcuts work

□ Screen Reader (30 min)
  □ Page structure clear
  □ Landmarks present
  □ Links descriptive
  □ Forms labeled
  □ Buttons labeled
  □ Images have alt text
  □ Live regions announce
  □ Modals announced

□ Color Contrast (10 min)
  □ Light mode ≥4.5:1
  □ Dark mode ≥4.5:1
  □ Focus indicators ≥3:1
  □ UI components ≥3:1

□ Zoom & Reflow (10 min)
  □ 200% zoom works
  □ 400% zoom works
  □ 320px width works
  □ No horizontal scroll

□ Mobile Touch (15 min)
  □ Touch targets ≥44x44px
  □ Gestures work
  □ Orientation works
  □ Keyboard doesn't break layout

□ Automated Tests
  □ npm run a11y:test passes
  □ npm run a11y:audit passes
  □ npm run lint:a11y passes

□ Documentation
  □ Keyboard shortcuts documented
  □ ARIA attributes documented
  □ Known issues documented
```

---

## 🐛 Issue Reporting Template

```markdown
## Accessibility Issue Report

**Date**: ___________
**Tester**: ___________
**Severity**: Critical / High / Medium / Low

### Issue Description
[Describe the accessibility issue]

### WCAG Criterion
[e.g., 1.4.3 Contrast (Minimum) - Level AA]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Impact
[Who is affected and how]

### Screenshots
[Attach screenshots if applicable]

### Suggested Fix
[How to fix the issue]

### Testing Method
- [ ] Automated (axe-core)
- [ ] Keyboard navigation
- [ ] Screen reader (NVDA/VoiceOver)
- [ ] Color contrast tool
- [ ] Manual inspection

### Priority
- [ ] Blocks release
- [ ] Should fix before release
- [ ] Can fix after release
```

---

## 📊 Testing Metrics

### Track These Metrics
- **Test Frequency**: Weekly minimum
- **Issues Found**: Track over time
- **Time to Fix**: <24 hours for critical
- **Regression Rate**: <5%
- **Coverage**: 100% of critical paths

### Monthly Report Template
```
Month: ___________

Tests Conducted: ___________
Issues Found: ___________
Issues Fixed: ___________
Open Issues: ___________

Critical: ___________
High: ___________
Medium: ___________
Low: ___________

Compliance Rate: ___________%
```

---

**Remember**: Manual testing catches issues automated tools miss. Test regularly!
