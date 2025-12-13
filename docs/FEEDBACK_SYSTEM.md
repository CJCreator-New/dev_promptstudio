# Feedback System

## Overview

Comprehensive feedback system with surveys, ratings, detailed forms, badges, and analytics dashboard.

## Components

### FeedbackWidget

Floating widget accessible from any page.

```tsx
import { FeedbackWidget } from '@/components/feedback';

<FeedbackWidget
  onSubmit={(feedback) => console.log(feedback)}
/>
```

**Features:**
- Fixed position (bottom-right)
- Quick feedback submission
- Category selection
- Non-intrusive design

### StarRating

Quick rating component.

```tsx
<StarRating
  value={rating}
  onChange={setRating}
  size="md"
  readonly={false}
/>
```

**Sizes:**
- `sm`: 16px
- `md`: 24px (default)
- `lg`: 32px

### SurveyPrompt

Contextual survey at key moments.

```tsx
<SurveyPrompt
  question="How was your experience?"
  trigger="onComplete"
  onSubmit={(rating, comment) => console.log(rating, comment)}
  onDismiss={() => console.log('Dismissed')}
/>
```

**Triggers:**
- `onComplete`: After completing action
- `onTime`: After time period
- `onAction`: After specific action

### DetailedFeedbackForm

Comprehensive feedback form.

```tsx
<DetailedFeedbackForm
  onSubmit={(data) => console.log(data)}
  onCancel={() => setShow(false)}
/>
```

**Categories:**
- UI/UX
- Features
- Bugs
- General

**Fields:**
- Category selection
- Star rating
- Title
- Description
- Interview scheduling
- Email (if scheduling)

### FeedbackBadge

Achievement badges for active users.

```tsx
<FeedbackBadge badges={badges} />
```

**Default Badges:**
- **First Feedback**: Submit first feedback
- **Feedback Champion**: Submit 10 pieces
- **Quick Responder**: Respond to 5 surveys
- **Community Contributor**: Schedule interview

### FeedbackDashboard

Admin dashboard for managing feedback.

```tsx
<FeedbackDashboard
  feedback={feedbackItems}
  onStatusChange={(id, status) => updateStatus(id, status)}
/>
```

**Features:**
- Stats overview
- Category filters
- Status management
- Timeline view

### FeedbackAnalytics

Trend analysis and insights.

```tsx
<FeedbackAnalytics data={analyticsData} />
```

**Metrics:**
- Total feedback count
- Average rating
- Category breakdown
- Trend over time

## State Management

### useFeedback Hook

```tsx
const {
  feedbackCount,
  badges,
  submitFeedback,
  dismissSurvey,
  shouldShowSurvey,
  getBadgeProgress
} = useFeedback();
```

**Methods:**
- `submitFeedback(data)`: Submit feedback
- `dismissSurvey(id)`: Dismiss survey
- `shouldShowSurvey(id)`: Check if should show
- `getBadgeProgress(id)`: Get badge progress

## Usage Examples

### Basic Setup

```tsx
import { FeedbackWidget, useFeedback } from '@/components/feedback';

function App() {
  const { submitFeedback } = useFeedback();

  return (
    <>
      <MainApp />
      <FeedbackWidget onSubmit={submitFeedback} />
    </>
  );
}
```

### Survey at Key Moment

```tsx
import { SurveyPrompt, useFeedback } from '@/components/feedback';

function FeatureComplete() {
  const { submitFeedback, shouldShowSurvey, dismissSurvey } = useFeedback();
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    // Show survey after completing feature
    if (shouldShowSurvey('feature-complete')) {
      setShowSurvey(true);
    }
  }, []);

  return (
    <>
      <FeatureContent />
      {showSurvey && (
        <SurveyPrompt
          question="How was your experience with this feature?"
          trigger="onComplete"
          onSubmit={(rating, comment) => {
            submitFeedback({ rating, comment, context: 'feature-complete' });
            setShowSurvey(false);
          }}
          onDismiss={() => {
            dismissSurvey('feature-complete');
            setShowSurvey(false);
          }}
        />
      )}
    </>
  );
}
```

### Detailed Feedback Modal

```tsx
import { DetailedFeedbackForm, useFeedback } from '@/components/feedback';

function FeedbackModal({ isOpen, onClose }) {
  const { submitFeedback } = useFeedback();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-elevated rounded-xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">Send Detailed Feedback</h2>
        <DetailedFeedbackForm
          onSubmit={(data) => {
            submitFeedback(data);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
```

### Badge Display

```tsx
import { FeedbackBadge, defaultBadges, useFeedback } from '@/components/feedback';

function ProfilePage() {
  const { badges, getBadgeProgress } = useFeedback();

  const badgesWithProgress = defaultBadges.map(badge => ({
    ...badge,
    earned: badges.includes(badge.id),
    progress: getBadgeProgress(badge.id)
  }));

  return (
    <div>
      <h2>Your Achievements</h2>
      <FeedbackBadge badges={badgesWithProgress} />
    </div>
  );
}
```

### Admin Dashboard

```tsx
import { FeedbackDashboard } from '@/components/feedback';

function AdminPage() {
  const [feedback, setFeedback] = useState([]);

  const handleStatusChange = (id, status) => {
    // Update in backend
    updateFeedbackStatus(id, status);
    // Update local state
    setFeedback(prev =>
      prev.map(f => f.id === id ? { ...f, status } : f)
    );
  };

  return (
    <div>
      <h1>Feedback Management</h1>
      <FeedbackDashboard
        feedback={feedback}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
```

## Best Practices

### 1. Non-Intrusive Timing

```tsx
// ✅ Good - After completing action
useEffect(() => {
  if (actionCompleted && shouldShowSurvey('action-complete')) {
    setShowSurvey(true);
  }
}, [actionCompleted]);

// ❌ Bad - Immediately on page load
useEffect(() => {
  setShowSurvey(true);
}, []);
```

### 2. Provide Context

```tsx
// ✅ Good - Include context
submitFeedback({
  rating: 5,
  comment: 'Great feature!',
  context: 'feature-x-completion',
  page: '/features/x'
});

// ❌ Bad - No context
submitFeedback({ rating: 5 });
```

### 3. Reward Participation

```tsx
// ✅ Good - Show badge earned
submitFeedback(data).then(() => {
  if (newBadgeEarned) {
    showBadgeNotification('Feedback Champion');
  }
});

// ❌ Bad - No acknowledgment
submitFeedback(data);
```

### 4. Make It Easy

```tsx
// ✅ Good - Quick star rating
<StarRating onChange={submitQuickFeedback} />

// ❌ Bad - Always require detailed form
<DetailedFeedbackForm required />
```

## Survey Triggers

### On Completion

```tsx
useEffect(() => {
  if (taskCompleted) {
    showSurvey('task-complete');
  }
}, [taskCompleted]);
```

### Time-Based

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    if (shouldShowSurvey('time-based')) {
      showSurvey('time-based');
    }
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearTimeout(timer);
}, []);
```

### Action-Based

```tsx
const handleFeatureUse = () => {
  useFeature();
  
  if (featureUseCount === 3 && shouldShowSurvey('feature-use')) {
    showSurvey('feature-use');
  }
};
```

## Badge System

### Earning Badges

```tsx
const submitFeedback = (data) => {
  const newCount = feedbackCount + 1;
  
  // Check for badge milestones
  if (newCount === 1) {
    awardBadge('first-feedback');
  }
  if (newCount === 10) {
    awardBadge('feedback-champion');
  }
  
  saveFeedback(data);
};
```

### Displaying Progress

```tsx
<FeedbackBadge
  badges={[
    {
      id: 'champion',
      name: 'Feedback Champion',
      earned: false,
      progress: 7,
      total: 10
    }
  ]}
/>
```

## Analytics

### Tracking Trends

```tsx
const analyticsData = [
  {
    period: 'Week 1',
    totalFeedback: 45,
    avgRating: 4.2,
    byCategory: { ui: 15, features: 20, bugs: 10 },
    trend: 12
  },
  {
    period: 'Week 2',
    totalFeedback: 52,
    avgRating: 4.5,
    byCategory: { ui: 18, features: 22, bugs: 12 },
    trend: 15
  }
];

<FeedbackAnalytics data={analyticsData} />
```

## Accessibility

### Keyboard Navigation

```tsx
<StarRating
  onKeyDown={(e) => {
    if (e.key === 'ArrowRight') nextStar();
    if (e.key === 'ArrowLeft') prevStar();
  }}
/>
```

### Screen Readers

```tsx
<button aria-label="Submit feedback">
  <MessageSquare />
</button>
```

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { StarRating } from './StarRating';

test('allows rating selection', () => {
  const onChange = jest.fn();
  render(<StarRating onChange={onChange} />);
  
  fireEvent.click(screen.getAllByRole('button')[4]); // 5th star
  expect(onChange).toHaveBeenCalledWith(5);
});

test('shows survey at right time', () => {
  const { rerender } = render(<App completed={false} />);
  expect(screen.queryByText('How was your experience?')).not.toBeInTheDocument();
  
  rerender(<App completed={true} />);
  expect(screen.getByText('How was your experience?')).toBeInTheDocument();
});
```

## Resources

- [User Feedback Best Practices](https://www.nngroup.com/articles/user-feedback/)
- [Survey Design](https://www.surveymonkey.com/mp/survey-design-best-practices/)
- [Gamification](https://www.interaction-design.org/literature/article/gamification-in-ux)
