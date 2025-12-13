import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AuthLayout } from './AuthLayout';

interface ForgotPasswordFormProps {
  onSendReset: (email: string) => Promise<void>;
  onBack: () => void;
  onClose?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSendReset,
  onBack,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSendReset(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your email" onClose={onClose}>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-400" />
            </div>
          </div>
          <p className="text-slate-300">
            We've sent a password reset link to <strong className="text-white">{email}</strong>
          </p>
          <p className="text-sm text-slate-400">
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </p>
          <Button variant="ghost" onClick={onBack} className="w-full">
            Back to sign in
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset password" 
      subtitle="Enter your email to receive a reset link"
      onClose={onClose}
    >
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

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Send reset link
        </Button>

        <Button variant="ghost" onClick={onBack} className="w-full">
          <ArrowLeft size={16} className="mr-2" />
          Back to sign in
        </Button>
      </form>
    </AuthLayout>
  );
};
