
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  isCheckingOut: boolean;
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal, 
  shipping, 
  total,
  isCheckingOut,
  onCheckout
}) => {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shipping === 0 ? "Free" : formatCurrency(shipping)}
          </span>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between font-medium text-base">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      
      <Button
        className="w-full mt-6"
        onClick={onCheckout}
        disabled={subtotal === 0 || isCheckingOut}
      >
        {isCheckingOut ? "Processing..." : "Checkout"}
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
      
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Taxes calculated at checkout
      </div>
    </div>
  );
};

export default CartSummary;
