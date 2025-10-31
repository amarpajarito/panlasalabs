import { ExtendedRecipe } from "@/types/chat";

interface RecipeMetadataProps {
  recipe: ExtendedRecipe;
}

export function RecipeMetadata({ recipe }: RecipeMetadataProps) {
  const metadata = [
    { label: "Prep Time", value: recipe.prepTime },
    { label: "Cook Time", value: recipe.cookTime },
    { label: "Servings", value: recipe.servings },
    { label: "Difficulty", value: recipe.difficulty },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {metadata.map((item, idx) => (
        <div
          key={idx}
          className="bg-[#FEF9E1] rounded-lg p-4 border border-[#6D2323]/10"
        >
          <div className="text-[#454545] text-sm mb-1">{item.label}</div>
          <div className="text-[#6D2323] font-bold">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
