export function RecipeActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
      <button className="flex-1 bg-[#6D2323] text-white px-6 py-3.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
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
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        Save Recipe
      </button>
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
        Share
      </button>
    </div>
  );
}
