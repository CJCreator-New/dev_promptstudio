import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { AuthLayout } from './AuthLayout';

interface EmailVerificationPromptProps {
  email: string;
  onResend: () => Promise<void>;
  onClose?: () => void;
}

export const EmailVerificationPrompt: React.FC<EmailVerificationPromptProps> = ({
  email,
  onResend,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      await onResend();
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify your email" onClose={onClose}>
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Mail size={32} className="text-blue-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-slate-300">
            We've sent a verification email to
          </p>
          <p className="text-white font-medium">{email}</p>
        </div>

        <p className="text-sm text-slate-400">
          Click the link in the email to verify your account. Check your spam folder if you don't see it.
        </p>

        {sent && (
          <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle size={16} className="text-green-400" />
            <p className="text-sm text-green-400">Verification email sent!</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="pt-2">
          <p className="text-sm text-slate-400 mb-3">Didn't receive the email?</p>
          <Button variant="ghost" onClick={handleResend} loading={loading} className="w-full">
            Resend verification email
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};
