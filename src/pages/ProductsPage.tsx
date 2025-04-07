
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { FilterIcon, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

const ProductsPage = () => {
  const { getFilteredProducts, resetFilters } = useStore();
  const [products, setProducts] = useState(getFilteredProducts());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  // Update products when filters change
  useEffect(() => {
    let filteredProducts = getFilteredProducts();
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filteredProducts = [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
    
    setProducts(filteredProducts);
  }, [getFilteredProducts, searchQuery, sortOption]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Layout>
      <div className="max-container py-10">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-display font-bold tracking-tight">
            All Products
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-full sm:w-60"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
            
            {isMobile && (
              <Button onClick={toggleFilter} variant="outline" className="sm:hidden">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filters
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex">
          {/* Filter Sidebar */}
          {!isMobile && (
            <FilterSidebar isOpen={true} onClose={() => {}} />
          )}
          
          {/* Mobile Filter Sidebar */}
          {isMobile && (
            <FilterSidebar isOpen={isFilterOpen} onClose={closeFilter} isMobile={true} />
          )}
          
          {/* Products */}
          <div className="flex-1 ml-0 md:ml-8">
            {/* Here we use the store products by default, but we could switch to Supabase products if needed */}
            <ProductGrid products={products} columns={3} useSupabaseProducts={false} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
