import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
}

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600',
  ghost: 'hover:bg-slate-700 text-slate-300 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px]',
  md: 'px-4 py-2 text-sm min-h-[40px]',
  lg: 'px-6 py-3 text-base min-h-[48px]'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && !loading && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};