import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

const requirements = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character' }
];

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const passed = requirements.filter(r => r.test(password)).length;
  const strength = passed === 0 ? 0 : passed <= 2 ? 1 : passed <= 4 ? 2 : 3;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded ${i < strength ? colors[strength] : 'bg-slate-600'}`} />
        ))}
      </div>
      {password && <p className="text-xs text-slate-400">{labels[strength]}</p>}
      <ul className="space-y-1">
        {requirements.map((req, i) => {
          const met = req.test(password);
          return (
            <li key={i} className={`text-xs flex items-center gap-2 ${met ? 'text-green-400' : 'text-slate-500'}`}>
              {met ? <Check size={12} /> : <X size={12} />}
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
