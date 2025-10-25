"use client";

import { useState } from "react";
import type { Recipe } from "@/types/recipe";
import DifficultyBadge from "./DifficultyBadge";

export default function RecipeCard({
  recipe,
  showFlipCTA = true,
}: {
  recipe: Recipe;
  showFlipCTA?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">(
    "ingredients"
  );
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllInstructions, setShowAllInstructions] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const PREVIEW_INGREDIENTS = 10;
  const PREVIEW_INSTRUCTIONS = 10;

  const image =
    recipe.image ||
    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=800&fit=crop";

  return (
    <article className="h-full">
      <div style={{ perspective: 1000 }} className="w-full h-full">
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 450ms",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Face (normal flow) */}
          <div
            className="relative bg-white rounded-2xl overflow-hidden border border-[#6D2323]/10 flex flex-col hover:shadow-lg h-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="relative overflow-hidden bg-[#FEF9E1] aspect-square">
              <img
                src={image}
                alt={recipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop";
                }}
              />

              <DifficultyBadge difficulty={recipe.difficulty} />
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-[#1a1a1a] font-bold text-lg md:text-xl mb-2">
                {recipe.title}
              </h3>

              {recipe.description && (
                <p className="text-[#454545] text-sm mb-4 flex-1 line-clamp-3">
                  {recipe.description}
                </p>
              )}

              <div className="mt-auto">
                {showFlipCTA && (
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full bg-[#6D2323] text-white px-6 py-3 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Full Recipe
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Back Face (overlay) */}
          <div
            className="absolute inset-0 bg-white rounded-2xl overflow-auto border border-[#6D2323]/10 flex flex-col"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-[#1a1a1a] font-bold text-lg md:text-xl">
                  {recipe.title}
                </h3>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="text-sm text-gray-500 hover:text-[#6D2323]"
                >
                  Close
                </button>
              </div>

              <div className="border-b border-gray-100 mb-4">
                <div className="flex gap-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("ingredients")}
                    className={`pb-2 font-semibold text-sm transition-all relative ${
                      activeTab === "ingredients"
                        ? "text-[#6D2323]"
                        : "text-gray-500 hover:text-[#6D2323]"
                    }`}
                  >
                    Ingredients
                    {activeTab === "ingredients" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D2323]"></span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("instructions")}
                    className={`pb-2 font-semibold text-sm transition-all relative ${
                      activeTab === "instructions"
                        ? "text-[#6D2323]"
                        : "text-gray-500 hover:text-[#6D2323]"
                    }`}
                  >
                    Instructions
                    {activeTab === "instructions" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D2323]"></span>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-sm text-[#454545]">
                {activeTab === "ingredients" && (
                  <div className="space-y-2">
                    <ul className="space-y-1">
                      {(recipe.ingredients || [])
                        .slice(
                          0,
                          showAllIngredients
                            ? recipe.ingredients!.length
                            : PREVIEW_INGREDIENTS
                        )
                        .map((ing, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-[#6D2323]">•</span>
                            <span className="leading-relaxed">{ing}</span>
                          </li>
                        ))}
                    </ul>

                    {(recipe.ingredients?.length || 0) >
                      PREVIEW_INGREDIENTS && (
                      <button
                        onClick={() =>
                          setShowAllIngredients(!showAllIngredients)
                        }
                        className="text-xs text-[#6D2323] font-semibold hover:text-[#8B3030] mt-2"
                      >
                        {showAllIngredients
                          ? "Hide"
                          : `Show all ${recipe.ingredients?.length}`}
                      </button>
                    )}
                  </div>
                )}

                {activeTab === "instructions" && (
                  <div className="space-y-3">
                    <ol className="space-y-2">
                      {(recipe.instructions || [])
                        .slice(
                          0,
                          showAllInstructions
                            ? recipe.instructions!.length
                            : PREVIEW_INSTRUCTIONS
                        )
                        .map((step, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6D2323] text-white text-xs font-semibold flex items-center justify-center">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed text-sm">
                              {step}
                            </span>
                          </li>
                        ))}
                    </ol>

                    {(recipe.instructions?.length || 0) >
                      PREVIEW_INSTRUCTIONS && (
                      <button
                        onClick={() =>
                          setShowAllInstructions(!showAllInstructions)
                        }
                        className="text-xs text-[#6D2323] font-semibold hover:text-[#8B3030] mt-2"
                      >
                        {showAllInstructions
                          ? "Hide"
                          : `Show all ${recipe.instructions?.length} steps`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
