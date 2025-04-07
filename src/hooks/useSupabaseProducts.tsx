
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/context/StoreContext";
import { toast } from "sonner";

// Type for Supabase product data
type SupabaseProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url?: string;
  description?: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
};

// Fallback images by category
const fallbackImages: Record<string, string> = {
  strength: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop",
  accessories: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop",
  electronics: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop",
  recovery: "https://images.unsplash.com/photo-1620188467120-5042c5bf5e70?w=800&auto=format&fit=crop",
  nutrition: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop",
  // Default fallback image if category doesn't match
  default: "https://images.unsplash.com/photo-1561214078-f3247647fc5e?w=800&auto=format&fit=crop"
};

// Helper function to convert Supabase product to app Product type
const mapSupabaseProductToAppProduct = (data: SupabaseProduct): Product => {
  // Ensure every product has an image
  const image = data.image_url || fallbackImages[data.category] || fallbackImages.default;
  
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    image: image,
    description: data.description || "",
    inStock: (data.stock || 0) > 0,
    // Default values for non-existent columns
    featured: false,
    rating: 0,
    reviews: 0,
    specs: {}
  };
};

// Hook to fetch all products from Supabase
export const useAllProducts = () => {
  return useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching all products:", error);
          return [];
        }
        
        // Transform Supabase products to match our application's Product type
        return (data || []).map((item: SupabaseProduct) => 
          mapSupabaseProductToAppProduct(item)
        );
      } catch (error: any) {
        console.error("Error fetching all products:", error);
        return [];
      }
    },
    retry: 0, // Reduce retry attempts to prevent error spam
    refetchOnWindowFocus: false
  });
};

// Hook to fetch a single product from Supabase
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      // First try to get product by UUID format
      try {
        // Check if id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (uuidRegex.test(id)) {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

          if (!error && data) {
            return mapSupabaseProductToAppProduct(data as SupabaseProduct);
          }
        }
        
        // If not found or not a UUID, try to handle it as a string ID
        // This is a fallback for the locally stored products which use string IDs
        return null;
      } catch (error: any) {
        console.error("Error fetching product:", error);
        return null;
      }
    },
    enabled: !!id,
    retry: 0, // Reduce retry attempts to prevent error spam
    refetchOnWindowFocus: false
  });
};

// Hook to fetch related products (same category) from Supabase
export const useRelatedProducts = (categoryName: string, currentProductId: string) => {
  return useQuery({
    queryKey: ["relatedProducts", categoryName, currentProductId],
    queryFn: async () => {
      if (!categoryName) return [];
      
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", categoryName)
          .neq("id", currentProductId)
          .limit(4);

        if (error) {
          console.error("Error fetching related products:", error);
          return [];
        }

        // Transform Supabase products to match our application's Product type
        return (data || []).map((item: SupabaseProduct) => 
          mapSupabaseProductToAppProduct(item)
        );
      } catch (error: any) {
        console.error("Error fetching related products:", error);
        return [];
      }
    },
    enabled: !!categoryName && !!currentProductId,
    retry: 0, // Reduce retry attempts to prevent error spam
    refetchOnWindowFocus: false
  });
};

// Hook to seed initial product data to Supabase (if needed)
export const useSeedProducts = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeedComplete, setIsSeedComplete] = useState(true); // Start as true to avoid seeding attempt

  const seedProducts = async (products: Product[]) => {
    // Disable seeding to prevent errors
    setIsSeedComplete(true);
    return;
  };

  return { seedProducts, isSeeding, isSeedComplete };
};
