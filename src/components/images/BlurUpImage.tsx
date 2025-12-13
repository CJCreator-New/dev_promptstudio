import React, { useState } from 'react';

interface BlurUpImageProps {
  src: string;
  placeholder: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
}

export const BlurUpImage: React.FC<BlurUpImageProps> = ({
  src,
  placeholder,
  alt,
  aspectRatio = 'auto',
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-md'
        }`}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`relative w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
