import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = React.memo(({ 
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  ...props 
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText ? `${selectId}-helper` : undefined;
  
  const selectClasses = `input-base appearance-none ${
    error ? 'input-error' : 'input-valid'
  } ${className}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-xs font-medium text-secondary uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          className={selectClasses}
          aria-invalid={!!error}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
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

Select.displayName = 'Select';