import PublicGenerateRecipe from "@/components/features/recipe/PublicGenerateRecipe";
import MostPromptedRecipeSection from "@/components/features/recipe/MostPromptedRecipeSection";
import MustTryRecipesSection from "@/components/features/recipe/MustTryRecipesSection";

export default function RecipePage() {
  return (
    <main className="min-h-screen bg-white">
      <PublicGenerateRecipe />
      <MostPromptedRecipeSection />
      <MustTryRecipesSection />
    </main>
  );
}
