
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRatingProps {
  rating: number;
  reviews: number;
}

const ProductRating: React.FC<ProductRatingProps> = ({ rating, reviews }) => {
  return (
    <div className="flex items-center space-x-1 mt-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-5 w-5",
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : i < Math.ceil(rating) 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
          )}
        />
      ))}
      <span className="text-sm font-medium text-muted-foreground ml-2">
        ({reviews} reviews)
      </span>
    </div>
  );
};

export default ProductRating;
