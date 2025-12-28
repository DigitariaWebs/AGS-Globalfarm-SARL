"use client";

import { useState, useLayoutEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Sprout, Plus, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types";

interface BoutiqueClientPageProps {
  products: Product[];
  categories: string[];
}

export default function BoutiqueClientPage({
  products,
  categories,
}: BoutiqueClientPageProps) {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [searchQuery, setSearchQuery] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#faf9f6");

  // Use cart context
  const { addToCart } = useCart();

  // Get the actual background color from the body element
  useLayoutEffect(() => {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBackgroundColor(bodyBg);
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Tout" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-32 overflow-hidden bg-emerald-900">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-brand) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block py-2 px-4 rounded text-white text-sm font-medium mb-4 border"
              style={{
                backgroundColor: "var(--color-secondary-brand)",
                borderColor: "var(--color-secondary-brand)",
              }}
            >
              La qualité directement de la ferme
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Notre Boutique Nature
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-10">
              Découvrez nos produits frais, nos semences de qualité et notre
              matériel agricole. Commandez en ligne et faites-vous livrer la
              fraîcheur à domicile.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div
                className="flex items-center bg-white rounded-lg p-2 border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Search className="w-5 h-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Rechercher un produit (ex: Tomates, Semences...)"
                  className="w-full px-4 py-2 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                  Rechercher
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Wave Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(100%+1.3px)] h-15"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill={backgroundColor}
            ></path>
          </svg>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 relative">
        {/* Gradient overlay at the top to blend */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none -mt-1"
          style={{
            background: `linear-gradient(to bottom, ${backgroundColor}, transparent)`,
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Nos Produits</h2>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-green-50 overflow-hidden shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.isNewProduct && (
                      <span
                        className="absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"
                        style={{
                          backgroundColor: "var(--color-secondary-brand)",
                        }}
                      >
                        Nouveau
                      </span>
                    )}
                    {product.organic && (
                      <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        Bio
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Title and Category */}
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 min-h-12">
                        {product.name}
                      </h3>
                      <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-10">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="text-sm font-semibold text-gray-900">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Spacer to push price/button to bottom */}
                    <div className="flex-1" />

                    {/* Price and Add to Cart */}
                    <div className="border-t pt-4 mt-auto">
                      <div className="flex items-end justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <p className="text-2xl font-bold text-green-600 leading-tight">
                            {product.price.toLocaleString()} FCFA
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            par {product.unit}
                          </p>
                        </div>
                        <Button
                          onClick={() => addToCart(product)}
                          className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
