"use client";

import { useState } from "react";

interface MostPromptedRecipeProps {
  recipe?: {
    title: string;
    description: string;
    image: string;
    ingredients: string[];
    instructions?: string[];
  };
}

export default function MostPromptedRecipeSection({
  recipe,
}: MostPromptedRecipeProps) {
  // Default featured recipe (can be replaced with dynamic data from backend)
  const defaultRecipe = {
    title: "Lumpia Shanghai",
    description:
      "A classic Filipino appetizer, these crispy, golden-brown spring rolls are filled with a savory mixture of ground pork, minced vegetables, and seasonings. A guaranteed hit at any party, perfect for dipping in sweet chili sauce.",
    image: "/images/recipe/LumpiaShanghai.jpg",
    ingredients: [
      "1 lb (500g) ground pork",
      "50 pcs lumpia wrappers (spring roll wrappers)",
      "1 large carrot, minced",
      "1 large onion, minced",
      "5 cloves garlic, minced",
      "1/2 cup minced water chestnuts or jicama (singkamas) (optional)",
      "2 tbsp soy sauce",
      "1 tsp salt",
      "1 tsp black pepper",
      "1 large egg, beaten (for the filling mixture)",
      "1 small bowl of water or 1 beaten egg (for sealing the wrappers)",
      "3 cups cooking oil for deep frying",
    ],
    instructions: [
      "In a large bowl, combine ground pork, minced carrot, minced onion, minced garlic and minced water chestnuts (if using).",
      "Add soy sauce, salt, black pepper, and the beaten egg. Mix thoroughly until well combined.",
      "Place a lumpia wrapper on a clean surface. Spoon about 1 tablespoon of filling near one corner of the wrapper.",
      "Fold the corner over the filling, tuck in the sides, and roll tightly. Seal the edge with a little water or beaten egg. Repeat with remaining wrappers and filling.",
      "Heat oil in a deep frying pan or wok over medium-high heat until hot (about 350°F / 175°C).",
      "Fry lumpia in batches, turning occasionally, until golden brown and crispy (about 3–5 minutes per batch). Do not overcrowd the pan.",
      "Drain on paper towels to remove excess oil. Serve hot with sweet chili sauce or your favorite dip.",
      "Store any leftovers in the refrigerator and reheat in an oven or air fryer to keep them crispy.",
    ],
  };

  const displayRecipe = recipe || defaultRecipe;
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">(
    "ingredients"
  );
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllInstructions, setShowAllInstructions] = useState(false);

  const PREVIEW_INGREDIENTS = 5;
  const PREVIEW_INSTRUCTIONS = 3;

  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-[#1a1a1a] font-bold text-3xl md:text-4xl lg:text-5xl mb-3">
            Most Prompted Recipe
          </h2>
          <p className="text-[#454545] text-base md:text-lg max-w-2xl">
            Discover our AI-generated featured recipe, crafted to inspire your
            next cooking adventure
          </p>
        </div>

        {/* Recipe Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Recipe Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#FEF9E1] shadow-lg">
              <img
                src={displayRecipe.image}
                alt={displayRecipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=800&fit=crop";
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FEF9E1] rounded-2xl -z-10 hidden md:block"></div>
          </div>

          {/* Recipe Details */}
          <div className="flex flex-col">
            <h3 className="text-[#1a1a1a] font-bold text-2xl md:text-3xl lg:text-4xl mb-4">
              {displayRecipe.title}
            </h3>

            <p className="text-[#454545] text-base md:text-lg leading-relaxed mb-8">
              {displayRecipe.description}
            </p>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("ingredients")}
                  className={`pb-3 font-semibold text-base transition-all relative ${
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
                  className={`pb-3 font-semibold text-base transition-all relative ${
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

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "ingredients" && (
                <div className="space-y-4">
                  <ul className="space-y-3">
                    {displayRecipe.ingredients
                      .slice(
                        0,
                        showAllIngredients
                          ? displayRecipe.ingredients.length
                          : PREVIEW_INGREDIENTS
                      )
                      .map((ingredient, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-[#454545] items-baseline"
                        >
                          <span className="text-[#6D2323] flex-shrink-0 text-lg leading-none">
                            •
                          </span>
                          <span className="text-base leading-relaxed">
                            {ingredient}
                          </span>
                        </li>
                      ))}
                  </ul>

                  {displayRecipe.ingredients.length > PREVIEW_INGREDIENTS && (
                    <button
                      type="button"
                      onClick={() => setShowAllIngredients(!showAllIngredients)}
                      className="text-sm text-[#6D2323] font-semibold hover:text-[#8B3030] transition-colors flex items-center gap-1 mt-4"
                    >
                      {showAllIngredients ? (
                        <>
                          Hide ingredients
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          Show all {displayRecipe.ingredients.length}{" "}
                          ingredients
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {activeTab === "instructions" && (
                <div className="space-y-4">
                  <ol className="space-y-4">
                    {(displayRecipe.instructions || [])
                      .slice(
                        0,
                        showAllInstructions
                          ? displayRecipe.instructions?.length
                          : PREVIEW_INSTRUCTIONS
                      )
                      .map((step, index) => (
                        <li key={index} className="flex gap-4 text-[#454545]">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6D2323] text-white text-sm font-semibold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-base leading-relaxed pt-0.5">
                            {step}
                          </span>
                        </li>
                      ))}
                  </ol>

                  {(displayRecipe.instructions?.length || 0) >
                    PREVIEW_INSTRUCTIONS && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAllInstructions(!showAllInstructions)
                      }
                      className="text-sm text-[#6D2323] font-semibold hover:text-[#8B3030] transition-colors flex items-center gap-1 mt-4"
                    >
                      {showAllInstructions ? (
                        <>
                          Hide instructions
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          Show all {displayRecipe.instructions?.length} steps
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* CTA Buttons - Fixed at bottom */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
              <a href="/generate" className="flex-1">
                <button className="w-full bg-[#6D2323] text-white px-6 py-3.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Generate Similar Recipe
                </button>
              </a>
              <button className="flex-1 bg-white border-2 border-[#6D2323] text-[#6D2323] px-6 py-3.5 rounded-lg hover:bg-[#6D2323] hover:text-white transition-colors duration-200 font-semibold text-base flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
