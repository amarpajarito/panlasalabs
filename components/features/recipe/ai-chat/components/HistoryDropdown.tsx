import { HistoryItem } from "@/types/chat";

interface HistoryDropdownProps {
  history: HistoryItem[];
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  onHistorySelect: (item: HistoryItem) => void;
}

export function HistoryDropdown({
  history,
  showHistory,
  setShowHistory,
  onHistorySelect,
}: HistoryDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center gap-2 px-3 py-2 border border-[#6D2323]/20 rounded-lg hover:bg-[#FEF9E1] transition-colors duration-200"
      >
        <svg
          className="w-4 h-4 text-[#6D2323]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="hidden sm:inline text-[#6D2323] font-medium text-sm">
          History
        </span>
      </button>

      {showHistory && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowHistory(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white border border-[#6D2323]/10 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="bg-[#6D2323] px-4 py-3">
              <h3 className="text-white font-semibold text-sm">
                Recent Recipes
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {history.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <svg
                    className="w-12 h-12 text-[#6D2323]/20 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-[#454545] text-sm">
                    No recent recipes yet
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#6D2323]/5">
                  {history.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => onHistorySelect(h)}
                      className="w-full text-left p-4 hover:bg-[#FEF9E1]/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[#6D2323] font-medium text-sm truncate">
                            {h.title}
                          </p>
                          <p className="text-[#454545] text-xs mt-1">
                            {new Date(h.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-[#6D2323]/40 group-hover:text-[#6D2323] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
