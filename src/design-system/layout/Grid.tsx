import React, { ReactNode } from 'react';

interface GridProps {
  children: ReactNode;
  cols?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number | { xs?: number; sm?: number; md?: number; lg?: number };
  className?: string;
}

export const Grid: React.FC<GridProps> = ({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = '' 
}) => {
  const gapValue = typeof gap === 'number' ? gap : gap.xs || 4;
  
  const gridClasses = [
    'grid',
    `grid-cols-${cols.xs || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-${gapValue}`,
    typeof gap === 'object' && gap.sm && `sm:gap-${gap.sm}`,
    typeof gap === 'object' && gap.md && `md:gap-${gap.md}`,
    typeof gap === 'object' && gap.lg && `lg:gap-${gap.lg}`,
    className
  ].filter(Boolean).join(' ');

  return <div className={gridClasses}>{children}</div>;
};

interface ContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = 'xl',
  padding = true,
  className = '' 
}) => {
  const maxWidthClass = maxWidth === 'full' ? 'w-full' : `max-w-${maxWidth}`;
  const paddingClass = padding ? 'px-4 sm:px-6 lg:px-8' : '';
  
  return (
    <div className={`${maxWidthClass} ${paddingClass} mx-auto ${className}`}>
      {children}
    </div>
  );
};

interface StackProps {
  children: ReactNode;
  direction?: 'row' | 'col';
  responsive?: { xs?: 'row' | 'col'; sm?: 'row' | 'col'; md?: 'row' | 'col'; lg?: 'row' | 'col' };
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  className?: string;
}

export const Stack: React.FC<StackProps> = ({ 
  children, 
  direction = 'col',
  responsive,
  gap = 4,
  align = 'stretch',
  justify = 'start',
  className = '' 
}) => {
  const flexDirection = responsive 
    ? [
        `flex-${responsive.xs || direction}`,
        responsive.sm && `sm:flex-${responsive.sm}`,
        responsive.md && `md:flex-${responsive.md}`,
        responsive.lg && `lg:flex-${responsive.lg}`,
      ].filter(Boolean).join(' ')
    : `flex-${direction}`;

  const alignClass = `items-${align}`;
  const justifyClass = `justify-${justify}`;

  return (
    <div className={`flex ${flexDirection} ${alignClass} ${justifyClass} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};
