import React, { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AuthLayout } from './AuthLayout';

interface TwoFactorVerifyProps {
  onVerify: (code: string) => Promise<void>;
  onUseBackupCode: () => void;
  onBack: () => void;
  onClose?: () => void;
}

export const TwoFactorVerify: React.FC<TwoFactorVerifyProps> = ({
  onVerify,
  onUseBackupCode,
  onBack,
  onClose
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onVerify(code);
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Two-factor authentication" 
      subtitle="Enter the code from your authenticator app"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Shield size={32} className="text-blue-400" />
          </div>
        </div>

        <Input
          label="Authentication code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          className="text-center text-2xl tracking-widest"
          required
          autoFocus
        />

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Verify
        </Button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={onUseBackupCode}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Use backup code instead
          </button>
          <button
            type="button"
            onClick={onBack}
            className="block w-full text-sm text-slate-400 hover:text-slate-300"
          >
            Back to sign in
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
