import { ExtendedRecipe } from "@/types/chat";

interface RecipeHeaderProps {
  recipe: ExtendedRecipe;
  onClose: () => void;
}

export function RecipeHeader({ recipe, onClose }: RecipeHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-white to-[#FEF9E1]/20 px-6 py-6 border-b border-[#6D2323]/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-[#1a1a1a] font-bold text-2xl md:text-3xl mb-3">
            {recipe.title}
          </h2>
          <p className="text-[#454545] text-base leading-relaxed mb-4">
            {recipe.description}
          </p>
          {recipe.cuisine && (
            <span className="inline-block text-sm text-[#6D2323] bg-[#FEF9E1] px-3 py-1 rounded-md border border-[#6D2323]/10 mb-3">
              {recipe.cuisine}
            </span>
          )}
          <div className="flex flex-wrap gap-2">
            {recipe.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#FEF9E1] text-[#6D2323] rounded-full text-sm font-medium border border-[#6D2323]/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-2 hover:bg-[#FEF9E1] rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-[#6D2323]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
