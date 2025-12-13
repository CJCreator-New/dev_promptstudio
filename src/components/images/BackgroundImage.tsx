import React, { useState, useEffect, ReactNode } from 'react';

interface BackgroundImageProps {
  src: string;
  alt?: string;
  children?: ReactNode;
  overlay?: boolean;
  parallax?: boolean;
  className?: string;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  src,
  alt = '',
  children,
  overlay = false,
  parallax = false,
  className = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  useEffect(() => {
    if (!parallax) return;

    const handleScroll = () => {
      setOffset(window.pageYOffset * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallax]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoaded ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-100"
          style={{
            backgroundImage: `url(${src})`,
            transform: parallax ? `translateY(${offset}px)` : undefined
          }}
          role="img"
          aria-label={alt}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
      {overlay && <div className="absolute inset-0 bg-black/40" />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
