import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  icon,
  children,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white focus:ring-indigo-500 shadow-sm hover:shadow-md',
    secondary: 'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 focus:ring-slate-600 border border-slate-700',
    ghost: 'hover:bg-slate-800/50 active:bg-slate-800 text-slate-300 focus:ring-slate-700',
    danger: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    
    onClick?.(e);
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        isPressed ? 'scale-95' : 'scale-100'
      } ${success ? 'animate-button-success' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {success && <Check className="w-4 h-4 animate-field-success" />}
      {!loading && !success && icon}
      <span>{children}</span>
    </button>
  );
};
