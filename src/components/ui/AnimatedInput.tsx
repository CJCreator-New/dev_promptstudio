import React, { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  onChange?: (value: string) => void;
  onValidate?: (value: string) => boolean;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  success,
  helperText,
  onChange,
  onValidate,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 300);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHasValue(value.length > 0);
    onChange?.(value);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium transition-colors duration-200 ${
          isFocused ? 'text-indigo-400' : 'text-slate-300'
        }`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          {...props}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-white
            placeholder-slate-500 transition-all duration-200
            focus:outline-none focus:ring-2
            ${error 
              ? 'border-red-500/50 focus:ring-red-500/20 animate-field-error' 
              : success
              ? 'border-green-500/50 focus:ring-green-500/20'
              : 'border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
            }
            ${className}
          `}
        />
        
        {/* Status Icons */}
        {(error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error && (
              <AlertCircle className="w-4 h-4 text-red-400 animate-fade-in" />
            )}
            {success && (
              <Check className="w-4 h-4 text-green-400 animate-field-success" />
            )}
          </div>
        )}
      </div>

      {/* Helper/Error Text */}
      {(helperText || error) && (
        <div className={`text-xs transition-colors duration-200 ${
          error ? 'text-red-400 animate-slide-down' : 'text-slate-400'
        }`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

interface AnimatedTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
  showCount?: boolean;
  maxLength?: number;
}

export const AnimatedTextarea: React.FC<AnimatedTextareaProps> = ({
  label,
  error,
  helperText,
  onChange,
  showCount,
  maxLength,
  className = '',
  value = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = String(value).length;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium transition-colors duration-200 ${
            isFocused ? 'text-indigo-400' : 'text-slate-300'
          }`}>
            {label}
          </label>
          {showCount && maxLength && (
            <span className={`text-xs transition-colors duration-200 ${
              charCount > maxLength * 0.9 ? 'text-yellow-400' : 'text-slate-500'
            }`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
      
      <textarea
        {...props}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-4 py-3 bg-slate-900 border rounded-lg text-white
          placeholder-slate-500 transition-all duration-200 resize-none
          focus:outline-none focus:ring-2
          ${error 
            ? 'border-red-500/50 focus:ring-red-500/20' 
            : 'border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500'
          }
          ${className}
        `}
      />

      {(helperText || error) && (
        <div className={`text-xs transition-colors duration-200 ${
          error ? 'text-red-400' : 'text-slate-400'
        }`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};
