import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  characterCount?: boolean;
}

export const Textarea: React.FC<TextareaProps> = React.memo(({ 
  label,
  error,
  helperText,
  characterCount = false,
  className = '',
  id,
  value,
  ...props 
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
  
  const textareaClasses = `input-base rounded-xl p-4 placeholder-slate-600 resize-none font-mono leading-relaxed ${
    error ? 'input-error' : 'input-valid'
  } ${className}`;
  
  const charCount = typeof value === 'string' ? value.length : 0;
  
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between items-center">
          <label 
            htmlFor={textareaId}
            className="text-xs font-medium text-secondary uppercase tracking-wider"
          >
            {label}
          </label>
          {characterCount && (
            <span className="text-slate-500 text-xs" aria-live="polite" aria-atomic="true">
              {charCount} chars
            </span>
          )}
        </div>
      )}
      
      <textarea
        id={textareaId}
        className={textareaClasses}
        value={value}
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

Textarea.displayName = 'Textarea';