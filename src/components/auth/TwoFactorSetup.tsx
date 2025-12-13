import React, { useState } from 'react';
import { Shield, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AuthLayout } from './AuthLayout';

interface TwoFactorSetupProps {
  qrCode: string;
  secret: string;
  onVerify: (code: string) => Promise<void>;
  onSkip: () => void;
  onClose?: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  qrCode,
  secret,
  onVerify,
  onSkip,
  onClose
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      title="Enable two-factor authentication" 
      subtitle="Add an extra layer of security to your account"
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-blue-400 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="font-medium mb-1">Scan this QR code</p>
              <p className="text-slate-400">Use an authenticator app like Google Authenticator or Authy</p>
            </div>
          </div>
          
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-2">Or enter this code manually:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-slate-800 rounded text-sm text-slate-300 font-mono">
                {secret}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-slate-600 rounded transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} className="text-slate-400" />}
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Verification code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            required
          />

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Verify and enable
          </Button>

          <Button variant="ghost" onClick={onSkip} className="w-full">
            Skip for now
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};
