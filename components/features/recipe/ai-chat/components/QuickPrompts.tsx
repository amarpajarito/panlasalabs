interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  const prompts = [
    "Chicken Adobo",
    "Sinigang na Hipon",
    "Sizzling Pork Sisig",
    "Kare-Kare",
  ];

  return (
    <div className="px-4 pb-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#454545] text-sm mb-3 text-center font-medium">
          Quick prompts to get started:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(prompt)}
              className="px-4 py-3 border border-[#6D2323]/20 rounded-lg hover:bg-[#FEF9E1] hover:border-[#6D2323]/30 hover:shadow-sm transition-all duration-200 text-[#454545] text-sm text-left group"
            >
              <span className="group-hover:text-[#6D2323] transition-colors">
                {prompt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
