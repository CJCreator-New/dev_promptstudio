import React, { useState, useEffect, useRef } from 'react';

interface BaseImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  srcSet?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

export const BaseImage: React.FC<BaseImageProps> = ({
  src,
  alt,
  width,
  height,
  srcSet,
  sizes = '100vw',
  loading = 'lazy',
  priority = false,
  onLoad,
  onError,
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority && imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={`bg-slate-200 flex items-center justify-center ${className}`}>
        <span className="text-slate-500 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
};
