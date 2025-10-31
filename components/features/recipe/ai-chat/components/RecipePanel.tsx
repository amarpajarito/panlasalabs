import { useState } from "react";
import { ExtendedRecipe } from "@/types/chat";
import { RecipeHeader } from "./RecipeHeader";
import { RecipeMetadata } from "./RecipeMetadata";
import { RecipeTabs } from "./RecipeTabs";
import { IngredientsList } from "./IngredientsList";
import { InstructionsList } from "./InstructionsList";
import { RecipeActions } from "./RecipeActions";

interface RecipePanelProps {
  recipe: ExtendedRecipe;
  onClose: () => void;
  recipePanelRef: React.RefObject<HTMLDivElement>;
}

export function RecipePanel({
  recipe,
  onClose,
  recipePanelRef,
}: RecipePanelProps) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">(
    "ingredients"
  );
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllInstructions, setShowAllInstructions] = useState(false);

  const PREVIEW_INGREDIENTS = 5;
  const PREVIEW_INSTRUCTIONS = 3;

  return (
    <div
      ref={recipePanelRef}
      className="hidden lg:flex lg:w-1/2 flex-col border-l border-[#6D2323]/10 bg-white"
    >
      <RecipeHeader recipe={recipe} onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-6">
        <RecipeMetadata recipe={recipe} />
        <RecipeTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "ingredients" ? (
          <IngredientsList
            ingredients={recipe.ingredients || []}
            showAll={showAllIngredients}
            setShowAll={setShowAllIngredients}
            previewCount={PREVIEW_INGREDIENTS}
          />
        ) : (
          <InstructionsList
            instructions={recipe.instructions || []}
            showAll={showAllInstructions}
            setShowAll={setShowAllInstructions}
            previewCount={PREVIEW_INSTRUCTIONS}
          />
        )}

        <RecipeActions />
      </div>
    </div>
  );
}
