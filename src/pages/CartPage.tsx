
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import { ArrowLeft } from "lucide-react";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };
  
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      navigate("/checkout");
    }, 1000);
  };
  
  // Calculate subtotal and shipping
  const subtotal = getCartTotal();
  const shipping = subtotal >= 10000 || subtotal === 0 ? 0 : 499;
  const total = subtotal + shipping;
  
  return (
    <Layout>
      <div className="max-container py-12">
        <h1 className="text-3xl font-display font-bold mb-8">Your Cart</h1>
        
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="hidden sm:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <CartItem
                      key={item.product.id}
                      item={item}
                      onRemove={handleRemoveItem}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4 justify-between items-center mt-6">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-sm"
                  >
                    Clear Cart
                  </Button>
                  
                  <Button asChild variant="outline" className="text-sm">
                    <Link to="/products">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                isCheckingOut={isCheckingOut}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
