import React from 'react';

interface Source {
  srcSet: string;
  media?: string;
  type?: string;
}

interface ArtDirectedImageProps {
  sources: Source[];
  fallbackSrc: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ArtDirectedImage: React.FC<ArtDirectedImageProps> = ({
  sources,
  fallbackSrc,
  alt,
  className = '',
  loading = 'lazy'
}) => {
  return (
    <picture>
      {sources.map((source, idx) => (
        <source
          key={idx}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
        />
      ))}
      <img
        src={fallbackSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        className={className}
      />
    </picture>
  );
};
