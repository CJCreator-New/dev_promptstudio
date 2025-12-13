import React, { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill';
  className?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  srcSet,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  loading = 'lazy',
  aspectRatio = 'auto',
  objectFit = 'cover',
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectRatioClass = aspectRatio !== 'auto' ? `aspect-[${aspectRatio}]` : '';
  const objectFitClass = `object-${objectFit}`;

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full ${objectFitClass} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

interface PictureProps {
  sources: Array<{ srcSet: string; media?: string; type?: string }>;
  fallback: string;
  alt: string;
  className?: string;
}

export const Picture: React.FC<PictureProps> = ({ sources, fallback, alt, className = '' }) => {
  return (
    <picture>
      {sources.map((source, idx) => (
        <source key={idx} srcSet={source.srcSet} media={source.media} type={source.type} />
      ))}
      <img src={fallback} alt={alt} className={className} />
    </picture>
  );
};
