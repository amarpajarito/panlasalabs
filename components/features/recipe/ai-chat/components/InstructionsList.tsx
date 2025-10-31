interface InstructionsListProps {
  instructions: string[];
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  previewCount: number;
}

export function InstructionsList({
  instructions,
  showAll,
  setShowAll,
  previewCount,
}: InstructionsListProps) {
  const displayItems = showAll
    ? instructions
    : instructions.slice(0, previewCount);

  return (
    <div className="space-y-4">
      <ol className="space-y-4">
        {displayItems.map((step, idx) => (
          <li key={idx} className="flex gap-4 text-[#454545]">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6D2323] text-white text-sm font-semibold flex items-center justify-center">
              {idx + 1}
            </span>
            <span className="text-base leading-relaxed pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      {instructions.length > previewCount && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-[#6D2323] font-semibold hover:text-[#8B3030] transition-colors flex items-center gap-1 mt-4"
        >
          {showAll
            ? "Hide instructions"
            : `Show all ${instructions.length} steps`}
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
