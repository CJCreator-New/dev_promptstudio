import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  className = ''
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className={`flex gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            className={`${sizes[size]} transition-all ${
              star <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};
