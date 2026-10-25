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
    <div className="inline-flex items-center gap-2 select-none">
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
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform focus:outline-none`}
              aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                className={`${iconSizes[size]} ${
                  isFilled
                    ? 'fill-[#ff9500] dark:fill-[#ffd60a] text-[#ff9500] dark:text-[#ffd60a]'
                    : 'fill-black/[0.08] dark:fill-white/[0.1] text-black/[0.1] dark:text-white/[0.15]'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showCount && (
        <span className="text-[14px] sm:text-[15px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {reviewCount !== undefined && (
            <span className="font-normal text-[#86868b] dark:text-[#98989d] ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
