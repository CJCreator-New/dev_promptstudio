import React, { useState } from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  priority?: boolean;
  aspectRatio?: string;
  overlay?: boolean;
  className?: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({
  src,
  alt,
  srcSet,
  sizes = '100vw',
  priority = true,
  aspectRatio = '16/9',
  overlay = false,
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      )}
    </div>
  );
};
