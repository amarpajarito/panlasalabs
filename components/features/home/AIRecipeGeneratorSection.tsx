import Image from "next/image";
import Link from "next/link";

const capabilities = [
  "Advanced natural language understanding for ingredient and recipe analysis",
  "Context-aware suggestions that learn from your preferences and dietary needs",
  "Real-time recipe generation with accurate measurements and cooking instructions",
  "Multi-cuisine knowledge spanning Filipino traditions to international flavors",
];

export default function AIRecipeGeneratorSection() {
  return (
    <section
      id="ai-technology"
      className="w-full py-16 md:py-20 bg-gradient-to-b from-white to-[#FEF9E1]/20"
    >
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            {/* Section Label */}
            <span className="text-[#6D2323] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
              AI Technology
            </span>

            {/* Heading */}
            <h2 className="text-[#1a1a1a] font-bold text-4xl md:text-5xl mb-6 leading-tight">
              Powered by Google Gemini
            </h2>

            {/* Description */}
            <p className="text-[#454545] text-lg md:text-xl mb-10 leading-relaxed">
              PanlasaLabs leverages Google's advanced Gemini AI to deliver
              intelligent, personalized recipe recommendations. Experience
              cutting-edge artificial intelligence that understands your
              culinary needs.
            </p>

            {/* Capabilities List */}
            <ul className="space-y-4 mb-10">
              {capabilities.map((capability, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[#454545] text-base leading-relaxed"
                >
                  <span className="text-[#6D2323] mt-1.5">•</span>
                  <span>{capability}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://gemini.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="group bg-[#6D2323] text-white px-8 py-4 rounded-xl hover:bg-[#8B3030] transition-all duration-300 font-semibold text-base w-full sm:w-auto shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Try now
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </Link>
              <Link
                href="https://ai.google.dev/gemini-api/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="border-2 border-[#6D2323] text-[#6D2323] px-8 py-4 rounded-xl hover:bg-[#6D2323] hover:text-white transition-all duration-300 font-semibold text-base w-full sm:w-auto">
                  Learn about Gemini
                </button>
              </Link>
            </div>
          </div>

          {/* Gemini Logo */}
          <div className="flex items-center justify-center">
            <Image
              src="/images/gemini-logo.svg"
              alt="Google Gemini Logo"
              width={400}
              height={400}
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
