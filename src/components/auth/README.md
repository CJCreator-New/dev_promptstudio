# Authentication System

Comprehensive authentication system with security features and clean UX.

## Features

### ✅ Login & Registration
- Email/password authentication
- Social login (Google, GitHub)
- Password strength validation
- Terms acceptance

### ✅ Security
- Two-factor authentication (2FA)
- Account lockout protection (5 attempts, 15min lockout)
- Session management (remember me)
- Email verification

### ✅ Password Recovery
- Password reset via email
- Success confirmation
- Expiry handling (1 hour)

### ✅ User Experience
- Clean, focused screens
- Clear error states
- Security indicators
- Helpful microcopy
- Smooth transitions

## Usage

```tsx
import { AuthManager } from './components/auth';

function App() {
  return (
    <AuthManager
      onClose={() => console.log('Closed')}
      onSuccess={() => console.log('Authenticated')}
    />
  );
}
```

## Components

### AuthManager
Main orchestrator for all auth flows.

### LoginForm
- Email/password login
- Social login options
- Remember me checkbox
- Forgot password link

### RegisterForm
- Email/password registration
- Password strength indicator
- Terms acceptance
- Social registration

### ForgotPasswordForm
- Email submission
- Success confirmation
- Back navigation

### EmailVerificationPrompt
- Verification reminder
- Resend functionality
- Clear instructions

### TwoFactorSetup
- QR code display
- Manual entry option
- Verification step
- Skip option

### TwoFactorVerify
- Code input
- Backup code option
- Error handling

### AccountLockout
- Lockout notification
- Remaining time display
- Security information
- Support contact

## Security Features

### Account Lockout
- Max attempts: 5
- Lockout duration: 15 minutes
- Automatic reset after expiry

### Session Management
- Remember me: 30 days
- Default session: 24 hours
- Automatic expiry check

### Password Requirements
- Minimum 8 characters
- Uppercase letter
- Lowercase letter
- Number
- Special character

## Styling

All components use Tailwind CSS with consistent design tokens:
- Dark theme optimized
- Accessible color contrast
- Smooth animations
- Responsive layout

## Error Handling

Clear, user-friendly error messages:
- Invalid credentials
- Account locked
- Network errors
- Validation errors

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels
