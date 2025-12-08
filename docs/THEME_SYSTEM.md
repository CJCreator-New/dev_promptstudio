# Theme System Documentation

Complete dark mode system with smooth transitions, system preference detection, and WCAG AA compliance.

## 🎨 Overview

The theme system uses CSS variables for instant theme switching without flash of incorrect theme. Supports light mode, dark mode, and system preference.

## 🚀 Quick Start

### 1. Wrap App with ThemeProvider

```tsx
import { ThemeProvider } from './hooks/useTheme';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Add Theme Toggle

```tsx
import { ThemeToggle, ThemeToggleCompact } from './components/ThemeToggle';

// Full toggle with all options
<ThemeToggle />

// Compact toggle (light/dark only)
<ThemeToggleCompact />
```

### 3. Use Theme in Components

```tsx
import { useTheme } from './hooks/useTheme';

function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

## 🎨 CSS Variables

### Using Theme Variables

```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.my-button {
  background-color: var(--brand-primary);
  color: var(--text-inverse);
}

.my-button:hover {
  background-color: var(--brand-primary-hover);
}
```

### Available Variables

#### Background Colors
```css
--bg-primary        /* Main background */
--bg-secondary      /* Secondary background */
--bg-tertiary       /* Tertiary background */
--bg-elevated       /* Elevated surfaces (modals, dropdowns) */
--bg-overlay        /* Overlay backgrounds */
```

#### Surface Colors
```css
--surface-primary   /* Primary surface (cards, panels) */
--surface-secondary /* Secondary surface */
--surface-tertiary  /* Tertiary surface */
--surface-hover     /* Hover state */
--surface-active    /* Active/pressed state */
```

#### Text Colors
```css
--text-primary      /* Primary text (headings, body) */
--text-secondary    /* Secondary text (labels, captions) */
--text-tertiary     /* Tertiary text (hints, placeholders) */
--text-disabled     /* Disabled text */
--text-inverse      /* Inverse text (on dark backgrounds) */
```

#### Border Colors
```css
--border-primary    /* Primary borders */
--border-secondary  /* Secondary borders */
--border-tertiary   /* Tertiary borders */
--border-focus      /* Focus ring color */
```

#### Brand Colors
```css
--brand-primary         /* Primary brand color */
--brand-primary-hover   /* Hover state */
--brand-primary-active  /* Active state */
--brand-secondary       /* Secondary brand color */
```

#### Semantic Colors
```css
--success           /* Success color */
--success-bg        /* Success background */
--warning           /* Warning color */
--warning-bg        /* Warning background */
--error             /* Error color */
--error-bg          /* Error background */
--info              /* Info color */
--info-bg           /* Info background */
```

#### Shadows
```css
--shadow-sm         /* Small shadow */
--shadow-md         /* Medium shadow */
--shadow-lg         /* Large shadow */
--shadow-xl         /* Extra large shadow */
```

#### Focus & Effects
```css
--focus-ring        /* Focus ring shadow */
--image-brightness  /* Image brightness filter */
--image-contrast    /* Image contrast filter */
--icon-opacity      /* Icon opacity */
```

## 🎯 Component Patterns

### Button with Theme Variables

```tsx
<button className="
  px-4 py-2 rounded-lg
  bg-[var(--brand-primary)]
  hover:bg-[var(--brand-primary-hover)]
  active:bg-[var(--brand-primary-active)]
  text-[var(--text-inverse)]
  border border-[var(--border-primary)]
  shadow-[var(--shadow-sm)]
  focus:shadow-[var(--focus-ring)]
  transition-all duration-200
">
  Click Me
</button>
```

### Card with Theme Variables

```tsx
<div className="
  p-6 rounded-xl
  bg-[var(--surface-primary)]
  border border-[var(--border-primary)]
  shadow-[var(--shadow-md)]
">
  <h3 className="text-[var(--text-primary)] font-semibold mb-2">
    Card Title
  </h3>
  <p className="text-[var(--text-secondary)]">
    Card content goes here
  </p>
</div>
```

### Input with Theme Variables

```tsx
<input className="
  w-full px-4 py-2 rounded-lg
  bg-[var(--bg-secondary)]
  text-[var(--text-primary)]
  border border-[var(--border-primary)]
  placeholder:text-[var(--text-tertiary)]
  focus:border-[var(--border-focus)]
  focus:shadow-[var(--focus-ring)]
  transition-all duration-200
" />
```

## 🖼️ Images & Icons

### Images

Images are automatically adjusted in dark mode:

```tsx
// Auto-adjusted
<img src="photo.jpg" alt="Photo" />

// Prevent adjustment
<img src="logo.svg" alt="Logo" data-theme-ignore />
```

### SVG Icons

Icons are automatically adjusted for visibility:

```tsx
// Auto-adjusted
<svg>...</svg>

// Prevent adjustment
<svg data-theme-ignore>...</svg>
```

### Custom Image Handling

```css
/* Custom dark mode image filter */
[data-theme="dark"] .my-image {
  filter: brightness(0.85) contrast(1.15);
}

/* Invert logos in dark mode */
[data-theme="dark"] .logo {
  filter: invert(1);
}
```

## ♿ Accessibility

### Contrast Ratios

All color combinations meet WCAG AA standards:

**Light Mode:**
- Text on background: 7:1 (AAA)
- Secondary text: 4.5:1 (AA)
- Tertiary text: 4.5:1 (AA)

**Dark Mode:**
- Text on background: 7:1 (AAA)
- Secondary text: 4.5:1 (AA)
- Tertiary text: 4.5:1 (AA)

### Focus States

All interactive elements have visible focus indicators:

```css
:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

### System Preference

Respects user's system preference by default:

```tsx
// Automatically uses system preference
const { theme } = useTheme(); // 'system' by default
```

## 🔧 Advanced Usage

### Conditional Rendering

```tsx
const { resolvedTheme } = useTheme();

return (
  <>
    {resolvedTheme === 'dark' ? (
      <DarkModeComponent />
    ) : (
      <LightModeComponent />
    )}
  </>
);
```

### Theme-Specific Styles

```tsx
const { resolvedTheme } = useTheme();

return (
  <div className={resolvedTheme === 'dark' ? 'dark-specific' : 'light-specific'}>
    Content
  </div>
);
```

### Listen to Theme Changes

```tsx
const { resolvedTheme } = useTheme();

useEffect(() => {
  console.log('Theme changed to:', resolvedTheme);
  // Perform theme-specific actions
}, [resolvedTheme]);
```

## 🚫 Preventing Flash of Incorrect Theme

### In index.html

Add this script in `<head>` before any content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0f172a">
  
  <!-- Theme script - prevents flash -->
  <script>
    (function() {
      const STORAGE_KEY = 'devprompt-theme';
      
      function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      function applyTheme(theme) {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        document.documentElement.setAttribute('data-theme', resolved);
        
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
          metaTheme.setAttribute('content', resolved === 'dark' ? '#0f172a' : '#ffffff');
        }
      }
      
      const stored = localStorage.getItem(STORAGE_KEY) || 'system';
      applyTheme(stored);
    })();
  </script>
  
  <title>DevPrompt Studio</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

## 🎨 Design Guidelines

### For Designers

#### Color Selection
1. **Start with base colors**: Define light and dark base colors
2. **Test contrast**: Use tools like WebAIM Contrast Checker
3. **Create semantic colors**: Success, warning, error, info
4. **Test both modes**: Ensure all colors work in both themes

#### Component Design
1. **Design in both modes**: Create designs for light and dark
2. **Use variables**: Reference CSS variables in design tools
3. **Test readability**: Ensure text is readable in both modes
4. **Consider images**: Plan for image adjustments

### For Developers

#### Adding New Colors
1. Add to both light and dark themes in `theme.css`
2. Use semantic naming (e.g., `--surface-primary` not `--gray-100`)
3. Test contrast ratios
4. Document usage

```css
/* Add to :root (light mode) */
:root {
  --my-new-color: #value;
}

/* Add to [data-theme="dark"] */
[data-theme="dark"] {
  --my-new-color: #value;
}
```

#### Component Checklist
- [ ] Uses CSS variables for all colors
- [ ] Transitions smoothly between themes
- [ ] Focus states visible in both modes
- [ ] Text meets contrast requirements
- [ ] Images/icons adjusted if needed
- [ ] Tested in both light and dark modes

## 🧪 Testing

### Manual Testing

1. **Toggle themes**: Test all three modes (light, dark, system)
2. **Check contrast**: Verify all text is readable
3. **Test focus states**: Tab through interactive elements
4. **Check images**: Ensure images look good in both modes
5. **Test transitions**: Verify smooth theme switching

### Automated Testing

```tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './hooks/useTheme';

test('renders in dark mode', () => {
  localStorage.setItem('devprompt-theme', 'dark');
  
  render(
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
  
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers

## 📊 Performance

- **CSS Variables**: Instant theme switching
- **No re-renders**: Theme changes don't cause React re-renders
- **Optimized transitions**: 200ms for smooth feel
- **No flash**: Inline script prevents incorrect theme flash

## 🔄 Migration Guide

### From Tailwind Classes

```tsx
// Before
<div className="bg-slate-900 text-white border-slate-700">

// After
<div className="bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)]">
```

### From Inline Styles

```tsx
// Before
<div style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>

// After
<div className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
```

## 🎯 Best Practices

1. **Always use CSS variables** for colors
2. **Test both themes** during development
3. **Use semantic names** for variables
4. **Respect system preference** by default
5. **Provide theme toggle** in accessible location
6. **Document theme-specific behavior**
7. **Test with real users** in both modes

## 🐛 Troubleshooting

### Flash of incorrect theme
- Ensure inline script is in `<head>`
- Check localStorage key matches

### Colors not changing
- Verify CSS variables are used
- Check `data-theme` attribute is set
- Ensure theme.css is imported

### Images too dark/bright
- Add `data-theme-ignore` attribute
- Adjust filter values in theme.css

### Focus states not visible
- Check `--focus-ring` variable
- Verify `:focus-visible` styles

## 📚 Resources

- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
