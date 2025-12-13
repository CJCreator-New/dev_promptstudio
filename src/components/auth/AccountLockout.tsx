import React from 'react';
import { ShieldAlert, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { AuthLayout } from './AuthLayout';

interface AccountLockoutProps {
  remainingTime: number;
  attempts: number;
  maxAttempts: number;
  onContactSupport: () => void;
  onClose?: () => void;
}

export const AccountLockout: React.FC<AccountLockoutProps> = ({
  remainingTime,
  attempts,
  maxAttempts,
  onContactSupport,
  onClose
}) => {
  const minutes = Math.ceil(remainingTime / 60);

  return (
    <AuthLayout title="Account temporarily locked" onClose={onClose}>
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <ShieldAlert size={32} className="text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-slate-300">
            Your account has been temporarily locked due to multiple failed login attempts.
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Clock size={16} />
            <span className="text-sm">
              Try again in <strong className="text-white">{minutes} minute{minutes !== 1 ? 's' : ''}</strong>
            </span>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 space-y-2 text-left">
          <p className="text-sm font-medium text-slate-300">Security Information</p>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Failed attempts: {attempts} of {maxAttempts}</li>
            <li>• Lockout duration: {minutes} minutes</li>
            <li>• This protects your account from unauthorized access</li>
          </ul>
        </div>

        <div className="pt-2 space-y-2">
          <p className="text-sm text-slate-400">
            If you're having trouble accessing your account:
          </p>
          <Button variant="ghost" onClick={onContactSupport} className="w-full">
            Contact support
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};
