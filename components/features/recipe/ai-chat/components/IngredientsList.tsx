interface IngredientsListProps {
  ingredients: string[];
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  previewCount: number;
}

export function IngredientsList({
  ingredients,
  showAll,
  setShowAll,
  previewCount,
}: IngredientsListProps) {
  const displayItems = showAll
    ? ingredients
    : ingredients.slice(0, previewCount);

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {displayItems.map((ingredient, idx) => (
          <li key={idx} className="flex gap-3 text-[#454545] items-baseline">
            <span className="text-[#6D2323] flex-shrink-0 text-lg leading-none">
              •
            </span>
            <span className="text-base leading-relaxed">{ingredient}</span>
          </li>
        ))}
      </ul>

      {ingredients.length > previewCount && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-[#6D2323] font-semibold hover:text-[#8B3030] transition-colors flex items-center gap-1 mt-4"
        >
          {showAll
            ? "Hide ingredients"
            : `Show all ${ingredients.length} ingredients`}
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
              d={showAll ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </button>
      )}
    </div>
  );
}
