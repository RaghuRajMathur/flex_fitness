
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { Heart, ShoppingCart, Menu, X, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { getCartCount, getLikedCount } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [likedCount, setLikedCount] = useState(getLikedCount());
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      setCartCount(getCartCount());
      setLikedCount(getLikedCount());
    }, 1000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [getCartCount, getLikedCount]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const categories = [
    { name: "Strength", path: "/category/strength" },
    { name: "Accessories", path: "/category/accessories" },
    { name: "Electronics", path: "/category/electronics" },
    { name: "Recovery", path: "/category/recovery" },
    { name: "Nutrition", path: "/category/nutrition" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-black/80"
          : "bg-transparent"
      }`}
    >
      <div className="max-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-display font-bold tracking-tight"
            onClick={closeMenu}
          >
            <span className="text-primary">Flex</span>Fitness
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="text-sm font-medium p-0 h-auto hover:text-primary transition-colors"
                >
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-40 animate-fade-in">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.path} asChild>
                    <Link to={category.path} className="w-full cursor-pointer">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link to="/products" className="w-full cursor-pointer">
                    All Products
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/search" className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/account" className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
            <Link
              to="/favorites"
              className="p-2 rounded-full hover:bg-muted transition-colors relative"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {likedCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {likedCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-muted transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="p-2 rounded-full hover:bg-muted transition-colors md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute left-0 right-0 bg-background/95 backdrop-blur-md shadow-md transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "top-full opacity-100 visible"
              : "top-[calc(100%-10px)] opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col p-4 space-y-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={closeMenu}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={closeMenu}
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/about"
              className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={closeMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
