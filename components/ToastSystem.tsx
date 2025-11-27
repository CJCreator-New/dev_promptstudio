import React from 'react';
import { Toaster, toast, Toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle, RefreshCcw, X } from 'lucide-react';

// Reusable styles for consistent branding
const TOAST_STYLES = {
  background: '#0f172a', // Slate 900
  color: '#e2e8f0',      // Slate 200
  border: '1px solid #1e293b', // Slate 800
  padding: '12px 16px',
  borderRadius: '12px',
  fontSize: '13px',
  maxWidth: '400px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
};

/**
 * Global Toast Configuration Component
 * Should be placed once at the root of the app
 */
export const AppToaster: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: TOAST_STYLES,
        duration: 4000,
        success: {
          iconTheme: {
            primary: '#8b5cf6', // Violet 500
            secondary: '#ffffff',
          },
          style: {
            ...TOAST_STYLES,
            borderLeft: '4px solid #8b5cf6',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444', // Red 500
            secondary: '#ffffff',
          },
          style: {
            ...TOAST_STYLES,
            borderLeft: '4px solid #ef4444',
            duration: 5000, // Errors stay slightly longer
          },
        },
        loading: {
            style: {
                ...TOAST_STYLES,
                borderLeft: '4px solid #3b82f6', // Blue 500
            }
        }
      }}
    />
  );
};

/**
 * Shows an error toast with a Retry button
 */
export const showErrorWithRetry = (message: string, onRetry: () => void) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-slate-900 shadow-lg rounded-xl pointer-events-auto flex border border-slate-800 ring-1 ring-black ring-opacity-5 border-l-4 border-l-red-500`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">
              Action Failed
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {message}
            </p>
            <div className="mt-3 flex space-x-3">
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        onRetry();
                    }}
                    className="bg-slate-800 rounded-md text-sm font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <div className="flex items-center gap-1">
                        <RefreshCcw className="w-3 h-3" />
                        Try Again
                    </div>
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="bg-transparent rounded-md text-sm font-medium text-slate-500 hover:text-slate-400 focus:outline-none"
                >
                    Dismiss
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), { duration: 6000 });
};

/**
 * Helper for simple success messages
 */
export const notifySuccess = (message: string) => {
    toast.success(message);
};

/**
 * Helper for simple error messages
 */
export const notifyError = (message: string) => {
    toast.error(message);
};

/**
 * Helper for configuration changes (Info style)
 */
export const notifyConfigChange = (message: string) => {
    toast(message, {
        icon: '⚙️',
        style: {
            ...TOAST_STYLES,
            borderLeft: '4px solid #64748b', // Slate 500
        }
    });
};

export { toast };