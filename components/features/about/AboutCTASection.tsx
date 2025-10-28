"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const socialProof = [
  {
    text: "Free to join",
    icon: (
      <svg
        className="w-4 h-4 text-[#FEF9E1]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    text: "AI-powered recipes",
    icon: (
      <svg
        className="w-4 h-4 text-[#FEF9E1]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    text: "Filipino & global cuisine",
    icon: (
      <svg
        className="w-4 h-4 text-[#FEF9E1]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
];

export default function AboutCTASection() {
  const { status } = useSession();
  const recipeHref = status === "authenticated" ? "/recipe" : "/signup";
  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-[#FEF9E1]/20 to-white">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        <div className="bg-[#6D2323] rounded-2xl p-8 md:p-12 text-center">
          {/* Badge */}
          <div className="inline-block mb-4">
            <span className="bg-[#FEF9E1] text-[#6D2323] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Join Our Community
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-white font-bold text-3xl md:text-4xl mb-3">
            Ready to Start Cooking?
          </h2>

          {/* Description */}
          <p className="text-white/90 text-base md:text-lg mb-6 max-w-xl mx-auto">
            Join thousands of home cooks discovering new recipes with AI-powered
            personalization
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <Link href={recipeHref}>
              <button className="group bg-white text-[#6D2323] px-8 py-3 rounded-lg hover:bg-[#FEF9E1] transition-colors duration-200 font-semibold shadow-lg flex items-center gap-2">
                Start Your Journey
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
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

            <Link href="/allrecipes">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#6D2323] transition-colors duration-200 font-semibold">
                Explore Recipes
              </button>
            </Link>
          </div>

          {/* Social Proof - Inline */}
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center items-center text-white/80 text-xs md:text-sm pt-6 border-t border-white/20">
            {socialProof.map((proof, index) => (
              <span key={index} className="flex items-center gap-1.5">
                {proof.icon}
                {proof.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
