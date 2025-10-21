import PublicGenerateRecipe from "@/components/features/recipe/PublicGenerateRecipe";
import PromptedRecipeSection from "@/components/features/recipe/PromptedRecipeSection";
import MustTryRecipesSection from "@/components/features/recipe/MustTryRecipesSection";

export default function RecipePage() {
  return (
    <main className="min-h-screen bg-white">
      <PublicGenerateRecipe />
      <PromptedRecipeSection />
      <MustTryRecipesSection />
    </main>
  );
}
