
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductGrid from "@/components/ProductGrid";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

const SearchPage = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState(
    initialQuery 
      ? products.filter(product => 
          product.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(initialQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(initialQuery.toLowerCase())
        )
      : []
  );
  
  useEffect(() => {
    // Update URL when search query changes
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
    
    // Filter products based on search query
    if (searchQuery) {
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products, setSearchParams]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already performed in the useEffect hook
  };
  
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  return (
    <Layout>
      <div className="max-container py-12">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-6">
            Search Products
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pr-24 h-12 text-base"
            />
            
            <div className="absolute right-1 top-1 flex space-x-1">
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="h-10 w-10"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
              
              <Button type="submit" size="icon" className="h-10 w-10">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </form>
        </div>
        
        {searchQuery ? (
          <>
            <div className="mb-8">
              <p className="text-lg">
                {searchResults.length === 0 ? (
                  <span>No products found for "{searchQuery}"</span>
                ) : (
                  <span>
                    {searchResults.length} {searchResults.length === 1 ? "product" : "products"} found for "{searchQuery}"
                  </span>
                )}
              </p>
            </div>
            
            {searchResults.length > 0 ? (
              <ProductGrid products={searchResults} variant="default" columns={3} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or browse our categories to find what you're looking for.
                </p>
                <Button asChild>
                  <a href="/products">Browse All Products</a>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Enter a search term to find products.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">Popular Categories</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <a href="/category/strength">Strength Equipment</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/category/accessories">Accessories</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/category/electronics">Electronics</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/category/recovery">Recovery</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
