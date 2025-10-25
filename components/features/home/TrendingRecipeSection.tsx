"use client";

import Link from "next/link";
import RecipeCard from "./RecipeCard";
import { useRef } from "react";

const recipes = [
  {
    imageSrc: "/images/recipe/Adobo.png",
    title: "Chicken Adobo",
    description:
      "The undisputed Filipino favorite. A savory and tangy stew made with soy sauce, vinegar, garlic, and bay leaves, Adobo is known for its rich flavor and endless variations across regions.",
  },
  {
    imageSrc: "/images/recipe/Sinigang.png",
    title: "Sinigang na Hipon",
    description:
      "A comforting sour soup usually made with pork, shrimp, or fish, flavored with tamarind and fresh vegetables. Its perfect balance of sourness and warmth makes it a household staple.",
  },
  {
    imageSrc: "/images/recipe/Sisig.png",
    title: "Sizzling Pork Sisig",
    description:
      "A sizzling Kapampangan dish made from chopped pork, onions, and calamansi, often served on a hot plate. Known for its crunchy, flavorful texture, Sisig is a crowd-pleaser at any gathering.",
  },
  {
    imageSrc: "/images/recipe/Kare-Kare.png",
    title: "Kare-Kare",
    description:
      "A peanut-based stew traditionally made with oxtail and vegetables, served with bagoong (shrimp paste). This rich, nutty dish is a Filipino comfort food that brings people together during celebrations.",
  },
  {
    imageSrc: "/images/recipe/Bagnet.png",
    title: "Bagnet",
    description:
      "A crispy deep-fried pork belly dish from Ilocos, Bagnet is prized for its crunchy skin and juicy meat. It’s often paired with bagoong and tomatoes, offering the perfect mix of texture and flavor that Filipinos can’t resist.",
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
              <Link
                key={index}
                href="/allrecipes"
                aria-label={`Open ${recipe.title} in All Recipes`}
                className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[calc((100%-48px)/3)] snap-start"
              >
                <RecipeCard
                  imageSrc={recipe.imageSrc}
                  title={recipe.title}
                  description={recipe.description}
                />
              </Link>
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
