import React from 'react';
import { X } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div className="w-full max-w-md bg-slate-800 border border-slate-600 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  </div>
);
