export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Tell Us Your Preferences",
      description:
        "Share your available ingredients, cuisine preferences, dietary restrictions, or just describe what you're craving. Our AI understands it all.",
      icon: (
        <svg
          className="w-12 h-12 text-[#6D2323]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "AI Creates Your Recipe",
      description:
        "Powered by Google Gemini, our AI instantly generates a personalized recipe tailored to your needs, complete with ingredients and cooking times.",
      icon: (
        <svg
          className="w-12 h-12 text-[#6D2323]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Start Cooking",
      description:
        "Follow clear, step-by-step instructions with helpful tips. Save your favorites, adjust servings, and share your culinary creations with the community.",
      icon: (
        <svg
          className="w-12 h-12 text-[#6D2323]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full py-16 md:py-20 bg-gradient-to-b from-white to-[#FEF9E1]/20"
    >
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#6D2323] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
            Simple Process
          </span>
          <h2 className="text-[#1a1a1a] font-bold text-4xl md:text-5xl mb-4">
            How It Works
          </h2>
          <p className="text-[#454545] text-lg md:text-xl max-w-2xl mx-auto">
            From ingredients to a complete recipe in three easy steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (hidden on mobile, shown on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-[#6D2323]/20 -z-10">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#6D2323]/40 rounded-full"></div>
                </div>
              )}

              {/* Card */}
              <div className="bg-white rounded-2xl p-8 shadow-md h-full">
                {/* Step Number */}
                <div className="inline-block bg-[#FEF9E1] text-[#6D2323] font-bold text-2xl px-4 py-2 rounded-lg mb-4">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6">{step.icon}</div>

                {/* Content */}
                <h3 className="text-[#1a1a1a] font-bold text-xl md:text-2xl mb-4">
                  {step.title}
                </h3>
                <p className="text-[#454545] text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="/signup">
            <button className="bg-[#6D2323] text-white px-8 py-4 rounded-xl hover:bg-[#8B3030] transition-colors duration-300 font-semibold text-lg shadow-lg">
              Start Generating Recipes
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
