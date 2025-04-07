
import React, { useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { useSeedProducts, useAllProducts } from '@/hooks/useSupabaseProducts';

const SupabaseInitializer: React.FC = () => {
  const { products } = useStore();
  const { seedProducts, isSeedComplete } = useSeedProducts();
  
  // Skip Supabase product loading to avoid errors
  // const { data: supabaseProducts } = useAllProducts();

  // Ensure we have products data available from the store
  useEffect(() => {
    console.log("Store products available:", products.length);
  }, [products]);

  return null; // This component doesn't render anything
};

export default SupabaseInitializer;
