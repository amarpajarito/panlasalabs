"use client";

import Link from "next/link";
import RecipeCard from "@/components/features/recipe/RecipeCard";
import type { PublicRecipe } from "@/types/recipe";
export default function MustTryRecipesSection() {
  // Sample recipes (will be replaced with backend data)
  const recipes: PublicRecipe[] = [
    {
      id: "1",
      title: "Pancit Bihon",
      description: "A classic Filipino stir-fried rice noodle dish.",
      image: "/images/recipe/recipe-1.png",
      difficulty: "Medium",
      ingredients: [
        "250g bihon (rice noodles), soaked in water",
        "200g chicken breast, sliced thinly",
        "100g shrimp, peeled and deveined",
        "1 cup shredded cabbage",
        "1/2 cup sliced carrots",
        "1 small onion, chopped",
        "3 cloves garlic, minced",
        "4 tbsp soy sauce",
        "1 tbsp oyster sauce",
        "2 cups chicken broth",
        "2 tbsp cooking oil",
        "Salt and pepper to taste",
        "Calamansi and spring onions for garnish",
      ],
      instructions: [
        "Soak bihon noodles in water until soft, then drain.",
        "In a large wok, heat oil and sauté garlic and onion.",
        "Add chicken and shrimp, cook until no longer pink.",
        "Add carrots and cabbage. Stir-fry for 2-3 minutes.",
        "Pour in chicken broth, soy sauce, and oyster sauce. Bring to a boil.",
        "Add the drained noodles and mix well until noodles have absorbed the liquid.",
        "Season with salt and pepper. Serve hot with calamansi and spring onions.",
      ],
    },
    {
      id: "2",
      title: "Halo-Halo",
      description:
        "The ultimate Filipino shaved ice dessert with mixed sweets.",
      image: "/images/recipe/recipe-2.png",
      difficulty: "Easy",
      ingredients: [
        "2 cups shaved ice",
        "1/2 cup evaporated milk",
        "2 tbsp sweet red beans (kaong)",
        "2 tbsp macapuno strings",
        "2 tbsp nata de coco",
        "2 tbsp sweetened saba bananas",
        "2 tbsp sweetened jackfruit (langka)",
        "1 scoop ube halaya (purple yam jam)",
        "1 slice leche flan",
        "1 scoop ube ice cream",
        "Pinipig (toasted rice flakes) for topping",
      ],
      instructions: [
        "In a tall glass, layer the sweetened beans, macapuno, nata de coco, banana, and jackfruit.",
        "Fill the glass with shaved ice.",
        "Pour evaporated milk over the ice.",
        "Top with ube halaya, leche flan, and a scoop of ice cream.",
        "Sprinkle with pinipig before serving.",
        "Mix well (halo-halo) before eating.",
      ],
    },
    {
      id: "3",
      title: "Chicken Inasal",
      description:
        "A popular Filipino grilled chicken dish marinated in a unique blend of spices.",
      image: "/images/recipe/recipe-3.png",
      difficulty: "Medium",
      ingredients: [
        "1kg chicken parts (legs or thighs)",
        "1/2 cup vinegar",
        "1/4 cup calamansi juice",
        "4 cloves garlic, minced",
        "2 tbsp ginger, grated",
        "1 stalk lemongrass, pounded",
        "1 tsp salt",
        "1/2 tsp black pepper",
        "For Basting Sauce:",
        "1/4 cup margarine or butter, melted",
        "1 tbsp annatto (achuete) oil",
        "1/2 tsp salt",
      ],
      instructions: [
        "Combine all marinade ingredients (vinegar, calamansi, garlic, ginger, lemongrass, salt, pepper) in a large bowl.",
        "Add chicken pieces and marinate for at least 1 hour in the refrigerator.",
        "Prepare the basting sauce by mixing melted margarine and annatto oil.",
        "Preheat grill. Remove chicken from marinade.",
        "Grill chicken over medium heat for 15-20 minutes per side, or until cooked through.",
        "Baste generously with the annatto-margarine mixture during the last 10 minutes of grilling.",
        "Serve hot with steamed rice and a dipping sauce of soy sauce and calamansi.",
      ],
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
          {recipes.map((recipe) => (
            <div key={recipe.id} className="md:col-span-1">
              {/* Render shared RecipeCard; use its internal flip CTA */}
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/allrecipes"
            className="inline-flex items-center gap-2 bg-white border-2 border-[#6D2323] text-[#6D2323] px-8 py-3.5 rounded-lg hover:bg-[#6D2323] hover:text-white transition-colors duration-200 font-semibold text-base"
          >
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
          </Link>
        </div>
      </div>
    </section>
  );
}
