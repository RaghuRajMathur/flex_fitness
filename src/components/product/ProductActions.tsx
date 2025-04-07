
import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/QuantitySelector";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  inStock: boolean;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  inStock,
  quantity,
  onQuantityChange,
  onAddToCart,
  isLiked,
  onToggleLike,
}) => {
  return (
    <div className="pt-4">
      <div className="flex items-center space-x-4 mb-8">
        <QuantitySelector
          quantity={quantity}
          onChange={onQuantityChange}
          max={10}
        />
        
        <Button
          onClick={onAddToCart}
          className="flex-1 h-12 text-base"
          disabled={!inStock}
          size="lg"
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full",
            isLiked && "text-primary border-primary"
          )}
          onClick={onToggleLike}
        >
          <Heart className={cn("h-5 w-5", isLiked && "fill-primary")} />
          <span className="sr-only">
            {isLiked ? "Remove from favorites" : "Add to favorites"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;
