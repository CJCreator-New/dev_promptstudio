import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5', 
  lg: 'w-6 h-6'
};

export const Icon: React.FC<IconProps> = ({ 
  icon: IconComponent, 
  size = 'md', 
  className = '' 
}) => {
  return (
    <IconComponent 
      className={`${sizeMap[size]} ${className}`}
      aria-hidden="true"
    />
  );
};