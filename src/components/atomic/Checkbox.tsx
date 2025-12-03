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
        <div className="w-4 h-4 border-[1.5px] border-border rounded bg-background peer-checked:bg-accent-primary peer-checked:border-accent-primary transition-all shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-accent-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background" />
        {icon && (
          <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
            {icon}
          </div>
        )}
      </div>
      <span className="text-sm text-muted group-hover:text-foreground transition-colors font-medium">
        {label}
      </span>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';