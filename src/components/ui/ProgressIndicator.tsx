import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  indeterminate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  indeterminate = false
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variants = {
    default: 'bg-indigo-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${sizes[size]}`}>
        {indeterminate ? (
          <div className="relative w-full h-full progress-indeterminate">
            <div className={`absolute inset-0 ${variants[variant]}`} />
          </div>
        ) : (
          <div
            className={`h-full ${variants[variant]} transition-all duration-300 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
      {showLabel && !indeterminate && (
        <div className="mt-1 text-xs text-slate-400 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div
      className={`${sizes[size]} border-slate-700 border-t-indigo-500 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface DotsLoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

export const DotsLoader: React.FC<DotsLoaderProps> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className="flex items-center gap-1" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizes[size]} bg-indigo-500 rounded-full animate-pulse`}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
