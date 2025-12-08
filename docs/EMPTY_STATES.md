# Empty State System

A comprehensive system of empty states with context-specific guidance and consistent patterns.

## 🎯 Design Principles

1. **Helpful, Not Frustrating**: Guide users to next actions
2. **Context-Specific**: Tailored messaging for each scenario
3. **Consistent Patterns**: Unified visual language
4. **Actionable**: Always provide clear next steps
5. **Empathetic**: Positive, encouraging tone

## 📦 Component Structure

### Base Component

```tsx
import { EmptyState } from './components/ui/EmptyState';

<EmptyState
  icon={IconComponent}
  title="Clear Title"
  description="Helpful description"
  actions={[
    { label: 'Primary Action', onClick: handleAction, variant: 'primary' }
  ]}
  suggestions={['Tip 1', 'Tip 2', 'Tip 3']}
  compact={false}
/>
```

## 🎨 Empty State Categories

### 1. First-Time User States

**Purpose**: Welcome and guide new users

#### FirstTimePrompts
```tsx
import { FirstTimePrompts } from './components/emptyStates';

<FirstTimePrompts onCreatePrompt={handleCreate} />
```

**When to use**: User has never created a prompt
**Tone**: Welcoming, encouraging
**Actions**: Create first prompt
**Suggestions**: Example use cases

#### FirstTimeHistory
```tsx
<FirstTimeHistory onEnhance={handleEnhance} />
```

**When to use**: History sidebar is empty
**Tone**: Informative
**Actions**: Enhance a prompt

#### FirstTimeProjects
```tsx
<FirstTimeProjects onCreateProject={handleSave} />
```

**When to use**: No saved projects
**Tone**: Educational
**Actions**: Save current as project

#### FirstTimeTemplates
```tsx
<FirstTimeTemplates onBrowse={handleBrowse} />
```

**When to use**: No custom templates
**Tone**: Helpful
**Actions**: Browse recipe library

---

### 2. Zero Results States

**Purpose**: Help users refine their search/filters

#### NoSearchResults
```tsx
import { NoSearchResults } from './components/emptyStates';

<NoSearchResults 
  query={searchQuery} 
  onClear={handleClearSearch} 
/>
```

**When to use**: Search returns no results
**Tone**: Helpful, not blaming
**Actions**: Clear search
**Suggestions**: Search tips

#### NoFilteredResults
```tsx
<NoFilteredResults onReset={handleResetFilters} />
```

**When to use**: Active filters return no results
**Tone**: Neutral
**Actions**: Clear filters

---

### 3. Error States

**Purpose**: Provide recovery options

#### ErrorLoadingData
```tsx
import { ErrorLoadingData } from './components/emptyStates';

<ErrorLoadingData onRetry={handleRetry} />
```

**When to use**: Data fetch fails
**Tone**: Reassuring
**Actions**: Retry
**Suggestions**: Troubleshooting steps

#### ErrorEnhancement
```tsx
<ErrorEnhancement 
  error={errorMessage} 
  onRetry={handleRetry} 
/>
```

**When to use**: AI enhancement fails
**Tone**: Helpful
**Actions**: Retry
**Suggestions**: Common fixes

---

### 4. In-Progress States

**Purpose**: Show background operations

#### LoadingData
```tsx
import { LoadingData } from './components/emptyStates';

<LoadingData />
```

**When to use**: Initial data load
**Tone**: Patient
**Compact**: Yes

#### ProcessingPrompt
```tsx
<ProcessingPrompt />
```

**When to use**: AI is processing
**Tone**: Informative
**Compact**: Yes

#### SyncingData
```tsx
<SyncingData />
```

**When to use**: Cloud sync in progress
**Tone**: Brief
**Compact**: Yes

---

### 5. Permission States

**Purpose**: Guide users to enable features

#### NoApiKey
```tsx
import { NoApiKey } from './components/emptyStates';

<NoApiKey onAddKey={handleOpenSettings} />
```

**When to use**: API key required
**Tone**: Instructive
**Actions**: Add API key
**Suggestions**: Where to get keys

#### OfflineMode
```tsx
<OfflineMode />
```

**When to use**: User is offline
**Tone**: Reassuring
**Compact**: Yes

---

### 6. User-Generated Content

**Purpose**: Encourage content creation

#### EmptyInbox
```tsx
import { EmptyInbox } from './components/emptyStates';

<EmptyInbox onCompose={handleCreate} />
```

**When to use**: No notifications
**Tone**: Positive
**Actions**: Create new

#### NoContent
```tsx
<NoContent 
  contentType="Templates" 
  onCreate={handleCreate} 
/>
```

**When to use**: Generic empty content
**Tone**: Encouraging
**Actions**: Create content

---

### 7. Data Visualization

**Purpose**: Explain missing data

#### NoChartData
```tsx
import { NoChartData } from './components/emptyStates';

<NoChartData />
```

**When to use**: No analytics data
**Tone**: Informative
**Compact**: Yes

#### InsufficientData
```tsx
<InsufficientData />
```

**When to use**: Not enough data points
**Tone**: Encouraging
**Compact**: Yes

---

## 🎨 Visual Elements

### Icons
- Use Lucide icons for consistency
- Icon size: 48px (default), 32px (compact)
- Icon color: `text-slate-500`
- Background: `bg-slate-800/50` circular

### Illustrations
```tsx
import { WelcomeIllustration } from './components/emptyStates/EmptyStateIllustrations';

<EmptyState
  illustration={<WelcomeIllustration />}
  // ... other props
/>
```

Available illustrations:
- `WelcomeIllustration`
- `SearchIllustration`
- `ErrorIllustration`
- `LoadingIllustration`
- `LockIllustration`
- `FolderIllustration`
- `ChartIllustration`
- `InboxIllustration`

---

## 📐 Layout Patterns

### Default Layout
- Vertical center alignment
- Max width: 28rem (448px)
- Padding: 4rem vertical
- Icon/illustration at top
- Title, description, suggestions, actions

### Compact Layout
- Reduced padding: 2rem vertical
- Smaller icon: 32px
- No suggestions
- Fewer actions

---

## ✍️ Content Guidelines

### Titles
- **Length**: 2-5 words
- **Tone**: Clear, direct
- **Examples**:
  - ✅ "No Results Found"
  - ✅ "Welcome to DevPrompt Studio"
  - ❌ "Oops! We couldn't find what you're looking for"

### Descriptions
- **Length**: 1-2 sentences
- **Tone**: Helpful, not blaming
- **Include**: What happened and why
- **Examples**:
  - ✅ "We couldn't find anything matching your search. Try different keywords."
  - ✅ "Your enhanced prompts will appear here once you start using the app."
  - ❌ "You didn't enter a valid search term."

### Actions
- **Primary**: Main action (1 per state)
- **Secondary**: Alternative actions (0-2)
- **Label**: Verb + noun (e.g., "Create Prompt", "Try Again")

### Suggestions
- **Count**: 2-4 tips
- **Format**: Bullet points
- **Tone**: Helpful, actionable
- **Examples**:
  - ✅ "Check for typos"
  - ✅ "Try more general terms"
  - ❌ "Make sure you typed correctly"

---

## 🎯 Usage Examples

### Complete Example

```tsx
import { useState } from 'react';
import { FirstTimePrompts, NoSearchResults, ErrorLoadingData } from './components/emptyStates';

const PromptList = () => {
  const { prompts, loading, error, searchQuery } = usePrompts();

  if (loading) return <LoadingData />;
  if (error) return <ErrorLoadingData onRetry={refetch} />;
  
  if (searchQuery && prompts.length === 0) {
    return <NoSearchResults query={searchQuery} onClear={clearSearch} />;
  }
  
  if (prompts.length === 0) {
    return <FirstTimePrompts onCreatePrompt={handleCreate} />;
  }

  return <PromptListView prompts={prompts} />;
};
```

### Custom Empty State

```tsx
import { EmptyState } from './components/ui/EmptyState';
import { Zap } from 'lucide-react';

<EmptyState
  icon={Zap}
  title="Custom Empty State"
  description="Create your own empty states for specific scenarios."
  actions={[
    { 
      label: 'Primary Action', 
      onClick: handlePrimary, 
      variant: 'primary' 
    },
    { 
      label: 'Secondary Action', 
      onClick: handleSecondary, 
      variant: 'secondary' 
    }
  ]}
  suggestions={[
    'Helpful tip 1',
    'Helpful tip 2',
    'Helpful tip 3'
  ]}
/>
```

---

## 🎨 Customization

### Custom Illustration

```tsx
const CustomIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    {/* Your SVG content */}
  </svg>
);

<EmptyState
  illustration={<CustomIllustration />}
  // ... other props
/>
```

### Compact Mode

```tsx
<EmptyState
  compact
  // Reduces padding, icon size, removes suggestions
/>
```

---

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on actions
- Keyboard navigation
- Screen reader friendly
- Focus management

---

## 📱 Responsive Design

- Mobile: Single column, full width
- Tablet: Centered, max-width
- Desktop: Centered, max-width
- Actions: Stack on mobile

---

## 🎯 Best Practices

### Do's ✅
- Use positive, encouraging language
- Provide clear next steps
- Include helpful suggestions
- Keep it concise
- Test with real users

### Don'ts ❌
- Don't blame the user
- Don't use jargon
- Don't overwhelm with options
- Don't leave users stuck
- Don't use humor inappropriately

---

## 🧪 Testing

### Visual Testing
```tsx
import { render, screen } from '@testing-library/react';
import { FirstTimePrompts } from './components/emptyStates';

test('renders first-time prompt state', () => {
  render(<FirstTimePrompts onCreatePrompt={jest.fn()} />);
  expect(screen.getByText('Welcome to DevPrompt Studio')).toBeInTheDocument();
});
```

### Interaction Testing
```tsx
test('calls action on button click', () => {
  const handleCreate = jest.fn();
  render(<FirstTimePrompts onCreatePrompt={handleCreate} />);
  
  fireEvent.click(screen.getByText('Create Your First Prompt'));
  expect(handleCreate).toHaveBeenCalled();
});
```

---

## 📊 Analytics

Track empty state views:
```tsx
useEffect(() => {
  analytics.track('empty_state_viewed', {
    type: 'first_time_prompts',
    timestamp: Date.now()
  });
}, []);
```

---

## 🔄 Migration Guide

### From Generic to Specific

```tsx
// Before
{items.length === 0 && <p>No items</p>}

// After
{items.length === 0 && (
  <FirstTimePrompts onCreatePrompt={handleCreate} />
)}
```

---

## 🎯 Future Enhancements

- [ ] Animated illustrations
- [ ] Lottie animations
- [ ] A/B testing framework
- [ ] Personalized suggestions
- [ ] Multi-language support
- [ ] Dark/light mode variants
