import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: Toast['type'], message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast['type'], message: string, duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, type, message, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => hideToast(id), duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 250);
  };

  const config = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      iconColor: 'text-green-400'
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      iconColor: 'text-blue-400'
    }
  };

  const { icon: Icon, bg, border, text, iconColor } = config[toast.type];

  return (
    <div
      className={`
        ${bg} ${border} border backdrop-blur-sm rounded-lg shadow-lg p-4
        flex items-start gap-3 min-w-[320px]
        ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}
      `}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm ${text}`}>{toast.message}</p>
      <button
        onClick={handleClose}
        className="text-slate-400 hover:text-white transition-colors p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-white/20"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
