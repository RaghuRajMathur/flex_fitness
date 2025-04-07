
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductGrid from "@/components/ProductGrid";
import { useStore } from "@/context/StoreContext";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { getProductsByCategory } = useStore();
  
  const products = getProductsByCategory(category || "");
  
  const categoryTitles: Record<string, string> = {
    strength: "Strength Equipment",
    accessories: "Accessories & Gear",
    electronics: "Electronics & Wearables",
    recovery: "Recovery Equipment",
    nutrition: "Nutrition Supplements"
  };
  
  const categoryDescriptions: Record<string, string> = {
    strength: "Build strength and power with our premium barbells, dumbbells, kettlebells, and weight plates.",
    accessories: "Enhance your workouts with resistance bands, gloves, belts, and other essential accessories.",
    electronics: "Track your progress and optimize your training with advanced fitness trackers and wearables.",
    recovery: "Speed up recovery and prevent injuries with our foam rollers, massage guns, and mobility tools.",
    nutrition: "Fuel your body with high-quality protein powders, supplements, and nutritional products."
  };
  
  const title = categoryTitles[category || ""] || "Products";
  const description = categoryDescriptions[category || ""] || "Explore our collection of premium fitness products.";

  return (
    <Layout>
      <div className="max-container py-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
        <ProductGrid products={products} variant="default" columns={3} />
      </div>
    </Layout>
  );
};

export default CategoryPage;
