import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { RegisterForm } from '../RegisterForm';
import { ForgotPasswordForm } from '../ForgotPasswordForm';
import { TwoFactorSetup } from '../TwoFactorSetup';
import { AccountLockout } from '../AccountLockout';
import { PasswordStrength } from '../PasswordStrength';

describe('Authentication System Tests', () => {
  describe('LoginForm', () => {
    const mockOnLogin = vi.fn();
    const mockOnSocialLogin = vi.fn();
    const mockOnForgotPassword = vi.fn();
    const mockOnSwitchToRegister = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('renders login form with all fields', () => {
      render(
        <LoginForm
          onLogin={mockOnLogin}
          onSocialLogin={mockOnSocialLogin}
          onForgotPassword={mockOnForgotPassword}
          onSwitchToRegister={mockOnSwitchToRegister}
        />
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByText(/remember me/i)).toBeInTheDocument();
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });

    test('submits form with email and password', async () => {
      mockOnLogin.mockResolvedValue(undefined);
      
      render(
        <LoginForm
          onLogin={mockOnLogin}
          onSocialLogin={mockOnSocialLogin}
          onForgotPassword={mockOnForgotPassword}
          onSwitchToRegister={mockOnSwitchToRegister}
        />
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123', false);
      });
    });

    test('displays error message on login failure', async () => {
      mockOnLogin.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <LoginForm
          onLogin={mockOnLogin}
          onSocialLogin={mockOnSocialLogin}
          onForgotPassword={mockOnForgotPassword}
          onSwitchToRegister={mockOnSwitchToRegister}
        />
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrong' }
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('RegisterForm', () => {
    const mockOnRegister = vi.fn();
    const mockOnSocialLogin = vi.fn();
    const mockOnSwitchToLogin = vi.fn();

    test('renders registration form with all fields', () => {
      render(
        <RegisterForm
          onRegister={mockOnRegister}
          onSocialLogin={mockOnSocialLogin}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      );

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    });

    test('shows password strength indicator', () => {
      render(
        <RegisterForm
          onRegister={mockOnRegister}
          onSocialLogin={mockOnSocialLogin}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      );

      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: 'Test123!' } });

      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });

    test('requires terms acceptance', async () => {
      mockOnRegister.mockResolvedValue(undefined);

      render(
        <RegisterForm
          onRegister={mockOnRegister}
          onSocialLogin={mockOnSocialLogin}
          onSwitchToLogin={mockOnSwitchToLogin}
        />
      );

      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'Test123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/accept the terms/i)).toBeInTheDocument();
      });
    });
  });

  describe('PasswordStrength', () => {
    test('shows weak password', () => {
      render(<PasswordStrength password="abc" />);
      expect(screen.getByText(/weak/i)).toBeInTheDocument();
    });

    test('shows strong password', () => {
      render(<PasswordStrength password="Test123!@#" />);
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });

    test('validates all requirements', () => {
      const { rerender } = render(<PasswordStrength password="" />);
      
      rerender(<PasswordStrength password="Test123!@#" />);
      
      expect(screen.getByText(/at least 8 characters/i)).toHaveClass('text-green-400');
      expect(screen.getByText(/one uppercase letter/i)).toHaveClass('text-green-400');
      expect(screen.getByText(/one lowercase letter/i)).toHaveClass('text-green-400');
      expect(screen.getByText(/one number/i)).toHaveClass('text-green-400');
      expect(screen.getByText(/one special character/i)).toHaveClass('text-green-400');
    });
  });

  describe('ForgotPasswordForm', () => {
    const mockOnSendReset = vi.fn();
    const mockOnBack = vi.fn();

    test('renders forgot password form', () => {
      render(
        <ForgotPasswordForm
          onSendReset={mockOnSendReset}
          onBack={mockOnBack}
        />
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    });

    test('shows success message after sending', async () => {
      mockOnSendReset.mockResolvedValue(undefined);

      render(
        <ForgotPasswordForm
          onSendReset={mockOnSendReset}
          onBack={mockOnBack}
        />
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

      await waitFor(() => {
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      });
    });
  });

  describe('TwoFactorSetup', () => {
    const mockOnVerify = vi.fn();
    const mockOnSkip = vi.fn();

    test('renders 2FA setup with QR code', () => {
      render(
        <TwoFactorSetup
          qrCode="https://example.com/qr.png"
          secret="ABCD1234EFGH5678"
          onVerify={mockOnVerify}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByAltText(/qr code/i)).toBeInTheDocument();
      expect(screen.getByText(/ABCD1234EFGH5678/i)).toBeInTheDocument();
    });

    test('validates 6-digit code', async () => {
      mockOnVerify.mockResolvedValue(undefined);

      render(
        <TwoFactorSetup
          qrCode="https://example.com/qr.png"
          secret="ABCD1234EFGH5678"
          onVerify={mockOnVerify}
          onSkip={mockOnSkip}
        />
      );

      const input = screen.getByLabelText(/verification code/i);
      fireEvent.change(input, { target: { value: '123456' } });
      fireEvent.click(screen.getByRole('button', { name: /verify and enable/i }));

      await waitFor(() => {
        expect(mockOnVerify).toHaveBeenCalledWith('123456');
      });
    });
  });

  describe('AccountLockout', () => {
    const mockOnContactSupport = vi.fn();

    test('displays lockout information', () => {
      render(
        <AccountLockout
          remainingTime={900}
          attempts={5}
          maxAttempts={5}
          onContactSupport={mockOnContactSupport}
        />
      );

      expect(screen.getByText(/temporarily locked/i)).toBeInTheDocument();
      expect(screen.getByText(/15 minutes/i)).toBeInTheDocument();
      expect(screen.getByText(/failed attempts: 5 of 5/i)).toBeInTheDocument();
    });
  });
});
