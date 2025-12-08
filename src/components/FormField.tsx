import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'url' | 'tel' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  validationRules?: ValidationRule[];
  helpText?: string;
  autoComplete?: string;
  maxLength?: number;
  pattern?: string;
  formatMask?: (value: string) => string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  validationRules = [],
  helpText,
  autoComplete,
  maxLength,
  pattern,
  formatMask
}) => {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!touched) return;

    // Required validation
    if (required && !value.trim()) {
      setError(`${label} is required`);
      setIsValid(false);
      return;
    }

    // Custom validation rules
    for (const rule of validationRules) {
      if (!rule.validate(value)) {
        setError(rule.message);
        setIsValid(false);
        return;
      }
    }

    setError(null);
    setIsValid(value.trim().length > 0);
  }, [value, touched, required, label, validationRules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Apply format mask if provided
    if (formatMask) {
      newValue = formatMask(newValue);
    }
    
    onChange(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-200"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {helpText && (
        <div 
          id={helpId}
          className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/50 rounded-lg p-2 border border-slate-800"
        >
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          pattern={pattern}
          required={required}
          aria-invalid={touched && !!error}
          aria-describedby={`${helpText ? helpId : ''} ${error ? errorId : ''}`.trim()}
          className={`w-full px-4 py-2.5 bg-slate-900 border rounded-lg text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
            touched && error
              ? 'border-red-500/50 focus:ring-red-500/20'
              : touched && isValid
              ? 'border-green-500/50 focus:ring-green-500/20'
              : 'border-slate-700 focus:ring-indigo-500/20'
          }`}
        />
        
        {touched && (error || isValid) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
        )}
      </div>

      {touched && error && (
        <div 
          id={errorId}
          className="flex items-center gap-1.5 text-red-400 text-xs animate-in slide-in-from-top-1 fade-in duration-200"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {maxLength && (
        <div className="text-xs text-slate-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

// Common validation rules
export const validationRules = {
  email: {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  url: {
    validate: (value: string) => /^https?:\/\/.+\..+/.test(value),
    message: 'Please enter a valid URL (e.g., https://example.com)'
  },
  minLength: (min: number) => ({
    validate: (value: string) => value.length >= min,
    message: `Must be at least ${min} characters`
  }),
  maxLength: (max: number) => ({
    validate: (value: string) => value.length <= max,
    message: `Must be no more than ${max} characters`
  })
};

// Format masks
export const formatMasks = {
  phone: (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return value;
  },
  creditCard: (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  }
};
