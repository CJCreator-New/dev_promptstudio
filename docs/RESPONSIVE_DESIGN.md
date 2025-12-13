# Responsive Design System

## Overview

A comprehensive mobile-first responsive design system with adaptive components, fluid typography, and device-aware interactions.

## Core Principles

1. **Mobile-First**: Design for smallest screens first, enhance for larger
2. **Context-Aware**: Adapt to device capabilities, not just screen size
3. **Performance**: Optimize for touch, reduce motion when needed
4. **Accessibility**: Maintain WCAG compliance across all breakpoints

## Breakpoint System

```typescript
const breakpoints = {
  xs: 320,   // Small phones
  sm: 640,   // Large phones
  md: 768,   // Tablets
  lg: 1024,  // Laptops
  xl: 1280,  // Desktops
  '2xl': 1536 // Large displays
};
```

### Usage

```tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

const Component = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
};
```

## Layout Components

### Grid

Responsive grid with mobile-first column definitions:

```tsx
<Grid 
  cols={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  gap={{ xs: 4, md: 6, lg: 8 }}
>
  <Card />
  <Card />
  <Card />
</Grid>
```

### Container

Centered container with responsive padding:

```tsx
<Container maxWidth="xl" padding>
  <Content />
</Container>
```

### Stack

Flexible stack with responsive direction:

```tsx
<Stack 
  responsive={{ xs: 'col', md: 'row' }}
  gap={4}
  align="center"
>
  <Item />
  <Item />
</Stack>
```

## Responsive Typography

Fluid typography that scales with viewport:

```css
/* Automatically scales between min and max */
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
```

### Usage

```tsx
<h1 className="text-responsive-4xl">Heading</h1>
<p className="text-responsive-base">Body text</p>
```

### Touch Device Optimization

```css
@media (hover: none) and (pointer: coarse) {
  :root {
    --text-base: clamp(1rem, 0.95rem + 0.5vw, 1.125rem);
  }
  
  body {
    -webkit-text-size-adjust: 100%;
  }
}
```

## Responsive Images

### Basic Responsive Image

```tsx
<ResponsiveImage
  src="/image.jpg"
  srcSet="/image-sm.jpg 640w, /image-md.jpg 1024w, /image-lg.jpg 1920w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Description"
  aspectRatio="16/9"
  loading="lazy"
/>
```

### Art Direction with Picture

```tsx
<Picture
  sources={[
    { srcSet: '/mobile.jpg', media: '(max-width: 640px)' },
    { srcSet: '/tablet.jpg', media: '(max-width: 1024px)' },
    { srcSet: '/desktop.jpg' }
  ]}
  fallback="/desktop.jpg"
  alt="Description"
/>
```

## Touch Interactions

### Touch Target

Ensures minimum 44x44px touch targets:

```tsx
<TouchTarget onTap={handleTap} minSize={44}>
  <Icon />
</TouchTarget>
```

### Swipeable

Gesture-based interactions:

```tsx
<Swipeable
  onSwipeLeft={handleNext}
  onSwipeRight={handlePrev}
  threshold={50}
>
  <Content />
</Swipeable>
```

## Device Capability Detection

```tsx
import { useDeviceCapabilities } from '@/hooks/useBreakpoint';

const Component = () => {
  const { hasTouch, hasMouse, isRetina, prefersReducedMotion } = useDeviceCapabilities();
  
  return (
    <button className={hasTouch ? 'touch-optimized' : 'mouse-optimized'}>
      Click me
    </button>
  );
};
```

## Responsive Data Visualization

```tsx
<ResponsiveChart
  data={chartData}
  renderChart={(container, data, config) => {
    // config.width, config.height adapt to screen
    // config.showLabels false on mobile
    // config.interactive false on mobile
  }}
/>
```

## Responsive Tables

Transforms to cards on mobile:

```tsx
<ResponsiveTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', hideOnMobile: true },
    { key: 'status', label: 'Status' }
  ]}
  data={users}
  keyField="id"
/>
```

## Adaptive Component Styles

Components that adapt to device capabilities:

```css
/* Touch devices - larger targets */
@media (hover: none) and (pointer: coarse) {
  .adaptive-button {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Mouse devices - hover effects */
@media (hover: hover) and (pointer: fine) {
  .adaptive-button:hover {
    transform: translateY(-1px);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Print Optimization

```css
@media print {
  /* Hide interactive elements */
  button, nav, aside { display: none !important; }
  
  /* Optimize typography */
  body { font-size: 12pt; line-height: 1.5; }
  
  /* Prevent breaks */
  h1, h2, h3 { page-break-after: avoid; }
  
  /* Show URLs */
  a[href]:after { content: " (" attr(href) ")"; }
}
```

## Testing Methodology

### 1. Breakpoint Testing

```bash
# Test all breakpoints
npm run test:responsive

# Visual regression
npm run test:visual
```

### 2. Device Testing

**Physical Devices:**
- iPhone SE (320px)
- iPhone 12 (390px)
- iPad (768px)
- Desktop (1920px)

**Browser DevTools:**
- Chrome DevTools Device Mode
- Firefox Responsive Design Mode
- Safari Responsive Design Mode

### 3. Capability Testing

```tsx
// Test touch interactions
describe('Touch Interactions', () => {
  it('handles swipe gestures', () => {
    const { container } = render(<Swipeable onSwipeLeft={mockFn} />);
    fireEvent.touchStart(container, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(container, { changedTouches: [{ clientX: 0 }] });
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### 4. Performance Testing

```tsx
// Measure responsive performance
import { measurePerformance } from '@/utils/performance';

measurePerformance('responsive-render', () => {
  render(<ResponsiveComponent />);
});
```

## Best Practices

### 1. Mobile-First CSS

```css
/* Base (mobile) */
.component { padding: 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .component { padding: 1.5rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .component { padding: 2rem; }
}
```

### 2. Touch-Friendly Targets

```tsx
// ✅ Good - 44x44px minimum
<button className="min-w-[44px] min-h-[44px]">Click</button>

// ❌ Bad - too small
<button className="w-8 h-8">Click</button>
```

### 3. Fluid Typography

```css
/* ✅ Good - scales smoothly */
font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);

/* ❌ Bad - jumps at breakpoints */
font-size: 1rem;
@media (min-width: 768px) { font-size: 1.125rem; }
```

### 4. Responsive Images

```tsx
// ✅ Good - multiple sources
<ResponsiveImage
  srcSet="small.jpg 640w, medium.jpg 1024w, large.jpg 1920w"
  sizes="(max-width: 640px) 100vw, 50vw"
/>

// ❌ Bad - single large image
<img src="large.jpg" />
```

### 5. Context-Aware Components

```tsx
// ✅ Good - adapts to capabilities
const Button = () => {
  const { hasTouch } = useDeviceCapabilities();
  return (
    <button className={hasTouch ? 'touch-optimized' : 'mouse-optimized'}>
      Click
    </button>
  );
};

// ❌ Bad - assumes mouse
const Button = () => <button className="hover:bg-blue-500">Click</button>;
```

## Performance Considerations

### 1. Lazy Load Images

```tsx
<ResponsiveImage loading="lazy" />
```

### 2. Reduce Motion

```tsx
const { prefersReducedMotion } = useDeviceCapabilities();
const animation = prefersReducedMotion ? 'none' : 'slide-in';
```

### 3. Optimize Touch Events

```tsx
// Use passive listeners
element.addEventListener('touchstart', handler, { passive: true });
```

### 4. Debounce Resize

```tsx
const handleResize = useMemo(
  () => debounce(() => setDimensions(getSize()), 150),
  []
);
```

## Common Patterns

### Responsive Navigation

```tsx
const Navigation = () => {
  const { isMobile } = useBreakpoint();
  
  return isMobile ? <MobileNav /> : <DesktopNav />;
};
```

### Responsive Modal

```tsx
const Modal = ({ children }) => {
  const { isMobile } = useBreakpoint();
  
  return (
    <div className={isMobile ? 'fixed inset-0' : 'fixed inset-4 max-w-2xl mx-auto'}>
      {children}
    </div>
  );
};
```

### Responsive Form

```tsx
<Stack responsive={{ xs: 'col', md: 'row' }} gap={4}>
  <Input label="First Name" />
  <Input label="Last Name" />
</Stack>
```

## Resources

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Images](https://web.dev/responsive-images/)
- [A11y Touch Targets](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [CSS Tricks Fluid Typography](https://css-tricks.com/snippets/css/fluid-typography/)
