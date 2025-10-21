"use client";

interface PromptedRecipeProps {
  recipe?: {
    title: string;
    description: string;
    image: string;
    ingredients: string[];
  };
}

export default function PromptedRecipeSection({ recipe }: PromptedRecipeProps) {
  // Default featured recipe (can be replaced with dynamic data from backend)
  const defaultRecipe = {
    title: "Creamy Garlic Mushroom Stir-Fry",
    description:
      "This Creamy Garlic Mushroom Stir-Fry is a quick and satisfying dish that brings together the earthy flavor of mushrooms with a rich, garlicky cream sauce. Inspired by Filipino home-cooked comfort meals, it's perfect as a side dish or main entrée — simple, budget-friendly, and bursting with umami goodness.",
    image: "/images/recipes/mushroom-stirfry.jpg",
    ingredients: [
      "2 cups fresh mushrooms (button, oyster, or shiitake), sliced",
      "1 small onion, chopped",
      "4 cloves garlic, minced",
      "1 tbsp butter or olive oil",
      "½ cup all-purpose cream or coconut milk",
      "1 tbsp soy sauce",
      "½ tsp black pepper",
      "Salt to taste",
      "Chopped parsley or spring onions for garnish",
    ],
  };

  const displayRecipe = recipe || defaultRecipe;

  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-[#1a1a1a] font-bold text-3xl md:text-4xl lg:text-5xl mb-3">
            Prompted Recipe
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
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#FEF9E1]">
              <img
                src={displayRecipe.image}
                alt={displayRecipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=800&fit=crop";
                }}
              />
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FEF9E1] rounded-2xl -z-10 hidden md:block"></div>
          </div>

          {/* Recipe Details */}
          <div className="flex flex-col justify-center">
            <h3 className="text-[#1a1a1a] font-bold text-2xl md:text-3xl lg:text-4xl mb-4">
              {displayRecipe.title}
            </h3>

            <p className="text-[#454545] text-base md:text-lg leading-relaxed mb-8">
              {displayRecipe.description}
            </p>

            {/* Ingredients */}
            <div className="mb-8">
              <h4 className="text-[#1a1a1a] font-semibold text-xl mb-4">
                Ingredients:
              </h4>
              <ul className="space-y-2">
                {displayRecipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-[#454545]"
                  >
                    <span className="text-[#6D2323] mt-1.5">•</span>
                    <span className="text-sm md:text-base">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/generate" className="flex-1">
                <button className="w-full bg-[#6D2323] text-white px-6 py-3.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-base flex items-center justify-center gap-2">
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
