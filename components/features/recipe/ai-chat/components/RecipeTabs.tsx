interface RecipeTabsProps {
  activeTab: "ingredients" | "instructions";
  setActiveTab: (tab: "ingredients" | "instructions") => void;
}

export function RecipeTabs({ activeTab, setActiveTab }: RecipeTabsProps) {
  const tabs: Array<"ingredients" | "instructions"> = [
    "ingredients",
    "instructions",
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-semibold text-base transition-all relative ${
              activeTab === tab
                ? "text-[#6D2323]"
                : "text-gray-500 hover:text-[#6D2323]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D2323]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
