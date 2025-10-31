interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="bg-white border-t border-[#6D2323]/10 px-4 py-4 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSubmit(e)}
            placeholder="Describe what you'd like to cook, or list your ingredients..."
            className="flex-1 px-4 py-3 border border-[#6D2323]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D2323]/20 focus:border-[#6D2323] transition-all duration-200"
            disabled={isLoading}
          />
          <button
            onClick={onSubmit}
            disabled={!input.trim() || isLoading}
            className="bg-[#6D2323] text-white px-6 py-3 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
          >
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span className="hidden sm:inline font-medium">Send</span>
          </button>
        </div>
        <p className="text-[#454545] text-xs text-center mt-3">
          AI can make mistakes. Verify important recipe information.
        </p>
      </div>
    </div>
  );
}
