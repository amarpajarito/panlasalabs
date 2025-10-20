"use client";

import RecipeCard from "./RecipeCard";
import { useRef } from "react";

const recipes = [
  {
    imageSrc: "/images/home/home-2.png",
    title: "Adobo in Balsamic Vinegar",
    description:
      "A modern twist on the classic Filipino favorite. Adobong Manok with balsamic vinegar balances savory and tangy flavors in a rich, aromatic sauce.",
  },
  {
    imageSrc: "/images/home/home-3.png",
    title: "Tropical Tofu Stir-Fry",
    description:
      "Bright and packed with flavor, Tropical Tofu Stir-Fry combines crispy tofu, juicy pineapple, and sweet bell peppers in a light yet satisfying vegetarian meal.",
  },
  {
    imageSrc: "/images/home/home-4.png",
    title: "Garlic Butter Shrimp Pasta",
    description:
      "Garlic Butter Shrimp Pasta brings together the richness of Italian cuisine with a Filipino love for bold garlic flavor - Tossed in a buttery and garlicky sauce.",
  },
  {
    imageSrc: "/images/home/home-2.png",
    title: "Sinigang na Baboy",
    description:
      "A tangy and savory Filipino soup with tender pork, fresh vegetables, and tamarind broth. Perfect comfort food for any day.",
  },
  {
    imageSrc: "/images/home/home-3.png",
    title: "Kare-Kare",
    description:
      "A rich and creamy Filipino peanut stew with oxtail, vegetables, and bagoong. A celebration of Filipino flavors in every bite.",
  },
];

export default function TrendingRecipesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      // Get the container width and calculate one card width including gap
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / recipes.length; // Width per card
      const gap = 24; // 6 in Tailwind = 24px
      const scrollAmount = cardWidth;

      const newScrollPosition =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      container.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="featured-recipes"
      className="w-full py-16 md:py-20 bg-gradient-to-b from-white to-[#FEF9E1]/20"
    >
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="max-w-2xl">
            <span className="text-[#6D2323] text-sm font-bold uppercase tracking-[0.2em] mb-3 block">
              Featured Recipes
            </span>
            <h2 className="text-[#1a1a1a] font-bold text-4xl md:text-5xl mb-3 leading-tight">
              Trending Filipino Recipes
            </h2>
            <p className="text-[#454545] text-lg md:text-xl leading-relaxed">
              Discover the most popular AI-generated recipes
            </p>
          </div>

          {/* Navigation Buttons - Hidden on Mobile */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="bg-white border-2 border-[#6D2323] text-[#6D2323] p-3 rounded-full hover:bg-[#6D2323] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="Scroll left"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-white border-2 border-[#6D2323] text-[#6D2323] p-3 rounded-full hover:bg-[#6D2323] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              aria-label="Scroll right"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="relative -mx-4 sm:-mx-6 md:mx-0">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 sm:px-6 md:px-0 snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[calc((100%-48px)/3)] snap-start"
              >
                <RecipeCard
                  imageSrc={recipe.imageSrc}
                  title={recipe.title}
                  description={recipe.description}
                />
              </div>
            ))}
          </div>

          {/* Scroll Indicator - Mobile */}
          <div className="md:hidden text-center mt-4 text-[#6D2323] text-sm font-medium">
            ← Swipe to explore more →
          </div>
        </div>
      </div>
    </section>
  );
}
