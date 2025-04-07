import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  category: string;
  variant?: "default" | "featured";
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  inStock,
  category,
  variant = "default",
}: ProductCardProps) => {
  const { addToCart, toggleLike, isLiked } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const liked = isLiked(id);
  
  const productUrl = `/product/${id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) {
      toast.error("Sorry, this product is out of stock");
      return;
    }
    
    const product = {
      id,
      name,
      price,
      image,
      inStock,
      category,
      description: "",
    };
    
    addToCart(product);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(id);
  };

  return (
    <Link to={productUrl} className="block group">
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl bg-background transition-all duration-300 card-hover",
          variant === "featured" ? "aspect-[4/5]" : "aspect-[3/4]"
        )}
      >
        {/* Product Image */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={image}
            alt={name}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
              imageLoaded ? "image-loaded" : "image-fade-in"
            )}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full bg-white hover:bg-white/90 text-primary"
              onClick={handleToggleLike}
              disabled={!inStock}
            >
              <Heart className={cn("h-4 w-4", liked ? "fill-primary text-primary" : "")} />
              <span className="sr-only">Like</span>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full bg-white hover:bg-white/90 text-primary"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Add to cart</span>
            </Button>
          </div>
          
          {/* Category badge */}
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 capitalize text-xs font-normal bg-white/80 backdrop-blur-sm"
          >
            {category}
          </Badge>
          
          {/* Stock status */}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <Badge variant="destructive" className="text-sm font-medium px-3 py-1">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-medium text-sm sm:text-base text-balance line-clamp-1">
          {name}
        </h3>
        <p className="font-semibold text-sm sm:text-base">
          {formatCurrency(price)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
