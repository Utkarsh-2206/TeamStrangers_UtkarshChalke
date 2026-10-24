import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  totalStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showCount?: boolean;
  reviewCount?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showCount = false,
  reviewCount,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: totalStars }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(displayRating);

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'} focus:outline-none`}
              aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                className={`${iconSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-100 text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showCount && (
        <span className="text-xs font-semibold text-slate-700">
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {reviewCount !== undefined && (
            <span className="font-normal text-slate-500 ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
