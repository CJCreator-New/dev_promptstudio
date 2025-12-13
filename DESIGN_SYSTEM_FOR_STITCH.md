# DevPrompt Studio - Design System for Google Stitch Redesign

## 📐 Overall Application Overview

**Application Name**: DevPrompt Studio  
**Purpose**: Version-controlled prompt engineering workspace  
**Target Users**: Developers, AI engineers, prompt engineers  
**Platform**: Web (Browser-based, responsive)  
**Design Philosophy**: Modern, minimalist, developer-centric

---

## 🎨 Color Palette

### Primary Colors
- **Primary Blue**: #5B5FFF (Main action color)
- **Primary Blue Hover**: #4F52E8 (Hover state)
- **Primary Blue Light**: #F0F2FF (Background tint)

### Neutral Colors
- **Background**: #FFFFFF (Light mode) / #0F172A (Dark mode)
- **Surface**: #F8F9FB (Light) / #1E293B (Dark)
- **Elevated**: #FFFFFF (Light) / #1E293B (Dark)
- **Border**: #E5E7EB (Light) / #334155 (Dark)

### Text Colors
- **Primary Text**: #1A1D29 (Light) / #F1F5F9 (Dark)
- **Secondary Text**: #6B7280 (Light) / #CBD5E1 (Dark)
- **Tertiary Text**: #9CA3AF (Light) / #94A3B8 (Dark)

### Semantic Colors
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Info**: #3B82F6 (Blue)

### Gradients
- **Primary Gradient**: linear-gradient(135deg, #5B5FFF 0%, #4F52E8 100%)
- **Success Gradient**: linear-gradient(135deg, #10B981 0%, #059669 100%)

---

## 🔤 Typography System

### Font Family
- **Primary Font**: Inter (System fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
- **Monospace Font**: 'Monaco', 'Courier New', monospace (for code)

### Font Sizes & Weights
```
H1: 28px, Bold (700), Line-height: 1.2
H2: 22px, Semibold (600), Line-height: 1.3
H3: 18px, Semibold (600), Line-height: 1.4
H4: 16px, Semibold (600), Line-height: 1.4

Body Large: 16px, Regular (400), Line-height: 1.6
Body: 14px, Regular (400), Line-height: 1.6
Body Small: 12px, Regular (400), Line-height: 1.5

Label: 12px, Medium (500), Line-height: 1.4
Caption: 11px, Regular (400), Line-height: 1.4

Code: 13px, Regular (400), Line-height: 1.5, Monospace
```

### Letter Spacing
- Headings: -0.5px (tighter)
- Body: 0px (normal)
- Labels: 0.5px (slightly wider)

---

## 🎯 Spacing System

### Base Unit: 4px

```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
3xl: 48px
4xl: 64px
```

### Common Spacing
- **Padding**: 12px, 16px, 24px
- **Margin**: 16px, 24px, 32px
- **Gap**: 8px, 12px, 16px
- **Border Radius**: 8px (default), 12px (large), 6px (small)

---

## 🔲 Component System

### Buttons
- **Primary Button**: 
  - Background: #5B5FFF
  - Text: White
  - Padding: 10px 16px
  - Border Radius: 8px
  - Font: 14px, Medium (500)
  - Shadow: 0 4px 15px rgba(91, 95, 255, 0.2)
  - Hover: Translate Y -2px, Shadow increase

- **Secondary Button**:
  - Background: #F8F9FB
  - Text: #1A1D29
  - Border: 1px #E5E7EB
  - Padding: 10px 16px
  - Border Radius: 8px

- **Ghost Button**:
  - Background: Transparent
  - Text: #6B7280
  - Hover: Background #F8F9FB
  - Padding: 10px 16px

### Input Fields
- **Height**: 40px
- **Padding**: 10px 12px
- **Border**: 1.5px #E5E7EB
- **Border Radius**: 8px
- **Font**: 14px
- **Focus**: Border #5B5FFF, Ring 0 0 0 3px rgba(91, 95, 255, 0.1)

### Cards
- **Background**: #FFFFFF (Light) / #1E293B (Dark)
- **Border**: 1px #E5E7EB
- **Border Radius**: 12px
- **Padding**: 16px, 24px
- **Shadow**: 0 1px 3px rgba(0, 0, 0, 0.08)
- **Hover Shadow**: 0 4px 12px rgba(0, 0, 0, 0.12)

### Modals
- **Overlay**: rgba(0, 0, 0, 0.7) with backdrop blur
- **Modal Background**: #FFFFFF (Light) / #1E293B (Dark)
- **Border Radius**: 12px
- **Max Width**: 90vw or 600px
- **Shadow**: 0 20px 25px rgba(0, 0, 0, 0.15)

---

## 📱 Page Layouts

### 1. Main Dashboard (Home Page)
**Layout**: 3-column layout (Desktop), 1-column (Mobile)

**Sections**:
- **Header** (Fixed, Full width)
  - Logo + Title (Left)
  - User info + Theme toggle + API Keys + Feedback (Right)
  - Height: 64px
  - Background: #FFFFFF with backdrop blur

- **Main Content Area** (Flex layout)
  - **Left Column** (45%): Prompt Input Panel
  - **Center Column** (45%): Prompt Output Panel
  - **Right Column** (280px, Desktop only): History Sidebar

- **Mobile Sidebar** (Slide-out, Mobile only)
  - Overlay: rgba(0, 0, 0, 0.7)
  - Width: 80% max 320px
  - Animation: Slide from left

### 2. Prompt Input Panel
**Components**:
- Mode Selector (Dropdown)
- Domain Selector (Dropdown)
- Platform Selector (Dropdown)
- Target Tool Selector (Dropdown)
- Complexity Level (Radio buttons)
- Input Textarea (Full height)
- Advanced Options (Collapsible)
- Enhance Button (Primary, Full width)
- Save Project Button (Secondary)
- Save as Template Button (Secondary)

**Styling**:
- Background: #F8F9FB (Light) / #1E293B (Dark)
- Border: 1px #E5E7EB
- Border Radius: 12px
- Padding: 16px
- Height: calc(100vh - 120px)

### 3. Prompt Output Panel
**Components**:
- Output Display (Read-only textarea or formatted text)
- Copy Button (Top right)
- Share Button
- Chain Prompt Button
- A/B Test Button
- Evaluate Button
- Export Button

**Styling**:
- Background: #FFFFFF (Light) / #0F172A (Dark)
- Border: 1px #E5E7EB
- Border Radius: 12px
- Padding: 16px
- Height: calc(100vh - 120px)
- Overflow: Auto with custom scrollbar

### 4. History Sidebar
**Sections**:
- Tabs: History | Projects | Templates | Recent
- Search bar (Full width)
- List items (Scrollable)
- Clear history button (Bottom)

**Item Styling**:
- Padding: 12px
- Border Radius: 8px
- Hover: Background #F8F9FB
- Active: Background #F0F2FF, Text #5B5FFF

### 5. Share Modal
**Layout**: Centered modal

**Components**:
- Title: "Share Prompt"
- Share link (Copyable)
- Copy button
- QR code (Optional)
- Close button (Top right)

**Styling**:
- Width: 90vw, max 500px
- Padding: 24px
- Border Radius: 12px

### 6. A/B Test Workspace
**Layout**: 2-column comparison

**Components**:
- Variant A (Left): Input + Output
- Variant B (Right): Input + Output
- Evaluation criteria (Top)
- Results (Bottom)
- Winner indicator

### 7. Settings/API Keys Modal
**Layout**: Form-based

**Sections**:
- API Key inputs (Masked)
- Provider selection
- Test connection button
- Save button

### 8. Template Gallery
**Layout**: Grid (3 columns desktop, 1 mobile)

**Components**:
- Template cards
- Preview
- Install button
- Rating display
- Author info

---

## 🎬 Animations & Transitions

### Timing
- **Fast**: 150ms (UI interactions)
- **Normal**: 200ms (Page transitions)
- **Slow**: 300ms (Complex animations)

### Easing
- **Default**: cubic-bezier(0.4, 0, 0.2, 1)
- **Ease-in**: cubic-bezier(0.4, 0, 1, 1)
- **Ease-out**: cubic-bezier(0, 0, 0.2, 1)

### Common Animations
- **Fade In**: opacity 0 → 1 (150ms)
- **Slide In**: translateY 10px → 0 (150ms)
- **Scale In**: scale 0.95 → 1 (150ms)
- **Button Hover**: translateY -2px (200ms)
- **Modal Open**: scale 0.95 → 1, opacity 0 → 1 (200ms)

### Reduced Motion
- Respect `prefers-reduced-motion`
- Disable animations for users with motion sensitivity

---

## 📐 Responsive Breakpoints

```
Mobile: 0px - 640px
Tablet: 641px - 1024px
Desktop: 1025px - 1920px
Large Desktop: 1921px+
```

### Layout Changes
- **Mobile**: Single column, full-width
- **Tablet**: 2 columns (Input + Output stacked)
- **Desktop**: 3 columns (Input + Output + Sidebar)
- **Large**: Same as desktop with wider max-width

---

## 🌓 Dark Mode

### Implementation
- CSS variables for colors
- `prefers-color-scheme` media query
- Manual toggle in header
- Persist preference in localStorage

### Dark Mode Colors
- Background: #0F172A
- Surface: #1E293B
- Elevated: #1E293B
- Border: #334155
- Text Primary: #F1F5F9
- Text Secondary: #CBD5E1

---

## ♿ Accessibility Features

### WCAG AA Compliance
- Minimum contrast ratio: 4.5:1 for text
- Focus indicators: 2px ring with offset
- Keyboard navigation: Tab, Enter, Escape
- Screen reader support: ARIA labels

### Focus Management
- Visible focus ring on all interactive elements
- Focus trap in modals
- Focus restoration on close

### Keyboard Shortcuts
- Ctrl+E: Enhance prompt
- Ctrl+S: Save project
- Ctrl+K: Focus input
- Escape: Close modals
- Tab: Navigate elements

---

## 🎯 Icon System

### Icon Library
- **Lucide React** (263 icons)
- Size: 16px, 20px, 24px, 32px
- Color: Inherit from text color
- Stroke width: 2px

### Common Icons
- Terminal: Logo
- Sparkles: Enhancement
- Save: Save project
- Share: Share prompt
- Copy: Copy text
- Trash: Delete
- Settings: Settings
- Menu: Mobile menu
- X: Close
- ChevronDown: Dropdown

---

## 📊 Data Visualization

### Charts
- **Library**: Recharts or Chart.js
- **Colors**: Use semantic colors
- **Responsive**: Adapt to container width

### Tables
- **Header**: Bold, background #F8F9FB
- **Rows**: Alternating background (optional)
- **Hover**: Background highlight
- **Sorting**: Clickable headers with indicators

---

## 🔔 Notifications

### Toast Notifications
- **Position**: Bottom right
- **Duration**: 3-5 seconds
- **Types**: Success (green), Error (red), Info (blue), Warning (amber)
- **Animation**: Slide in from bottom

### Modal Alerts
- **Overlay**: Semi-transparent dark
- **Position**: Center screen
- **Buttons**: Confirm, Cancel

---

## 📋 Form Design

### Form Layout
- **Vertical stacking**: Labels above inputs
- **Spacing**: 16px between fields
- **Label**: 12px, Medium, above input
- **Helper text**: 12px, Secondary color, below input
- **Error message**: 12px, Error color, below input

### Validation
- Real-time validation (optional)
- Error state: Red border + error message
- Success state: Green checkmark (optional)

---

## 🖼️ Image & Media

### Image Handling
- **Format**: WebP with PNG fallback
- **Optimization**: Lazy loading
- **Responsive**: srcset for different sizes
- **Aspect Ratio**: Maintain consistent ratios

### Video
- **Format**: MP4, WebM
- **Controls**: Standard HTML5 controls
- **Autoplay**: Muted only
- **Responsive**: Embed with aspect ratio container

---

## 📱 Mobile-First Design

### Touch Targets
- **Minimum size**: 44px × 44px
- **Spacing**: 8px between targets
- **Feedback**: Visual + haptic (if available)

### Mobile Navigation
- **Bottom navigation** (Optional): For main sections
- **Hamburger menu**: For secondary options
- **Slide-out sidebar**: For history/templates

### Mobile Optimizations
- **Font sizes**: Slightly larger (16px minimum)
- **Spacing**: Increased padding
- **Buttons**: Full-width or larger
- **Modals**: Full-screen or near full-screen

---

## 🎨 Design Tokens (CSS Variables)

```css
/* Colors */
--color-primary: #5B5FFF;
--color-primary-hover: #4F52E8;
--color-primary-light: #F0F2FF;
--color-success: #10B981;
--color-error: #EF4444;
--color-warning: #F59E0B;

/* Typography */
--font-family-base: Inter, system-ui, sans-serif;
--font-family-mono: Monaco, monospace;
--font-size-h1: 28px;
--font-size-body: 14px;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;

/* Border Radius */
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);

/* Transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🎯 Component Library (Atomic Design)

### Atoms
- Button
- Input
- Label
- Icon
- Badge
- Spinner

### Molecules
- Input Group (Label + Input + Helper)
- Button Group
- Card
- Toast
- Dropdown

### Organisms
- Header
- Sidebar
- Modal
- Form
- Table
- Chart

### Templates
- Dashboard Layout
- Settings Page
- Modal Page
- Error Page

---

## 📐 Grid System

### Desktop Grid
- **Columns**: 12
- **Gutter**: 16px
- **Max Width**: 1920px
- **Margin**: Auto (centered)

### Breakpoint Columns
- **Mobile**: 4 columns
- **Tablet**: 8 columns
- **Desktop**: 12 columns

---

## 🎬 Page Transitions

### Navigation
- **Fade**: Opacity transition (150ms)
- **Slide**: Horizontal slide (200ms)
- **Scale**: Scale + fade (200ms)

### Loading States
- **Skeleton**: Placeholder shimmer
- **Spinner**: Rotating icon
- **Progress**: Linear progress bar

---

## 🔐 Security & Privacy Indicators

### Visual Indicators
- **Encrypted**: Lock icon
- **Synced**: Cloud icon with checkmark
- **Offline**: Offline indicator badge
- **Error**: Error icon with message

---

## 📊 Data Display

### Lists
- **Item height**: 44px minimum
- **Padding**: 12px
- **Hover**: Background highlight
- **Selection**: Checkbox or highlight

### Grids
- **Gap**: 16px
- **Responsive**: 1-4 columns
- **Card size**: Consistent aspect ratio

---

## 🎨 Stitch Design Specifications

### For Google Stitch Import
1. **Export format**: Figma design file
2. **Component library**: Organized by atomic design
3. **Design tokens**: CSS variables defined
4. **Responsive**: Breakpoints defined
5. **Interactions**: Hover, focus, active states
6. **Animations**: Transition timings specified
7. **Accessibility**: WCAG AA compliant
8. **Dark mode**: Separate color set

### Stitch Integration Steps
1. Create Figma design with all components
2. Export to Stitch format
3. Define component properties
4. Set up responsive variants
5. Create interaction states
6. Generate code from Stitch
7. Integrate with React components

---

## 📝 Design Handoff Checklist

- [ ] Color palette defined
- [ ] Typography system complete
- [ ] Spacing system documented
- [ ] Component library created
- [ ] Responsive breakpoints set
- [ ] Dark mode colors defined
- [ ] Animations specified
- [ ] Accessibility guidelines met
- [ ] Icons selected and sized
- [ ] Design tokens created
- [ ] Figma file organized
- [ ] Stitch export ready

---

**Last Updated**: December 2024
**Version**: 2.1.0
**Status**: Ready for Stitch redesign
