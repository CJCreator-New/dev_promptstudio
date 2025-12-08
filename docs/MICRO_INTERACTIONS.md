# Micro-Interactions System

A comprehensive system of performant animations and interactions, all under 400ms for optimal UX.

## 🎯 Design Principles

1. **Performance First**: All animations < 400ms
2. **Meaningful Motion**: Reinforce user actions, not decorative
3. **Consistent Feel**: Cohesive animation language
4. **Accessible**: Respects `prefers-reduced-motion`
5. **Contextual**: Animations maintain user context

## 📦 Components

### Button States

```tsx
import { Button } from './components/ui/Button';

<Button variant="primary" loading={isLoading} success={isSuccess}>
  Save Changes
</Button>
```

**States:**
- Hover: Subtle lift + shadow (200ms)
- Active: Scale down to 0.96 (200ms)
- Loading: Spinner animation
- Success: Scale pulse + checkmark (300ms)
- Disabled: Reduced opacity

**Variants:** `primary` | `secondary` | `ghost` | `danger`

---

### Form Field Interactions

```tsx
import { AnimatedInput, AnimatedTextarea } from './components/ui/AnimatedInput';

<AnimatedInput
  label="Email"
  value={email}
  onChange={setEmail}
  error={emailError}
  success={isValid}
  helperText="We'll never share your email"
/>
```

**Features:**
- Focus ring animation (200ms)
- Error shake animation (300ms)
- Success checkmark (250ms)
- Real-time character count
- Label color transition

---

### Progress Indicators

```tsx
import { ProgressBar, Spinner, DotsLoader } from './components/ui/ProgressIndicator';

// Determinate progress
<ProgressBar value={75} max={100} variant="success" showLabel />

// Indeterminate progress
<ProgressBar indeterminate />

// Spinner
<Spinner size="md" />

// Dots loader
<DotsLoader size="md" />
```

**Variants:** `default` | `success` | `warning` | `danger`

---

### Skeleton Screens

```tsx
import { Skeleton, SkeletonCard, SkeletonList, SkeletonText } from './components/ui/SkeletonLoader';

// Basic skeleton
<Skeleton variant="text" width="60%" />

// Pre-built layouts
<SkeletonCard />
<SkeletonList count={5} />
<SkeletonText lines={3} />
```

**Variants:** `text` | `circular` | `rectangular`

---

### Interactive Cards

```tsx
import { InteractiveCard, InteractiveListItem } from './components/ui/InteractiveCard';

<InteractiveCard
  hoverable
  pressable
  selected={isSelected}
  onClick={handleClick}
>
  <h3>Card Title</h3>
  <p>Card content...</p>
</InteractiveCard>

<InteractiveListItem
  active={isActive}
  onClick={handleClick}
  onDelete={handleDelete}
>
  List item content
</InteractiveListItem>
```

**Features:**
- Hover lift (-2px, 200ms)
- Press scale (0.98, 150ms)
- Selection ring
- Delete action on hover

---

### Page Transitions

```tsx
import { PageTransition, StaggeredList, ScrollReveal } from './components/ui/PageTransition';

// Single element
<PageTransition type="fade" duration={300}>
  <Content />
</PageTransition>

// Staggered list
<StaggeredList staggerDelay={50}>
  {items.map(item => <Item key={item.id} {...item} />)}
</StaggeredList>

// Scroll reveal
<ScrollReveal threshold={0.1}>
  <Section />
</ScrollReveal>
```

**Types:** `fade` | `slide-up` | `slide-down` | `scale`

---

### Toast Notifications

```tsx
import { useToast, ToastProvider } from './hooks/useToast';

// Wrap app
<ToastProvider>
  <App />
</ToastProvider>

// Use in components
const { showToast } = useToast();

showToast('success', 'Changes saved!');
showToast('error', 'Failed to save');
showToast('warning', 'Storage almost full');
showToast('info', 'New update available');
```

**Features:**
- Slide-in animation (300ms)
- Auto-dismiss (configurable)
- Manual close
- Stacked notifications
- 4 variants

---

## 🎨 Animation Timings

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button hover | 200ms | ease-out |
| Button press | 200ms | ease-out |
| Field focus | 200ms | ease-out |
| Error shake | 300ms | ease-out |
| Success check | 250ms | ease-out |
| Toast slide | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Card lift | 200ms | ease-out |
| Page fade | 200ms | ease-out |
| Skeleton shimmer | 1500ms | ease-in-out |

---

## 🎯 Usage Examples

### Complete Form with Feedback

```tsx
import { AnimatedInput } from './components/ui/AnimatedInput';
import { Button } from './components/ui/Button';
import { useToast } from './hooks/useToast';

const MyForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitForm({ email });
      setSuccess(true);
      showToast('success', 'Form submitted successfully!');
    } catch (error) {
      showToast('error', 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <AnimatedInput
        label="Email"
        value={email}
        onChange={setEmail}
        success={success}
      />
      <Button
        variant="primary"
        loading={loading}
        success={success}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
};
```

### Loading States

```tsx
import { SkeletonCard } from './components/ui/SkeletonLoader';
import { PageTransition } from './components/ui/PageTransition';

const DataView = () => {
  const { data, loading } = useData();

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <PageTransition type="fade">
      <Card data={data} />
    </PageTransition>
  );
};
```

### Interactive List

```tsx
import { InteractiveListItem } from './components/ui/InteractiveCard';
import { StaggeredList } from './components/ui/PageTransition';

const ItemList = ({ items }) => {
  return (
    <StaggeredList staggerDelay={50}>
      {items.map(item => (
        <InteractiveListItem
          key={item.id}
          active={item.id === activeId}
          onClick={() => handleSelect(item.id)}
          onDelete={() => handleDelete(item.id)}
        >
          {item.name}
        </InteractiveListItem>
      ))}
    </StaggeredList>
  );
};
```

---

## 🎨 CSS Classes

### Utility Classes

```css
/* Button animations */
.animate-button-press      /* 200ms press animation */
.animate-button-success    /* 300ms success pulse */

/* Field animations */
.animate-field-focus       /* 200ms focus ring */
.animate-field-error       /* 300ms shake */
.animate-field-success     /* 250ms checkmark */

/* Toast animations */
.animate-toast-in          /* 300ms slide in */
.animate-toast-out         /* 250ms slide out */

/* General animations */
.animate-fade-in           /* 200ms fade */
.animate-slide-up          /* 300ms slide up */
.animate-slide-down        /* 300ms slide down */
.animate-spin              /* 1s infinite spin */
.animate-pulse             /* 2s infinite pulse */

/* Interactive states */
.interactive-scale         /* Hover scale 1.02 */
.interactive-lift          /* Hover lift -2px */

/* Skeleton */
.skeleton                  /* Shimmer animation */
```

---

## ♿ Accessibility

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Features:**
- ARIA labels on all interactive elements
- Focus indicators
- Screen reader announcements
- Keyboard navigation support

---

## 🚀 Performance

### Optimization Techniques

1. **Hardware Acceleration**: Use `transform` and `opacity`
2. **Will-Change**: Applied to animated elements
3. **Debouncing**: Scroll and resize events
4. **Lazy Loading**: Components loaded on demand
5. **CSS Animations**: Prefer CSS over JS

### Performance Metrics

- All animations < 400ms
- 60fps target
- No layout thrashing
- Minimal repaints

---

## 📱 Mobile Optimization

- Touch-friendly targets (44x44px minimum)
- Reduced motion on mobile
- Optimized for touch gestures
- Responsive animations

---

## 🎨 Customization

### Custom Animation Timing

```tsx
<PageTransition type="fade" duration={500} delay={100}>
  <Content />
</PageTransition>
```

### Custom Toast Duration

```tsx
showToast('success', 'Saved!', 5000); // 5 seconds
```

### Custom Progress Variant

```tsx
<ProgressBar value={75} variant="success" />
```

---

## 🧪 Testing

### Visual Regression Testing

```bash
npm run test:visual
```

### Animation Testing

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('button shows loading state', () => {
  render(<Button loading>Save</Button>);
  expect(screen.getByRole('button')).toHaveClass('animate-spin');
});
```

---

## 📚 Best Practices

1. **Use Semantic Animations**: Match animation to action
2. **Keep It Subtle**: Don't distract from content
3. **Maintain Context**: Preserve user's mental model
4. **Test Performance**: Monitor frame rates
5. **Respect Preferences**: Honor reduced motion
6. **Progressive Enhancement**: Work without animations

---

## 🔄 Migration Guide

### From Static to Animated

```tsx
// Before
<button onClick={handleClick}>Save</button>

// After
<Button variant="primary" loading={loading} success={success}>
  Save
</Button>
```

### From Basic to Interactive

```tsx
// Before
<div className="card" onClick={handleClick}>
  Content
</div>

// After
<InteractiveCard hoverable pressable onClick={handleClick}>
  Content
</InteractiveCard>
```

---

## 🎯 Future Enhancements

- [ ] Gesture animations (swipe, pinch)
- [ ] Parallax effects
- [ ] Morphing transitions
- [ ] Physics-based animations
- [ ] Custom easing curves
- [ ] Animation presets library
