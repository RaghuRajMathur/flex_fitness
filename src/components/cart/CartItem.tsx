
import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CartItem as CartItemType } from "@/context/StoreContext";
import LazyImage from "@/components/LazyImage";
import QuantitySelector from "@/components/QuantitySelector";

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 border-b last:border-0 items-center">
      {/* Product */}
      <div className="col-span-1 sm:col-span-6 flex items-center space-x-4">
        <div className="relative w-16 h-16 bg-secondary rounded-md overflow-hidden flex-shrink-0">
          <LazyImage src={item.product.image} alt={item.product.name} />
        </div>
        <div className="flex-1 min-w-0">
          <Link
            to={`/product/${item.product.id}`}
            className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
          >
            {item.product.name}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-destructive text-xs"
            onClick={() => onRemove(item.product.id)}
          >
            <X className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>
      </div>
      
      {/* Price */}
      <div className="col-span-1 sm:col-span-2 text-left sm:text-center">
        <div className="sm:hidden inline-block text-sm text-muted-foreground mr-2">Price:</div>
        <div className="inline-block sm:block">{formatCurrency(item.product.price)}</div>
      </div>
      
      {/* Quantity */}
      <div className="col-span-1 sm:col-span-2 text-left sm:text-center">
        <div className="sm:hidden text-sm text-muted-foreground mb-2">Quantity:</div>
        <div className="inline-block sm:flex sm:justify-center">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(quantity) => onUpdateQuantity(item.product.id, quantity)}
            max={10}
          />
        </div>
      </div>
      
      {/* Total */}
      <div className="col-span-1 sm:col-span-2 text-left sm:text-center font-medium">
        <div className="sm:hidden inline-block text-sm text-muted-foreground mr-2">Total:</div>
        <div className="inline-block sm:block">
          {formatCurrency(item.product.price * item.quantity)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
