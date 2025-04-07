
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const LazyImage = ({ src, alt, className, style }: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  
  // Fallback images by category based on alt text
  const getCategoryFromAlt = (altText: string): string => {
    const lowerAlt = altText.toLowerCase();
    if (lowerAlt.includes("barbell") || lowerAlt.includes("dumbbell") || lowerAlt.includes("weight")) {
      return "strength";
    } else if (lowerAlt.includes("band") || lowerAlt.includes("glove") || lowerAlt.includes("belt")) {
      return "accessories";
    } else if (lowerAlt.includes("tracker") || lowerAlt.includes("watch")) {
      return "electronics";
    } else if (lowerAlt.includes("roller") || lowerAlt.includes("massage")) {
      return "recovery";
    } else if (lowerAlt.includes("protein") || lowerAlt.includes("nutrition")) {
      return "nutrition";
    }
    return "default";
  };
  
  const getFallbackImage = (category: string): string => {
    const fallbackImages: Record<string, string> = {
      strength: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop",
      accessories: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop",
      electronics: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop",
      recovery: "https://images.unsplash.com/photo-1620188467120-5042c5bf5e70?w=800&auto=format&fit=crop",
      nutrition: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop",
      default: "https://images.unsplash.com/photo-1561214078-f3247647fc5e?w=800&auto=format&fit=crop"
    };
    
    return fallbackImages[category] || fallbackImages.default;
  };

  useEffect(() => {
    setLoaded(false);
    setError(false);
    
    // Ensure there's always a valid image source
    if (!src || src.trim() === "") {
      const category = getCategoryFromAlt(alt);
      const fallback = getFallbackImage(category);
      setImageSrc(fallback);
    } else {
      setImageSrc(src);
    }
  }, [src, alt]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    const category = getCategoryFromAlt(alt);
    const fallback = getFallbackImage(category);
    // When an image fails to load, use a fallback image
    setImageSrc(fallback);
  };

  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export default LazyImage;
