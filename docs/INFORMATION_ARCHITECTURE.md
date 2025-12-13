# Information Architecture System

## Overview

Comprehensive IA system with site mapping, taxonomy, search, wayfinding, and validation methodologies.

## Site Mapping

### Structure

```typescript
interface SiteNode {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: SiteNode[];
  meta?: {
    description?: string;
    keywords?: string[];
    category?: string;
  };
}
```

### Usage

```tsx
import { sitemap, findNode, getPath } from '@/ia';

// Find node
const node = findNode('templates');

// Get breadcrumb path
const path = getPath('templates.gallery');
```

## Taxonomy System

### Categories & Tags

```tsx
const taxonomy = [
  {
    id: 'domain',
    label: 'Domain',
    tags: [
      { id: 'frontend', label: 'Frontend', category: 'domain', color: 'blue' },
      { id: 'backend', label: 'Backend', category: 'domain', color: 'green' }
    ]
  }
];
```

### Filtering

```tsx
import { filterByTags } from '@/ia';

const filtered = filterByTags(items, ['frontend', 'mobile']);
```

## Search Architecture

### Search Engine

```tsx
import { SearchEngine } from '@/ia';

const engine = new SearchEngine();
engine.setItems(items);

const results = engine.search('react', {
  tags: ['frontend'],
  category: 'tutorial',
  dateRange: { start: Date.now() - 86400000, end: Date.now() }
});
```

### Search Interface

```tsx
<SearchInterface
  items={items}
  onResultSelect={handleSelect}
  placeholder="Search prompts..."
  filters={filters}
/>
```

## Wayfinding

### Breadcrumb

```tsx
import { Breadcrumb, getPath } from '@/ia';

const path = getPath('templates.gallery');

<Breadcrumb 
  path={path}
  onNavigate={handleNavigate}
/>
```

## Progressive Disclosure

### Disclosure

```tsx
<Disclosure title="Advanced Options" defaultOpen={false}>
  <AdvancedSettings />
</Disclosure>
```

### Accordion

```tsx
<Accordion
  items={[
    { id: '1', title: 'Section 1', content: <Content1 /> },
    { id: '2', title: 'Section 2', content: <Content2 /> }
  ]}
  allowMultiple={false}
/>
```

## Related Content

```tsx
import { RelatedContent, findRelatedContent } from '@/ia';

const related = findRelatedContent(currentItem, allItems);

<RelatedContent
  items={related}
  onSelect={handleSelect}
  maxItems={5}
/>
```

## Contextual Help

```tsx
import { ContextualHelp, helpContent } from '@/ia';

<ContextualHelp
  content={helpContent.promptInput}
  position="top"
/>
```

## IA Patterns

### Hub and Spoke

```tsx
<HubAndSpoke
  hub={<Dashboard />}
  spokes={[<Feature1 />, <Feature2 />, <Feature3 />]}
/>
```

### Hierarchy

```tsx
<Hierarchy
  levels={[
    { title: 'Level 1', items: [<Item1 />, <Item2 />] },
    { title: 'Level 2', items: [<Item3 />, <Item4 />] }
  ]}
/>
```

### Faceted Navigation

```tsx
<Faceted
  filters={<FilterPanel />}
  results={<ResultsList />}
/>
```

### Sequential

```tsx
<Sequential
  steps={[
    { title: 'Step 1', content: <Step1 /> },
    { title: 'Step 2', content: <Step2 /> }
  ]}
  currentStep={0}
/>
```

## Validation Methodologies

### Card Sorting

```tsx
import { analyzeCardSorting } from '@/ia';

const results = analyzeCardSorting(sessions);

// Results include:
// - cardPlacements: where participants placed each card
// - agreementMatrix: how often cards were grouped together
// - suggestedCategories: recommended category structure
```

### Tree Testing

```tsx
import { analyzeTreeTest, calculateDirectness } from '@/ia';

const results = analyzeTreeTest(sessions);

// Results include:
// - taskSuccessRates: % of participants who completed each task
// - averageDirectness: efficiency of paths taken
// - averageTime: time spent on each task
// - problemPaths: frequently used incorrect paths
```

## Best Practices

### 1. Content Hierarchy

```
✅ Good - Clear hierarchy
Home
├── Prompts
│   ├── New Prompt
│   ├── History
│   └── Favorites
└── Templates
    ├── Gallery
    └── My Templates

❌ Bad - Flat structure
Home
Prompts
New Prompt
History
Favorites
Templates
Gallery
My Templates
```

### 2. Navigation Depth

```
✅ Good - 3 levels max
Home > Templates > Gallery

❌ Bad - Too deep
Home > Content > Templates > Categories > Frontend > Gallery
```

### 3. Taxonomy

```
✅ Good - Mutually exclusive categories
Domain: Frontend, Backend, Mobile
Status: Draft, Active, Archived

❌ Bad - Overlapping categories
Type: Frontend, React, Web, JavaScript
```

### 4. Search

```
✅ Good - Multiple search strategies
- Full-text search
- Tag filtering
- Category filtering
- Date range

❌ Bad - Single search method
- Only title search
```

## Testing Checklist

### Card Sorting
- [ ] 15-30 participants
- [ ] 30-50 cards
- [ ] Open or closed sort
- [ ] Analyze agreement matrix
- [ ] Identify problem cards

### Tree Testing
- [ ] 5-10 tasks per test
- [ ] 20-30 participants
- [ ] Measure success rate (>70%)
- [ ] Measure directness (>0.8)
- [ ] Identify problem paths

### Usability Testing
- [ ] Test navigation flow
- [ ] Test search functionality
- [ ] Test filter combinations
- [ ] Test breadcrumb navigation
- [ ] Test related content

## Common Patterns

### Search + Filter

```tsx
const [query, setQuery] = useState('');
const [filters, setFilters] = useState<SearchFilters>({});

<SearchInterface
  items={items}
  onResultSelect={handleSelect}
  filters={filters}
  onFiltersChange={setFilters}
/>
```

### Breadcrumb + Related

```tsx
<div>
  <Breadcrumb path={currentPath} onNavigate={navigate} />
  <MainContent />
  <RelatedContent items={related} onSelect={navigate} />
</div>
```

### Progressive Disclosure + Help

```tsx
<Disclosure title="Advanced Options">
  <AdvancedSettings />
  <ContextualHelp content={helpContent.advanced} />
</Disclosure>
```

## Resources

- [IA Institute](https://www.iainstitute.org/)
- [Nielsen Norman Group - IA](https://www.nngroup.com/topic/information-architecture/)
- [Optimal Workshop](https://www.optimalworkshop.com/) - Card sorting & tree testing tools
