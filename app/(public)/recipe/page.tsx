import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PublicGenerateRecipe from "@/components/features/recipe/PublicGenerateRecipe";
import AIRecipeChat from "@/components/features/recipe/AIRecipeChat";
import MostPromptedRecipeSection from "@/components/features/recipe/MostPromptedRecipeSection";
import MustTryRecipesSection from "@/components/features/recipe/MustTryRecipesSection";

export default async function RecipePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-white">
      {session ? <AIRecipeChat /> : <PublicGenerateRecipe />}
      <MostPromptedRecipeSection />
      <MustTryRecipesSection />
    </main>
  );
}
