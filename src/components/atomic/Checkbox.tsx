import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  icon?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = React.memo(({ 
  label,
  icon,
  className = '',
  id,
  ...props 
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <label className={`flex items-center space-x-2 cursor-pointer group ${className}`}>
      <div className="relative">
        <input 
          type="checkbox"
          id={checkboxId}
          className="peer sr-only"
          {...props}
        />
        <div className="w-4 h-4 border border-slate-600 rounded bg-slate-800 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900" />
        {icon && (
          <div className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100">
            {icon}
          </div>
        )}
      </div>
      <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
        {label}
      </span>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';