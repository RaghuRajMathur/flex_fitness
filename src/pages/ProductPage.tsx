
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useStore } from "@/context/StoreContext";
import { useProduct, useRelatedProducts } from "@/hooks/useSupabaseProducts";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import ProductImage from "@/components/product/ProductImage";
import ProductRating from "@/components/product/ProductRating";
import ProductActions from "@/components/product/ProductActions";
import ProductBenefits from "@/components/product/ProductBenefits";
import ProductTabs from "@/components/product/ProductTabs";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleLike, isLiked, addToCart, getProductById } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  // Try to get product from store context first
  const storeProduct = getProductById(id || "");
  
  // If we can't find it in the store, try to use the product from Supabase
  // but don't show loading/error states as we have storeProduct as fallback
  const { data: supabaseProduct } = useProduct(id || "");
  
  // Use store product as the source of truth, with Supabase as fallback
  const product = storeProduct || supabaseProduct;
  
  // Only fetch related products if we have a product
  const { data: relatedProducts = [] } = useRelatedProducts(
    product?.category || "", 
    id || ""
  );
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  if (!product) {
    return (
      <Layout>
        <div className="max-container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const liked = isLiked(product.id);
  
  const handleToggleLike = () => {
    toggleLike(product.id);
  };
  
  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error("Sorry, this product is out of stock");
      return;
    }
    
    addToCart(product, quantity);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };
  
  return (
    <Layout>
      <div className="max-container py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <ProductImage src={product.image} alt={product.name} />
          
          {/* Product Info */}
          <div className="space-y-6 bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm">
            <div>
              <Badge variant="secondary" className="capitalize mb-3 font-medium">
                {product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <ProductRating rating={product.rating} reviews={product.reviews || 0} />
              )}
            </div>
            
            {/* Price */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-3xl font-semibold text-gray-900">
                {formatCurrency(product.price)}
              </p>
              <p className={cn(
                "text-sm mt-2 font-medium",
                product.inStock ? "text-green-600" : "text-red-500"
              )}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
            
            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
            
            {/* Add to Cart */}
            <ProductActions
              inStock={product.inStock}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              isLiked={liked}
              onToggleLike={handleToggleLike}
            />
            
            {/* Benefits */}
            <ProductBenefits />
            
            {/* Product Details Tabs */}
            <ProductTabs specs={product.specs || {}} />
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              You might also like
            </h2>
            <ProductGrid products={relatedProducts} variant="default" columns={4} />
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
