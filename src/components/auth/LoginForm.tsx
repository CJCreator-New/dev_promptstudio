import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Checkbox } from '../atomic/Checkbox';
import { AuthLayout } from './AuthLayout';
import { SocialLogin } from './SocialLogin';

interface LoginFormProps {
  onLogin: (email: string, password: string, remember: boolean) => Promise<void>;
  onSocialLogin: (provider: 'google' | 'github') => Promise<void>;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
  onClose?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSocialLogin,
  onForgotPassword,
  onSwitchToRegister,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password, remember);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your work" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          required
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          icon={<Lock size={18} />}
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox
            checked={remember}
            onChange={setRemember}
            label="Remember me"
          />
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Sign in
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
        Don't have an account?{' '}
        <button onClick={onSwitchToRegister} className="text-blue-400 hover:text-blue-300 font-medium">
          Sign up
        </button>
      </p>
    </AuthLayout>
  );
};
