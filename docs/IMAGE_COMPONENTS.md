# Image Component Library

## Overview

Modular image component library with performance optimizations, accessibility, and responsive design.

## Components

### BaseImage

Foundation component with built-in optimizations.

```tsx
<BaseImage
  src="/image.jpg"
  alt="Description"
  srcSet="/sm.jpg 640w, /md.jpg 1024w, /lg.jpg 1920w"
  sizes="(max-width: 640px) 100vw, 50vw"
  loading="lazy"
  priority={false}
  onLoad={() => console.log('Loaded')}
/>
```

**Features:**
- Lazy loading by default
- Responsive with srcSet/sizes
- Loading state management
- Error handling with fallback
- Async decoding

### ArtDirectedImage

Different crops at different breakpoints.

```tsx
<ArtDirectedImage
  sources={[
    { srcSet: '/mobile.jpg', media: '(max-width: 640px)' },
    { srcSet: '/tablet.jpg', media: '(max-width: 1024px)' },
    { srcSet: '/desktop.jpg' }
  ]}
  fallbackSrc="/desktop.jpg"
  alt="Responsive image"
/>
```

**Use Cases:**
- Different aspect ratios per device
- Art direction (different crops)
- Format optimization (WebP, AVIF)

### HeroImage

Optimized for Core Web Vitals.

```tsx
<HeroImage
  src="/hero.jpg"
  alt="Hero image"
  srcSet="/hero-sm.jpg 640w, /hero-lg.jpg 1920w"
  priority={true}
  aspectRatio="16/9"
  overlay={true}
/>
```

**Features:**
- Priority loading (fetchPriority="high")
- Eager loading for above-fold
- Aspect ratio container
- Optional gradient overlay
- Optimized for LCP

### Gallery

Lazy loading with pagination.

```tsx
<Gallery
  images={[
    { id: '1', src: '/img1.jpg', alt: 'Image 1', thumbnail: '/thumb1.jpg' },
    { id: '2', src: '/img2.jpg', alt: 'Image 2' }
  ]}
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  gap={4}
  pageSize={12}
  onImageClick={(image) => console.log(image)}
/>
```

**Features:**
- Intersection Observer for lazy loading
- Pagination with "Load More"
- Responsive grid
- Thumbnail support
- Click handlers

### Avatar

Caching with fallback.

```tsx
<Avatar
  src="/user.jpg"
  alt="John Doe"
  size="md"
  fallback="/default-avatar.jpg"
  initials="JD"
/>
```

**Features:**
- In-memory caching
- Automatic fallback to initials
- Multiple sizes (sm, md, lg, xl)
- Circular by default
- Preloading

**Sizes:**
- `sm`: 32px (8rem)
- `md`: 48px (12rem)
- `lg`: 64px (16rem)
- `xl`: 96px (24rem)

### BackgroundImage

Efficient background loading.

```tsx
<BackgroundImage
  src="/background.jpg"
  alt="Background"
  overlay={true}
  parallax={true}
>
  <Content />
</BackgroundImage>
```

**Features:**
- CSS background-image
- Optional parallax effect
- Overlay support
- Loading placeholder
- Children support

### BlurUpImage

Progressive loading effect.

```tsx
<BlurUpImage
  src="/full-res.jpg"
  placeholder="/tiny-blur.jpg"
  alt="Progressive image"
  aspectRatio="16/9"
/>
```

**Features:**
- Tiny placeholder (blur-up)
- Smooth transition
- Aspect ratio container
- Optimized perceived performance

**Placeholder Generation:**
```bash
# Generate tiny placeholder (20px width)
convert input.jpg -resize 20x -quality 50 placeholder.jpg
```

### ImageComparison

Before/after slider.

```tsx
<ImageComparison
  beforeSrc="/before.jpg"
  afterSrc="/after.jpg"
  beforeAlt="Before"
  afterAlt="After"
  defaultPosition={50}
/>
```

**Features:**
- Drag to compare
- Touch support
- Keyboard accessible
- Labels
- Customizable position

## Performance Best Practices

### 1. Lazy Loading

```tsx
// ✅ Good - Lazy load below fold
<BaseImage src="/image.jpg" loading="lazy" />

// ❌ Bad - Eager load everything
<BaseImage src="/image.jpg" loading="eager" />
```

### 2. Priority Loading

```tsx
// ✅ Good - Priority for hero
<HeroImage src="/hero.jpg" priority={true} />

// ❌ Bad - Lazy load hero
<HeroImage src="/hero.jpg" loading="lazy" />
```

### 3. Responsive Images

```tsx
// ✅ Good - Multiple sizes
<BaseImage
  srcSet="/sm.jpg 640w, /md.jpg 1024w, /lg.jpg 1920w"
  sizes="(max-width: 640px) 100vw, 50vw"
/>

// ❌ Bad - Single large image
<BaseImage src="/large.jpg" />
```

### 4. Aspect Ratios

```tsx
// ✅ Good - Prevent layout shift
<HeroImage aspectRatio="16/9" />

// ❌ Bad - No aspect ratio
<img src="/image.jpg" />
```

### 5. Format Optimization

```tsx
// ✅ Good - Modern formats
<ArtDirectedImage
  sources={[
    { srcSet: '/image.avif', type: 'image/avif' },
    { srcSet: '/image.webp', type: 'image/webp' },
    { srcSet: '/image.jpg', type: 'image/jpeg' }
  ]}
/>
```

## Accessibility

### Alt Text

```tsx
// ✅ Good - Descriptive
<BaseImage src="/chart.jpg" alt="Sales chart showing 20% growth in Q4" />

// ❌ Bad - Generic
<BaseImage src="/chart.jpg" alt="Chart" />
```

### Decorative Images

```tsx
// ✅ Good - Empty alt for decorative
<BaseImage src="/decoration.jpg" alt="" />

// ❌ Bad - Missing alt
<BaseImage src="/decoration.jpg" />
```

### Background Images

```tsx
// ✅ Good - Provide alt via aria-label
<BackgroundImage src="/bg.jpg" alt="Mountain landscape" />
```

## Core Web Vitals Optimization

### LCP (Largest Contentful Paint)

```tsx
// Hero image - priority loading
<HeroImage
  src="/hero.jpg"
  priority={true}
  fetchPriority="high"
/>
```

### CLS (Cumulative Layout Shift)

```tsx
// Specify dimensions
<BaseImage
  src="/image.jpg"
  width={800}
  height={600}
/>

// Or use aspect ratio
<HeroImage aspectRatio="16/9" />
```

### FID (First Input Delay)

```tsx
// Lazy load below fold
<Gallery images={images} loading="lazy" />
```

## Usage Examples

### Hero Section

```tsx
<HeroImage
  src="/hero.jpg"
  srcSet="/hero-sm.jpg 640w, /hero-lg.jpg 1920w"
  alt="Welcome to our site"
  priority={true}
  aspectRatio="21/9"
  overlay={true}
/>
```

### Product Gallery

```tsx
<Gallery
  images={products.map(p => ({
    id: p.id,
    src: p.image,
    alt: p.name,
    thumbnail: p.thumbnail
  }))}
  columns={{ xs: 2, md: 3, lg: 4 }}
  onImageClick={(img) => openLightbox(img)}
/>
```

### User Profile

```tsx
<Avatar
  src={user.avatar}
  alt={user.name}
  size="lg"
  initials={user.initials}
/>
```

### Blog Post

```tsx
<BlurUpImage
  src="/blog-post.jpg"
  placeholder="/blog-post-tiny.jpg"
  alt="Blog post featured image"
  aspectRatio="16/9"
/>
```

### Before/After

```tsx
<ImageComparison
  beforeSrc="/before-renovation.jpg"
  afterSrc="/after-renovation.jpg"
  beforeAlt="Before renovation"
  afterAlt="After renovation"
/>
```

## Testing

```tsx
import { render, screen } from '@testing-library/react';
import { BaseImage } from './BaseImage';

test('renders image with alt text', () => {
  render(<BaseImage src="/test.jpg" alt="Test image" />);
  expect(screen.getByAltText('Test image')).toBeInTheDocument();
});

test('handles loading state', () => {
  const onLoad = jest.fn();
  render(<BaseImage src="/test.jpg" alt="Test" onLoad={onLoad} />);
  // Simulate load
  fireEvent.load(screen.getByAltText('Test'));
  expect(onLoad).toHaveBeenCalled();
});
```

## Resources

- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Core Web Vitals](https://web.dev/vitals/)
