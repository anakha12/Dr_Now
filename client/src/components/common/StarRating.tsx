import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRatingChange,
  size = 24,
  readonly = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;

        return (
          <button
            key={starValue}
            type="button"
            disabled={readonly}
            className={`transition-all duration-200 ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } ${isFilled ? "text-yellow-400" : "text-gray-300"}`}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(null)}
            onClick={() => !readonly && onRatingChange?.(starValue)}
          >
            <Star
              size={size}
              fill={isFilled ? "currentColor" : "none"}
              className={isFilled ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" : ""}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
