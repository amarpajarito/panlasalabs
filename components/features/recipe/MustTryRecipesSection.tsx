"use client";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function MustTryRecipesSection() {
  // Sample recipes (will be replaced with backend data)
  const recipes: Recipe[] = [
    {
      id: "1",
      title: "Ginataang Peras",
      description:
        "A creamy Filipino dessert made with pears and coconut milk.",
      image: "/images/recipe/recipe-2.png",
      difficulty: "Medium",
    },
    {
      id: "2",
      title: "Aubergine in Egg",
      description: "Classic Filipino tortang talong (eggplant omelette).",
      image: "/images/recipe/recipe-3.png",
      difficulty: "Easy",
    },
    {
      id: "3",
      title: "Grilled Mushroom",
      description: "Savory grilled mushrooms with Filipino flavors.",
      image: "/images/recipe/recipe-4.png",
      difficulty: "Medium",
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-b from-white to-[#FEF9E1]/20">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-[#1a1a1a] font-bold text-3xl md:text-4xl lg:text-5xl mb-3">
            Must Try Recipes
          </h2>
          <p className="text-[#454545] text-base md:text-lg max-w-2xl">
            Explore our curated collection of popular Filipino-inspired dishes
            that everyone loves
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {recipes.map((recipe, index) => (
            <div key={recipe.id} className="md:col-span-1">
              <div className="bg-white rounded-2xl overflow-hidden border border-[#6D2323]/10 h-full flex flex-col hover:shadow-lg transition-all duration-200">
                {/* Recipe Image */}
                <div className="relative overflow-hidden bg-[#FEF9E1] aspect-square">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback images based on recipe type
                      const fallbackImages = [
                        "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=800&fit=crop",
                        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop",
                        "https://images.unsplash.com/photo-1580959375944-954d4bcbb135?w=800&h=800&fit=crop",
                      ];
                      e.currentTarget.src =
                        fallbackImages[index] || fallbackImages[0];
                    }}
                  />

                  {/* Difficulty Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        recipe.difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : recipe.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                {/* Recipe Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-[#1a1a1a] font-bold text-xl md:text-2xl mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-[#454545] text-sm md:text-base mb-6 flex-1">
                    {recipe.description}
                  </p>

                  {/* Action Button */}
                  <button className="w-full bg-[#6D2323] text-white px-6 py-3 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-sm flex items-center justify-center gap-2">
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-white border-2 border-[#6D2323] text-[#6D2323] px-8 py-3.5 rounded-lg hover:bg-[#6D2323] hover:text-white transition-colors duration-200 font-semibold text-base">
            <span>Explore All Recipes</span>
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
