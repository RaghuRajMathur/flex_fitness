
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import LazyImage from "@/components/LazyImage";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Tables } from "@/integrations/supabase/types";

// Define Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

type CheckoutStep = "shipping" | "payment" | "confirmation";

// Interface for shipping address
interface ShippingAddress {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  
  // Calculate order details
  const subtotal = getCartTotal();
  const shipping = subtotal >= 100 ? 0 : 8.95;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
      console.log('Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast({
        title: "Payment Error",
        description: "Failed to load payment gateway. Please try again.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateShippingForm = () => {
    const requiredFields = [
      "firstName", "lastName", "email", "address", "city", "state", "zipCode"
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Missing Information",
          description: `Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateShippingForm()) {
      setCurrentStep("payment");
      window.scrollTo(0, 0);
    }
  };
  
  const saveShippingAddress = async () => {
    try {
      // Use direct SQL function call to insert shipping address
      const { data, error } = await supabase.rpc('create_shipping_address', {
        p_user_id: user?.id,
        p_first_name: formData.firstName,
        p_last_name: formData.lastName,
        p_email: formData.email,
        p_phone: formData.phone || null,
        p_address: formData.address,
        p_city: formData.city,
        p_state: formData.state,
        p_zip_code: formData.zipCode
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error saving shipping address:', error);
      throw error;
    }
  };
  
  const saveOrder = async (paymentId: string = '', paymentMethod: string) => {
    try {
      // First save the shipping address
      const shippingAddressId = await saveShippingAddress();
      
      // Explicitly type the order insert data
      const orderData = {
        user_id: user?.id,
        total: total,
        status: paymentMethod === 'cod' ? 'pending' : 'processing',
        payment_id: paymentId || null,
        payment_method: paymentMethod,
        shipping_address_id: shippingAddressId
      };
      
      // Insert order
      const { data: insertedOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Prepare order items with correct type
      const orderItems = cart.map(item => ({
        order_id: insertedOrder.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      // Insert order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      setOrderId(insertedOrder.id);
      return insertedOrder.id;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };
  
  const handleRazorpayPayment = () => {
    if (!razorpayLoaded) {
      toast({
        title: "Payment Gateway Loading",
        description: "Payment gateway is still loading. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Create Razorpay order object
    const options = {
      key: 'rzp_test_Kl07zihGae5UHe', // Using the provided test key
      amount: Math.round(total * 100), // Amount in paisa (multiply by 100)
      currency: 'INR',
      name: 'FitFlex',
      description: 'Purchase from FitFlex store',
      image: 'https://your-logo-url.com/logo.png', // Replace with your logo URL
      handler: async function(response: any) {
        try {
          // Payment successful
          console.log('Payment successful:', response);
          
          // Save order to database
          await saveOrder(response.razorpay_payment_id, 'razorpay');
          
          // Process order
          processOrder(response.razorpay_payment_id);
          
          toast({
            title: "Payment Successful",
            description: "Your payment was processed successfully!",
          });
        } catch (error) {
          console.error('Error processing order:', error);
          setIsProcessing(false);
          toast({
            title: "Order Error",
            description: "There was an error processing your order. Please try again.",
            variant: "destructive",
          });
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone || ''
      },
      notes: {
        address: formData.address
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "Your payment was cancelled.",
            variant: "destructive",
          });
        }
      }
    };
    
    try {
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: "Payment gateway error. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const processOrder = async (paymentId: string = '') => {
    try {
      // If paying with COD, save the order now
      if (paymentMethod === 'cod' && !orderId) {
        await saveOrder('', 'cod');
      }
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep("confirmation");
        clearCart();
        window.scrollTo(0, 0);
        
        toast({
          title: "Order Placed",
          description: "Your order has been placed successfully!",
        });
      }, 1000);
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
      toast({
        title: "Order Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      // Cash on delivery
      setIsProcessing(true);
      processOrder();
    }
  };
  
  const handleBackToShopping = () => {
    navigate("/");
  };
  
  // Redirect if cart is empty (except in confirmation step)
  if (cart.length === 0 && currentStep !== "confirmation") {
    navigate("/cart");
    return null;
  }
  
  // Format currency for display in rupees (₹)
  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };
  
  return (
    <Layout>
      <div className="max-container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-4">Checkout</h1>
          
          {/* Checkout Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-full max-w-3xl grid grid-cols-3 gap-4">
              <div className={`text-center relative ${currentStep === "shipping" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-2 border ${currentStep === "shipping" ? "border-primary bg-primary/10" : "border-border"}`}>
                  1
                </div>
                <span className="text-sm">Shipping</span>
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-border -z-10" />
              </div>
              
              <div className={`text-center relative ${currentStep === "payment" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-2 border ${currentStep === "payment" ? "border-primary bg-primary/10" : "border-border"}`}>
                  2
                </div>
                <span className="text-sm">Payment</span>
                <div className="absolute top-4 left-0 w-full h-0.5 bg-border -z-10" />
              </div>
              
              <div className={`text-center relative ${currentStep === "confirmation" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-2 border ${currentStep === "confirmation" ? "border-primary bg-primary/10" : "border-border"}`}>
                  3
                </div>
                <span className="text-sm">Confirmation</span>
                <div className="absolute top-4 right-1/2 w-full h-0.5 bg-border -z-10" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                
                <form onSubmit={handleContinueToPayment}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Postal Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </div>
            )}
            
            {currentStep === "payment" && (
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                
                <form onSubmit={handlePlaceOrder}>
                  <div className="mb-6">
                    <div 
                      className={`flex items-center p-4 border rounded-lg mb-4 cursor-pointer ${paymentMethod === 'razorpay' ? 'border-primary' : 'border-border'}`}
                      onClick={() => setPaymentMethod('razorpay')}
                    >
                      <input
                        type="radio"
                        id="razorpay"
                        name="paymentMethod"
                        className="h-4 w-4 text-primary"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                      />
                      <label htmlFor="razorpay" className="ml-2 flex items-center cursor-pointer">
                        <span className="font-medium mr-2">Pay with Razorpay</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Test Mode</span>
                      </label>
                    </div>
                    
                    <div 
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-primary' : 'border-border'}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <input
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        className="h-4 w-4 text-primary"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <label htmlFor="cod" className="ml-2 flex items-center cursor-pointer">
                        <span className="font-medium">Cash on Delivery</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg mb-6">
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        By clicking "Place Order," you agree to our:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Terms of Service</li>
                        <li>Privacy Policy</li>
                        <li>Return Policy</li>
                      </ul>
                      {paymentMethod === 'razorpay' && (
                        <p className="mt-2 text-xs bg-yellow-50 p-2 rounded border border-yellow-200 text-yellow-800">
                          <strong>Test Mode Notice:</strong> This is a test payment. No actual charges will be made. Use test card number 4111 1111 1111 1111, any future expiry date, any CVV, and any OTP for testing.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setCurrentStep("shipping")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isProcessing || (paymentMethod === 'razorpay' && !razorpayLoaded)}
                    >
                      {isProcessing ? "Processing..." : `Place Order${paymentMethod === 'razorpay' ? ' & Pay' : ''}`}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {currentStep === "confirmation" && (
              <div className="bg-card rounded-xl border shadow-sm p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-2">
                  Thank You for Your Order!
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Your order has been placed successfully.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-6 mx-auto max-w-md">
                  <div className="text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Order Number:</span>
                      <span className="text-muted-foreground">
                        #{orderId ? orderId.substring(0, 8) : Math.floor(100000 + Math.random() * 900000)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Date:</span>
                      <span className="text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span className="text-muted-foreground">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="text-muted-foreground">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-8">
                  A confirmation email has been sent to {formData.email}.
                  You can track your order status in your account.
                </p>
                
                <Button onClick={handleBackToShopping}>
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-2">
                {(currentStep === "confirmation" ? [] : cart).map((item) => (
                  <div key={item.product.id} className="flex items-start py-2">
                    <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      <LazyImage
                        src={item.product.image}
                        alt={item.product.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2">
                        {item.product.name}
                      </h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Qty: {item.quantity}
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              {/* Totals */}
              <div className="space-y-2 text-sm">
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
