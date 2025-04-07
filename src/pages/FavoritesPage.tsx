
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useStore } from "@/context/StoreContext";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const FavoritesPage = () => {
  const { products, liked } = useStore();
  
  const favoriteProducts = products.filter(product => liked.has(product.id));
  
  return (
    <Layout>
      <div className="max-container py-12">
        <h1 className="text-3xl font-display font-bold mb-4">Your Favorites</h1>
        <p className="text-muted-foreground mb-8">
          Your collection of favorite products.
        </p>
        
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-8">
              Items added to your favorites will appear here.
            </p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <ProductGrid products={favoriteProducts} variant="default" columns={3} />
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
