
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/context/StoreContext";
import { useAllProducts } from "@/hooks/useSupabaseProducts";

interface ProductGridProps {
  products: Product[];
  variant?: "default" | "featured";
  columns?: 2 | 3 | 4;
  useSupabaseProducts?: boolean;
}

const ProductGrid = ({ 
  products: propProducts, 
  variant = "default",
  columns = 3,
  useSupabaseProducts = false
}: ProductGridProps) => {
  // Fetch products from Supabase if requested, but disable by default
  const { data: supabaseProducts, isLoading } = useAllProducts();
  
  // Determine which products to display - prioritize prop products
  const products = useSupabaseProducts ? (supabaseProducts || []) : propProducts;
  
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (isLoading && useSupabaseProducts) {
    return (
      <div className="grid gap-6 md:gap-8" style={{ minHeight: '200px' }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="animate-pulse rounded-xl bg-gray-200 h-64"
          ></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 md:gap-8`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          inStock={product.inStock}
          category={product.category}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
