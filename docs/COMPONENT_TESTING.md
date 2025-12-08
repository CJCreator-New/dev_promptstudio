# Component Testing Guide

Comprehensive guide for component-level testing using Jest and React Testing Library.

## 🚀 Quick Start

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Coverage report
npm test Button.test       # Specific test
```

## 📁 Test Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── __tests__/
│   │       └── Button.test.tsx
│   └── __tests__/
│       └── ThemeToggle.test.tsx
└── test-utils/
    ├── setup.ts           # Global setup
    ├── mocks.ts           # Mock utilities
    └── render.tsx         # Custom render
```

## 🧪 Test Categories

### 1. Rendering Tests

```typescript
describe('Rendering', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-indigo-600');
  });
});
```

### 2. State Tests

```typescript
describe('States', () => {
  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows success state', () => {
    render(<Button success>Success</Button>);
    expect(screen.getByRole('button')).toHaveClass('animate-button-success');
  });
});
```

### 3. Interaction Tests

```typescript
describe('Interactions', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### 4. Accessibility Tests

```typescript
describe('Accessibility', () => {
  it('has proper button role', () => {
    render(<Button>Accessible</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has aria-label', () => {
    render(<Button aria-label="Custom">Button</Button>);
    expect(screen.getByLabelText('Custom')).toBeInTheDocument();
  });
});
```

### 5. Edge Case Tests

```typescript
describe('Edge Cases', () => {
  it('handles empty children', () => {
    render(<Button>{''}</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles rapid clicks', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Rapid</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
```

## 🛠️ Mocking Strategies

### Mock localStorage

```typescript
import { mockLocalStorage } from '../test-utils/mocks';

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage()
  });
});
```

### Mock API Calls

```typescript
import { mockApiResponse } from '../test-utils/mocks';

jest.mock('../services/api', () => ({
  fetchData: jest.fn(() => mockApiResponse({ data: 'test' }))
}));
```

### Mock Streaming Responses

```typescript
import { mockStreamingResponse } from '../test-utils/mocks';

jest.mock('../services/enhance', () => ({
  enhancePrompt: jest.fn(() => mockStreamingResponse(['chunk1', 'chunk2']))
}));
```

### Mock Firebase

```typescript
import { mockFirebaseAuth } from '../test-utils/mocks';

jest.mock('../services/firebaseAuth', () => mockFirebaseAuth);
```

### Mock IndexedDB

```typescript
import { mockIndexedDB } from '../test-utils/mocks';

jest.mock('../utils/db', () => ({
  db: {
    prompts: mockIndexedDB(),
    history: mockIndexedDB()
  }
}));
```

## 🎯 Testing Patterns

### Testing with Providers

```typescript
import { render } from '../test-utils/render';

test('component with theme', () => {
  render(<MyComponent />);
  // ThemeProvider automatically wrapped
});
```

### Testing Async Operations

```typescript
it('loads data asynchronously', async () => {
  render(<DataComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Testing User Events

```typescript
import userEvent from '@testing-library/user-event';

it('types in input', async () => {
  const user = userEvent.setup();
  render(<Input />);
  
  await user.type(screen.getByRole('textbox'), 'Hello');
  expect(screen.getByRole('textbox')).toHaveValue('Hello');
});
```

### Testing Form Submission

```typescript
it('submits form', async () => {
  const handleSubmit = jest.fn();
  render(<Form onSubmit={handleSubmit} />);
  
  await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
```

## 📊 Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🎨 Best Practices

### 1. Use Semantic Queries

```typescript
// ✅ Good
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByText('Welcome')

// ❌ Bad
screen.getByTestId('submit-btn')
screen.getByClassName('email-input')
```

### 2. Test User Behavior

```typescript
// ✅ Good - tests what user sees
expect(screen.getByText('Success!')).toBeInTheDocument();

// ❌ Bad - tests implementation
expect(component.state.success).toBe(true);
```

### 3. Avoid Implementation Details

```typescript
// ✅ Good
expect(screen.getByRole('button')).toBeDisabled();

// ❌ Bad
expect(button.props.disabled).toBe(true);
```

### 4. Clean Up After Tests

```typescript
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  localStorage.clear();
});
```

### 5. Use Descriptive Test Names

```typescript
// ✅ Good
it('disables submit button when form is invalid', () => {});

// ❌ Bad
it('test button', () => {});
```

## 🐛 Debugging Tests

### Debug Output

```typescript
import { screen } from '@testing-library/react';

screen.debug(); // Print entire DOM
screen.debug(screen.getByRole('button')); // Print specific element
```

### Log Queries

```typescript
import { logRoles } from '@testing-library/react';

const { container } = render(<Component />);
logRoles(container);
```

### Pause Test

```typescript
import { screen } from '@testing-library/react';

await screen.findByText('Loading...', {}, { timeout: 10000 });
```

## 📝 Test Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  describe('Rendering', () => {
    it('renders correctly', () => {
      render(<MyComponent />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles click', () => {
      const handleClick = jest.fn();
      render(<MyComponent onClick={handleClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('shows loading state', () => {
      render(<MyComponent loading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null props', () => {
      render(<MyComponent data={null} />);
      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });
});
```

## 🔍 Common Issues

### Issue: Element not found

```typescript
// Use findBy for async elements
await screen.findByText('Loaded');

// Use queryBy to assert non-existence
expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
```

### Issue: Act warnings

```typescript
// Wrap state updates in act
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

### Issue: Timer issues

```typescript
// Use fake timers
jest.useFakeTimers();
fireEvent.click(button);
jest.advanceTimersByTime(1000);
jest.useRealTimers();
```

## 📚 Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
