"use client";

export default function PublicGenerateRecipe() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-[#FEF9E1]/30 to-white">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2.5 bg-[#FEF9E1] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#6D2323]/10">
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span className="text-gray-700">AI Powered Recipe Generator</span>
          </div>

          <h1 className="text-[#1a1a1a] font-bold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Generate Your Recipe
          </h1>
          <p className="text-[#454545] text-xl md:text-2xl leading-relaxed">
            Tell us what you have, and let AI create the perfect recipe for you
          </p>
        </div>

        {/* Notice Badge */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-[#FEF9E1] border border-[#6D2323]/20 rounded-xl p-4 flex items-center gap-3">
            <svg
              className="w-5 h-5 text-[#6D2323] flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-[#454545] text-sm md:text-base">
              <strong className="text-[#6D2323]">Note:</strong> You need to be
              logged in or create an account to generate personalized recipes.
            </p>
          </div>
        </div>

        {/* Login Prompt Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center">
            <div className="w-20 h-20 bg-[#FEF9E1] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-[#6D2323]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h2 className="text-[#1a1a1a] font-bold text-2xl md:text-3xl mb-4">
              Sign In to Start Creating
            </h2>
            <p className="text-[#454545] text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Create an account or sign in to unlock AI-powered recipe
              generation tailored to your preferences, ingredients, and dietary
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup">
                <button className="bg-[#6D2323] text-white px-8 py-3.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-base flex items-center gap-2">
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Create Free Account
                </button>
              </a>
              <a href="/login">
                <button className="bg-white border-2 border-[#6D2323] text-[#6D2323] px-8 py-3.5 rounded-lg hover:bg-[#6D2323] hover:text-white transition-colors duration-200 font-semibold text-base">
                  Sign In
                </button>
              </a>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-[#6D2323]/10">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FEF9E1] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-[#6D2323]"
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
                </div>
                <h3 className="text-[#1a1a1a] font-semibold text-sm mb-1">
                  AI-Powered
                </h3>
                <p className="text-[#454545] text-xs">
                  Smart recipe generation
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#FEF9E1] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-[#6D2323]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-[#1a1a1a] font-semibold text-sm mb-1">
                  Personalized
                </h3>
                <p className="text-[#454545] text-xs">Based on your taste</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#FEF9E1] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-[#6D2323]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-[#1a1a1a] font-semibold text-sm mb-1">
                  Instant
                </h3>
                <p className="text-[#454545] text-xs">Recipes in seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
