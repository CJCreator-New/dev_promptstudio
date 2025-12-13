import React, { useState, useEffect } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  initials?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-xl'
};

const cache = new Map<string, string>();

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  initials,
  className = ''
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    if (cache.has(src)) {
      setImageSrc(cache.get(src)!);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      cache.set(src, src);
      setImageSrc(src);
    };
    img.onerror = () => setHasError(true);
  }, [src]);

  const baseClasses = `${sizeClasses[size]} rounded-full overflow-hidden ${className}`;

  if (!src || hasError) {
    if (fallback) {
      return <img src={fallback} alt={alt} className={baseClasses} />;
    }
    return (
      <div className={`${baseClasses} bg-accent-primary text-white flex items-center justify-center font-semibold`}>
        {initials || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return imageSrc ? (
    <img src={imageSrc} alt={alt} className={baseClasses} />
  ) : (
    <div className={`${baseClasses} bg-slate-200 animate-pulse`} />
  );
};
