import { useEffect } from "react";
import { ExtendedRecipe } from "@/types/chat";
import { fetchAndNormalizeRecipe } from "@/utils/recipe/recipeNormalizer";

interface UseRecipeEventsProps {
  onRecipeCreated: (recipe: ExtendedRecipe) => void;
}

export function useRecipeEvents({ onRecipeCreated }: UseRecipeEventsProps) {
  useEffect(() => {
    const handleRecipeCreated = async (event: CustomEvent<any>) => {
      const recipeId = event.detail?.id;
      if (!recipeId) return;

      const mapped = await fetchAndNormalizeRecipe(String(recipeId));
      if (mapped) {
        onRecipeCreated(mapped);
      }
    };

    if (typeof window !== "undefined") {
      const listener = (e: Event) => handleRecipeCreated(e as CustomEvent<any>);
      window.addEventListener("prompted:created", listener);
      return () => window.removeEventListener("prompted:created", listener);
    }
  }, [onRecipeCreated]);
}
