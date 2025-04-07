
import React from "react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  description: string;
  image: string;
  link: string;
}

const CategoryCard = ({ name, description, image, link }: CategoryCardProps) => {
  return (
    <Link to={link} className="group block relative overflow-hidden rounded-xl">
      <div className="aspect-[3/4] sm:aspect-[3/2] relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
          <p className="text-white/80 text-sm mb-4">{description}</p>
          <span className="inline-flex items-center text-white text-sm font-medium group-hover:translate-x-1 transition-transform">
            Explore Collection
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

const FeaturedCategories = () => {
  const categories = [
    {
      name: "Strength Equipment",
      description: "Build strength with our premium barbells, dumbbells, and weight plates.",
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop",
      link: "/category/strength",
    },
    {
      name: "Accessories",
      description: "Enhance your workouts with resistance bands, gloves, belts, and more.",
      image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop",
      link: "/category/accessories",
    },
    {
      name: "Electronics",
      description: "Track your progress with advanced fitness trackers and wearables.",
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop",
      link: "/category/electronics",
    },
    {
      name: "Recovery",
      description: "Optimize your recovery with foam rollers, massage guns, and more.",
      image: "https://images.unsplash.com/photo-1620188467120-5042c5bf5e70?w=800&auto=format&fit=crop",
      link: "/category/recovery",
    },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="max-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold tracking-tight mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of premium fitness equipment and accessories designed for your specific training needs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              description={category.description}
              image={category.image}
              link={category.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
