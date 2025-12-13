import React, { useState, useEffect, useRef } from 'react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  thumbnail?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  columns?: { xs?: number; sm?: number; md?: number; lg?: number };
  gap?: number;
  pageSize?: number;
  onImageClick?: (image: GalleryImage) => void;
  className?: string;
}

export const Gallery: React.FC<GalleryProps> = ({
  images,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  pageSize = 12,
  onImageClick,
  className = ''
}) => {
  const [page, setPage] = useState(1);
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleImages((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { rootMargin: '50px' }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const displayedImages = images.slice(0, page * pageSize);
  const hasMore = displayedImages.length < images.length;

  const gridClasses = [
    'grid',
    `grid-cols-${columns.xs || 1}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    `gap-${gap}`
  ].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <div className={gridClasses}>
        {displayedImages.map((image) => (
          <div
            key={image.id}
            id={image.id}
            ref={(el) => el && observerRef.current?.observe(el)}
            className="relative aspect-square overflow-hidden rounded-lg bg-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageClick?.(image)}
          >
            {visibleImages.has(image.id) && (
              <img
                src={image.thumbnail || image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="mt-6 mx-auto block px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-hover transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
};
