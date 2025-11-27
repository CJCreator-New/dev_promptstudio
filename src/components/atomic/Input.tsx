import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = React.memo(({ 
  label,
  error,
  helperText,
  className = '',
  id,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  
  const inputClasses = `input-base ${
    error ? 'input-error' : 'input-valid'
  } ${className}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-xs font-medium text-secondary uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      
      {error && (
        <div id={errorId} className="text-red-400 text-xs" role="alert">
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={helperId} className="text-slate-500 text-xs">
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';