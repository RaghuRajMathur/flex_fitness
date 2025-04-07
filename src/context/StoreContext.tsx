import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  rating?: number;
  reviews?: number;
  specs?: Record<string, string>;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

type FilterOptions = {
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean | null;
};

type StoreContextType = {
  products: Product[];
  cart: CartItem[];
  liked: Set<string>;
  filters: FilterOptions;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleLike: (productId: string) => void;
  isLiked: (productId: string) => boolean;
  getLikedCount: () => number;
  getCartTotal: () => number;
  getCartCount: () => number;
  applyFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  getFilteredProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  getFeaturedProducts: () => Product[];
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

type StoreProviderProps = {
  children: ReactNode;
};

// Adjust initial product prices (converting from USD to INR, approximate rate)
const initialProducts: Product[] = [
  {
    id: "barbell-olympic",
    name: "Olympic Barbell",
    category: "strength",
    price: 16499, // Converted from $199.99
    image: "https://plus.unsplash.com/premium_photo-1663039954821-85f983368878?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Professional-grade Olympic barbell, perfect for serious lifters. 20kg weight, 7.2ft length with knurled grip for maximum performance.",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 124,
    specs: {
      "Weight": "20kg",
      "Length": "7.2ft",
      "Max Load": "680kg",
      "Material": "Chrome-plated steel",
    }
  },
  {
    id: "kettlebell-16kg",
    name: "Cast Iron Kettlebell 16kg",
    category: "strength",
    price: 4999, // Converted from $59.99
    image: "https://media.istockphoto.com/id/1296095821/photo/black-metal-kettlebell-16-kg-covered-with-rubber-on-the-floor-home-workout-background.jpg?s=1024x1024&w=is&k=20&c=MOiwvnS2AJQLyZm3JyPkA5kcU8PeU5rh918_1AEM0Hs=",
    description: "Premium cast iron kettlebell with a comfortable grip. Perfect for swings, squats, and other kettlebell exercises.",
    inStock: true,
    rating: 4.7,
    reviews: 89,
    specs: {
      "Weight": "16kg",
      "Material": "Cast iron",
      "Handle": "Ergonomic grip",
      "Base": "Flat bottom design"
    }
  },
  {
    id: "dumbbell-set",
    name: "Adjustable Dumbbell Set",
    category: "strength",
    price: 24999, // Converted from $299.99
    image: "https://media.istockphoto.com/id/116025330/photo/black-dumb-bell-used-for-working-out-and-getting-fit.jpg?s=2048x2048&w=is&k=20&c=IDkPGdIsJG74n6v-36S6cyNx_GQZzHShBS2hC3Edn6k=",
    description: "Versatile adjustable dumbbell set that replaces 15 pairs of weights. Adjust weight from 5 to 52.5 pounds with the twist of a dial.",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 215,
    specs: {
      "Weight Range": "5-52.5 lbs each",
      "Increments": "2.5 lbs",
      "Dimensions": "16.5\"L x 8\"W x 9\"H",
      "Storage": "Includes storage trays"
    }
  },
  {
    id: "resistance-bands",
    name: "Premium Resistance Bands Set",
    category: "accessories",
    price: 29.99,
    image: "https://plus.unsplash.com/premium_photo-1672280783587-fc8f0e196a37?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Complete set of 5 resistance bands ranging from light to heavy resistance. Perfect for home workouts, rehabilitation, or travel.",
    inStock: true,
    rating: 4.6,
    reviews: 156,
    specs: {
      "Resistance Levels": "5 (10-50 lbs)",
      "Material": "Natural latex",
      "Handles": "Foam grip handles",
      "Accessories": "Door anchor, ankle straps"
    }
  },
  {
    id: "yoga-mat",
    name: "Premium Yoga Mat",
    category: "accessories",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop",
    description: "Extra thick, non-slip yoga mat with alignment lines. Perfect for yoga, pilates, and general fitness routines.",
    inStock: true,
    rating: 4.7,
    reviews: 183,
    specs: {
      "Thickness": "6mm",
      "Material": "Eco-friendly TPE",
      "Size": "72\" x 26\"",
      "Features": "Alignment lines, non-slip surface"
    }
  },
  {
    id: "fitness-tracker",
    name: "Advanced Fitness Tracker",
    category: "electronics",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop",
    description: "Track your workouts, heart rate, sleep, and more with this advanced fitness tracker. Water-resistant with a 7-day battery life.",
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 208,
    specs: {
      "Battery Life": "7 days",
      "Water Resistance": "50m",
      "Display": "1.3\" color touchscreen",
      "Sensors": "Heart rate, accelerometer, GPS"
    }
  },
  {
    id: "protein-powder",
    name: "Whey Protein Powder",
    category: "nutrition",
    price: 49.99,
    image: "https://media.istockphoto.com/id/1369898014/photo/close-up-shot-of-bodybuilder-hands-taking-protein-powder-and-mixing-with-water-on-bottle-by.jpg?s=2048x2048&w=is&k=20&c=MdPtSsbED_7dqbpowCpByWft1G8-8CuPUx4eTrrU4ZI=",
    description: "Premium whey protein powder with 25g of protein per serving. Low in sugar and carbs, perfect for muscle recovery and growth.",
    inStock: true,
    rating: 4.6,
    reviews: 134,
    specs: {
      "Protein": "25g per serving",
      "Servings": "30",
      "Flavor": "Chocolate",
      "Additives": "No artificial sweeteners"
    }
  },
  {
    id: "foam-roller",
    name: "High-Density Foam Roller",
    category: "recovery",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1591741535585-9c4f52b3f13f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Professional-grade foam roller for myofascial release and muscle recovery. Perfect for pre and post-workout routines.",
    inStock: true,
    rating: 4.4,
    reviews: 97,
    specs: {
      "Length": "18 inches",
      "Diameter": "6 inches",
      "Density": "High",
      "Material": "EVA foam"
    }
  },
  {
    id: "weightlifting-belt",
    name: "Leather Weightlifting Belt",
    category: "accessories",
    price: 79.99,
    image: "https://media.istockphoto.com/id/1434155707/photo/woman-preparing-for-weightlifting.jpg?s=2048x2048&w=is&k=20&c=mGG0bzOV0Hj29TB_tLqJUFdpZs8nwn3-4X5YtnJAvxM=",
    description: "Genuine leather weightlifting belt providing superior back support for heavy lifts. Adjustable for a perfect fit.",
    inStock: true,
    rating: 4.8,
    reviews: 65,
    specs: {
      "Material": "Genuine leather",
      "Width": "4 inches",
      "Buckle": "Double prong",
      "Sizes": "S to XXL"
    }
  },
  {
    id: "Battle-rope",
    name: "Battle Rope",
    category: "accessories",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1605720789771-a7fb8ab19d04?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Professional speed jump rope with adjustable cable and comfortable handles. Perfect for cardio and CrossFit workouts.",
    inStock: true,
    rating: 4.5,
    reviews: 112,
    specs: {
      "Cable": "Adjustable steel",
      "Handles": "Aluminum with bearings",
      "Length": "Adjustable up to 10ft",
      "Weight": "Ultra lightweight"
    }
  },
  {
    id: "weight-plates",
    name: "Olympic Weight Plates Set",
    category: "strength",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1644077330596-04f321af773f?w=800&auto=format&fit=crop",
    description: "Set of Olympic weight plates in various weights. Precision-made with rubber coating for noise reduction and floor protection.",
    inStock: false,
    rating: 4.7,
    reviews: 78,
    specs: {
      "Weights": "2 x 45lb, 2 x 25lb, 2 x 10lb, 2 x 5lb, 2 x 2.5lb",
      "Material": "Cast iron with rubber coating",
      "Diameter": "Olympic standard (2\")",
      "Tolerance": "+/- 1%"
    }
  },
  {
    id: "Deadlift straps",
    name: "Weightlifting straps",
    category: "accessories",
    price: 24.99,
    image: "https://media.istockphoto.com/id/1367777042/photo/sports-belts-with-a-barbell-on-a-white-background-hand-straps-for-deadlift.jpg?s=2048x2048&w=is&k=20&c=WjuCmctBpJ7aRtsUYGlDADKG5zJxB6Le6clFXBOFsC8=",
    description: "Premium weightlifting straps with wrist support. Provides grip and protection during lifting, preventing calluses and blisters.",
    inStock: true,
    rating: 4.3,
    reviews: 142,
    specs: {
      "Material": "Microfiber and neoprene",
      "Wrist Support": "Adjustable strap",
      "Palm": "Silicone-padded",
      "Sizes": "S to XL"
    }
  }
].map(product => ({
  ...product,
  price: Math.round(product.price) // Ensure whole number rupees
}));

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([
    { product: initialProducts[0], quantity: 1 },
    { product: initialProducts[1], quantity: 1 },
    { product: initialProducts[2], quantity: 1 }
  ]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    minPrice: null,
    maxPrice: null,
    inStock: null
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedLiked = localStorage.getItem('liked');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
    
    if (savedLiked) {
      try {
        setLiked(new Set(JSON.parse(savedLiked)));
      } catch (e) {
        console.error('Failed to parse saved liked items', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify([...liked]));
  }, [liked]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        toast.success(`Updated ${product.name} quantity in cart`);
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success(`Added ${product.name} to cart`);
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const removedItem = prevCart.find(item => item.product.id === productId);
      if (removedItem) {
        toast.success(`Removed ${removedItem.product.name} from cart`);
      }
      return prevCart.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const toggleLike = (productId: string) => {
    setLiked(prevLiked => {
      const newLiked = new Set(prevLiked);
      const product = products.find(p => p.id === productId);
      
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
        if (product) toast.success(`Removed ${product.name} from favorites`);
      } else {
        newLiked.add(productId);
        if (product) toast.success(`Added ${product.name} to favorites`);
      }
      
      return newLiked;
    });
  };

  const isLiked = (productId: string) => {
    return liked.has(productId);
  };

  const getLikedCount = () => {
    return liked.size;
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const applyFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      category: null,
      minPrice: null,
      maxPrice: null,
      inStock: null
    });
  };

  const getFilteredProducts = () => {
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }
      
      if (filters.inStock !== null && product.inStock !== filters.inStock) {
        return false;
      }
      
      return true;
    });
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  const value = {
    products,
    cart,
    liked,
    filters,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleLike,
    isLiked,
    getLikedCount,
    getCartTotal,
    getCartCount,
    applyFilters,
    resetFilters,
    getFilteredProducts,
    getProductsByCategory,
    getProductById,
    getFeaturedProducts
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
