import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { EmailVerificationPrompt } from './EmailVerificationPrompt';
import { TwoFactorSetup } from './TwoFactorSetup';
import { TwoFactorVerify } from './TwoFactorVerify';
import { AccountLockout } from './AccountLockout';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginWithGithub,
  sendPasswordReset,
  resendVerificationEmail,
  enable2FA,
  verify2FA,
  checkAccountLockout
} from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

type AuthView = 'login' | 'register' | 'forgot' | 'verify-email' | '2fa-setup' | '2fa-verify' | 'lockout';

interface AuthManagerProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const AuthManager: React.FC<AuthManagerProps> = ({ onClose, onSuccess }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [twoFactorData, setTwoFactorData] = useState<{ qrCode: string; secret: string } | null>(null);
  const [lockoutData, setLockoutData] = useState<{ remainingTime: number; attempts: number } | null>(null);
  const { setUser, setSessionExpiry } = useAuthStore();

  const handleLogin = async (email: string, password: string, remember: boolean) => {
    const lockout = checkAccountLockout(email);
    if (lockout.locked) {
      setLockoutData({ remainingTime: lockout.remainingTime, attempts: lockout.attempts });
      setView('lockout');
      throw new Error('Account locked');
    }

    const user = await loginWithEmail(email, password, remember);
    
    if (!user.emailVerified) {
      setEmail(user.email!);
      setView('verify-email');
      return;
    }

    const sessionExpiry = remember ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000;
    setUser(user.uid, user.email!, user.emailVerified, false);
    setSessionExpiry(sessionExpiry);
    onSuccess?.();
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    const user = await registerWithEmail(email, password, name);
    setEmail(user.email!);
    setView('verify-email');
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    const user = provider === 'google' ? await loginWithGoogle() : await loginWithGithub();
    setUser(user.uid, user.email!, user.emailVerified, false);
    setSessionExpiry(Date.now() + 30 * 24 * 60 * 60 * 1000);
    onSuccess?.();
  };

  const handleForgotPassword = async (email: string) => {
    await sendPasswordReset(email);
  };

  const handleResendVerification = async () => {
    const user = { email } as any;
    await resendVerificationEmail(user);
  };

  const handleEnable2FA = async (userId: string) => {
    const data = await enable2FA(userId);
    setTwoFactorData(data);
    setView('2fa-setup');
  };

  const handleVerify2FA = async (code: string) => {
    if (!twoFactorData) return;
    await verify2FA('current-user-id', code);
    onSuccess?.();
  };

  if (view === 'lockout' && lockoutData) {
    return (
      <AccountLockout
        remainingTime={lockoutData.remainingTime}
        attempts={lockoutData.attempts}
        maxAttempts={5}
        onContactSupport={() => window.open('mailto:support@devpromptstudio.com')}
        onClose={onClose}
      />
    );
  }

  if (view === 'verify-email') {
    return (
      <EmailVerificationPrompt
        email={email}
        onResend={handleResendVerification}
        onClose={onClose}
      />
    );
  }

  if (view === '2fa-setup' && twoFactorData) {
    return (
      <TwoFactorSetup
        qrCode={twoFactorData.qrCode}
        secret={twoFactorData.secret}
        onVerify={handleVerify2FA}
        onSkip={() => onSuccess?.()}
        onClose={onClose}
      />
    );
  }

  if (view === '2fa-verify') {
    return (
      <TwoFactorVerify
        onVerify={handleVerify2FA}
        onUseBackupCode={() => {}}
        onBack={() => setView('login')}
        onClose={onClose}
      />
    );
  }

  if (view === 'forgot') {
    return (
      <ForgotPasswordForm
        onSendReset={handleForgotPassword}
        onBack={() => setView('login')}
        onClose={onClose}
      />
    );
  }

  if (view === 'register') {
    return (
      <RegisterForm
        onRegister={handleRegister}
        onSocialLogin={handleSocialLogin}
        onSwitchToLogin={() => setView('login')}
        onClose={onClose}
      />
    );
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      onSocialLogin={handleSocialLogin}
      onForgotPassword={() => setView('forgot')}
      onSwitchToRegister={() => setView('register')}
      onClose={onClose}
    />
  );
};
