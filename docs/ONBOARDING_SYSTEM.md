# Onboarding System

## Overview

Comprehensive onboarding experience with welcome screen, product tour, contextual tooltips, personalization, and celebration.

## Components

### OnboardingOrchestrator

Main component that manages the entire onboarding flow.

```tsx
import { OnboardingOrchestrator } from '@/components/onboarding';

<OnboardingOrchestrator />
```

### WelcomeScreen

Value proposition with key features.

```tsx
<WelcomeScreen
  onStart={() => console.log('Started')}
  onSkip={() => console.log('Skipped')}
/>
```

**Features:**
- Hero section with value proposition
- 3 key benefits highlighted
- Clear CTA buttons
- Skip option for experienced users

### OnboardingFlow

Step-by-step guided flow with progress indicator.

```tsx
<OnboardingFlow
  steps={[
    {
      id: 'step1',
      title: 'Welcome',
      description: 'Get started',
      content: <StepContent />
    }
  ]}
  onComplete={(data) => console.log(data)}
  onSkip={() => console.log('Skipped')}
/>
```

**Features:**
- Progress bar
- Back/Next navigation
- Skip anytime
- Data collection

### ProductTour

Interactive tour highlighting key features.

```tsx
<ProductTour
  steps={[
    {
      target: '#main-input',
      title: 'Prompt Input',
      content: 'Enter your prompt here',
      placement: 'bottom'
    }
  ]}
  onComplete={() => console.log('Tour complete')}
  onSkip={() => console.log('Tour skipped')}
/>
```

**Features:**
- Element highlighting
- Smooth scrolling
- Tooltip positioning
- Step counter

### ContextualTooltip

First-time feature tooltips.

```tsx
<ContextualTooltip
  id="feature-1"
  target="#feature-element"
  title="New Feature"
  content="This is how it works"
  placement="top"
  onDismiss={(id) => console.log('Dismissed', id)}
/>
```

**Features:**
- Intersection Observer
- Auto-positioning
- Dismissible
- Persistent state

### PersonalizationQuiz

Collect user preferences.

```tsx
<PersonalizationQuiz
  questions={[
    {
      id: 'role',
      question: 'What is your role?',
      type: 'single',
      options: [
        { id: 'dev', label: 'Developer', icon: <Icon /> }
      ]
    }
  ]}
  onComplete={(answers) => console.log(answers)}
/>
```

**Question Types:**
- `single`: Radio selection
- `multiple`: Checkbox selection

### QuickStartTemplates

Pre-built templates for common goals.

```tsx
<QuickStartTemplates
  templates={defaultTemplates}
  onSelect={(id) => console.log('Selected', id)}
/>
```

**Default Templates:**
- Code Review
- API Design
- Feature Specification
- Prompt Enhancement

### CompletionCelebration

Success screen with next steps.

```tsx
<CompletionCelebration
  userName="John"
  onContinue={() => console.log('Continue')}
/>
```

**Features:**
- Confetti animation
- Next steps cards
- Clear CTA

## State Management

### useOnboarding Hook

```tsx
const {
  isComplete,
  userData,
  completeOnboarding,
  skipOnboarding,
  dismissTooltip,
  shouldShowTooltip,
  resetOnboarding
} = useOnboarding();
```

**Methods:**
- `completeOnboarding(data)`: Mark as complete with user data
- `skipOnboarding()`: Skip without data
- `dismissTooltip(id)`: Dismiss specific tooltip
- `shouldShowTooltip(id)`: Check if tooltip should show
- `resetOnboarding()`: Reset for testing

**Storage:**
- Uses localStorage
- Persists across sessions
- Tracks dismissed tooltips

## Usage Examples

### Basic Setup

```tsx
import { OnboardingOrchestrator } from '@/components/onboarding';

function App() {
  return (
    <>
      <OnboardingOrchestrator />
      <MainApp />
    </>
  );
}
```

### Custom Flow

```tsx
import { OnboardingFlow, useOnboarding } from '@/components/onboarding';

function CustomOnboarding() {
  const { completeOnboarding, skipOnboarding } = useOnboarding();

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Get started',
      content: <WelcomeContent />
    },
    {
      id: 'setup',
      title: 'Setup',
      description: 'Configure your account',
      content: <SetupForm />
    }
  ];

  return (
    <OnboardingFlow
      steps={steps}
      onComplete={completeOnboarding}
      onSkip={skipOnboarding}
    />
  );
}
```

### Product Tour

```tsx
import { ProductTour, useOnboarding } from '@/components/onboarding';

function App() {
  const { isComplete } = useOnboarding();
  const [showTour, setShowTour] = useState(!isComplete);

  const tourSteps = [
    {
      target: '#input',
      title: 'Input Area',
      content: 'Enter your prompts here',
      placement: 'bottom'
    },
    {
      target: '#enhance-btn',
      title: 'Enhance Button',
      content: 'Click to enhance your prompt',
      placement: 'top'
    }
  ];

  return (
    <>
      {showTour && (
        <ProductTour
          steps={tourSteps}
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
      <MainApp />
    </>
  );
}
```

### Contextual Tooltips

```tsx
import { ContextualTooltip, useOnboarding } from '@/components/onboarding';

function Feature() {
  const { shouldShowTooltip, dismissTooltip } = useOnboarding();

  return (
    <>
      <button id="new-feature">New Feature</button>
      {shouldShowTooltip('new-feature') && (
        <ContextualTooltip
          id="new-feature"
          target="#new-feature"
          title="Try This!"
          content="This new feature helps you..."
          onDismiss={dismissTooltip}
        />
      )}
    </>
  );
}
```

## Best Practices

### 1. Make It Skippable

```tsx
// ✅ Good - Always provide skip option
<OnboardingFlow onSkip={skipOnboarding} />

// ❌ Bad - Forcing users through
<OnboardingFlow /> // No skip option
```

### 2. Show Value Early

```tsx
// ✅ Good - Show benefits upfront
<WelcomeScreen>
  <Benefits />
  <CTA />
</WelcomeScreen>

// ❌ Bad - Long intro without value
<WelcomeScreen>
  <LongVideo />
</WelcomeScreen>
```

### 3. Keep It Short

```tsx
// ✅ Good - 2-3 steps
const steps = [
  { id: 'personalize', ... },
  { id: 'template', ... }
];

// ❌ Bad - 10+ steps
const steps = [...Array(10)];
```

### 4. Personalize Experience

```tsx
// ✅ Good - Collect preferences
<PersonalizationQuiz
  questions={[
    { id: 'role', question: 'Your role?', ... }
  ]}
/>

// ❌ Bad - Generic for everyone
<GenericOnboarding />
```

### 5. Celebrate Completion

```tsx
// ✅ Good - Show success and next steps
<CompletionCelebration
  userName={user.name}
  onContinue={startApp}
/>

// ❌ Bad - Just close
onComplete={() => setShow(false)}
```

## Learning Styles

### Visual Learners

```tsx
// Include images, icons, and animations
<OnboardingFlow
  steps={[
    {
      id: 'step1',
      visual: '/images/feature.png',
      content: <VisualDemo />
    }
  ]}
/>
```

### Text-Based Learners

```tsx
// Provide detailed descriptions
<OnboardingFlow
  steps={[
    {
      id: 'step1',
      description: 'Detailed explanation...',
      content: <TextGuide />
    }
  ]}
/>
```

### Interactive Learners

```tsx
// Let them try features
<ProductTour
  steps={[
    {
      target: '#feature',
      content: 'Try clicking this button',
      interactive: true
    }
  ]}
/>
```

## Accessibility

### Keyboard Navigation

```tsx
// Support Tab, Enter, Escape
<OnboardingFlow
  onKeyDown={(e) => {
    if (e.key === 'Escape') skipOnboarding();
  }}
/>
```

### Screen Readers

```tsx
// Provide ARIA labels
<button aria-label="Skip onboarding">
  Skip
</button>
```

### Focus Management

```tsx
// Auto-focus on modal open
useEffect(() => {
  modalRef.current?.focus();
}, []);
```

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingFlow } from './OnboardingFlow';

test('completes onboarding', () => {
  const onComplete = jest.fn();
  render(<OnboardingFlow steps={steps} onComplete={onComplete} />);
  
  fireEvent.click(screen.getByText('Next'));
  fireEvent.click(screen.getByText('Complete'));
  
  expect(onComplete).toHaveBeenCalled();
});

test('allows skipping', () => {
  const onSkip = jest.fn();
  render(<OnboardingFlow steps={steps} onSkip={onSkip} />);
  
  fireEvent.click(screen.getByLabelText('Skip onboarding'));
  
  expect(onSkip).toHaveBeenCalled();
});
```

## Resources

- [User Onboarding Best Practices](https://www.useronboard.com/)
- [Product Tour Patterns](https://www.appcues.com/blog/product-tour-examples)
- [Onboarding UX](https://www.nngroup.com/articles/onboarding-ux/)
