import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1
}) => {
  const baseStyles = 'skeleton bg-slate-800 animate-pulse';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined)
  };

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton layouts
export const SkeletonCard: React.FC = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </div>
    </div>
    <Skeleton count={3} />
  </div>
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" />
          <Skeleton width="40%" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        width={i === lines - 1 ? '60%' : '100%'} 
      />
    ))}
  </div>
);
