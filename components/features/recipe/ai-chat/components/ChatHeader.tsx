import { HistoryItem } from "@/types/chat";
import { HistoryDropdown } from "./HistoryDropdown";

interface ChatHeaderProps {
  onNewChat: () => void;
  history: HistoryItem[];
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  onHistorySelect: (item: HistoryItem) => void;
}

export function ChatHeader({
  onNewChat,
  history,
  showHistory,
  setShowHistory,
  onHistorySelect,
}: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-[#6D2323]/10 px-4 sm:px-6 py-4 shadow-sm">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6D2323] rounded-lg flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-[#1a1a1a] font-bold text-lg">
                AI Recipe Generator
              </h1>
              <p className="text-[#454545] text-xs">Powered by Google Gemini</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HistoryDropdown
              history={history}
              showHistory={showHistory}
              setShowHistory={setShowHistory}
              onHistorySelect={onHistorySelect}
            />
            <button
              onClick={onNewChat}
              className="flex items-center gap-2 px-3 py-2 bg-[#6D2323] text-white rounded-lg hover:bg-[#8B3030] transition-colors duration-200 shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline font-medium text-sm">
                New Chat
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
