import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Checkbox } from '../atomic/Checkbox';
import { AuthLayout } from './AuthLayout';
import { SocialLogin } from './SocialLogin';
import { PasswordStrength } from './PasswordStrength';

interface RegisterFormProps {
  onRegister: (email: string, password: string, name: string) => Promise<void>;
  onSocialLogin: (provider: 'google' | 'github') => Promise<void>;
  onSwitchToLogin: () => void;
  onClose?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSocialLogin,
  onSwitchToLogin,
  onClose
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onRegister(email, password, name);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start building better prompts today" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          icon={<User size={18} />}
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          required
        />
        
        <div>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            icon={<Lock size={18} />}
            required
          />
          {password && (
            <div className="mt-3">
              <PasswordStrength password={password} />
            </div>
          )}
        </div>

        <Checkbox
          checked={acceptTerms}
          onChange={setAcceptTerms}
          label={
            <span className="text-sm text-slate-300">
              I agree to the{' '}
              <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
            </span>
          }
        />

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-4">
          <SocialLogin
            onGoogleLogin={() => onSocialLogin('google')}
            onGithubLogin={() => onSocialLogin('github')}
            loading={loading}
          />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-blue-400 hover:text-blue-300 font-medium">
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
};
