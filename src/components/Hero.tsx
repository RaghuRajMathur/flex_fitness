
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
  return (
    <div className="relative h-[85vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80"
          alt="Gym Equipment"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-container flex flex-col justify-center">
        <div className="max-w-2xl animate-slide-in">
          <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 mb-4">
            New Collection 2023
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight mb-4 md:mb-6">
            Elevate Your Fitness Journey
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-xl">
            Premium gym equipment and accessories designed for performance, durability, and results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-lg font-medium">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg font-medium bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
