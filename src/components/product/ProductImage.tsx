
import React, { useState } from "react";
import LazyImage from "@/components/LazyImage";

interface ProductImageProps {
  src: string;
  alt: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div 
      className="aspect-square md:sticky md:top-24 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
    >
      <div className="relative w-full h-full overflow-hidden">
        <LazyImage
          src={src}
          alt={alt}
          className={`rounded-xl overflow-hidden h-full w-full object-cover transition-transform duration-500 ${isZoomed ? 'scale-110' : 'scale-100'}`}
        />
      </div>
    </div>
  );
};

export default ProductImage;
