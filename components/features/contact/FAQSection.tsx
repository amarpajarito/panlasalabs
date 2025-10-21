"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How does the AI recipe generator work?",
    answer:
      "Our AI-powered recipe generator uses Google Gemini to understand your preferences, available ingredients, and dietary restrictions. It then creates personalized recipes with step-by-step instructions tailored just for you.",
  },
  {
    question: "Is PanlasaLabs free to use?",
    answer:
      "Yes! PanlasaLabs is completely free to join and use. Simply create an account to start generating personalized recipes powered by AI.",
  },
  {
    question: "Can I save my favorite recipes?",
    answer:
      "Absolutely! Once you create an account, you can save your favorite recipes, adjust serving sizes, and access them anytime from your personal recipe collection.",
  },
  {
    question: "What types of cuisines are available?",
    answer:
      "We specialize in Filipino cuisine while also offering recipes from global cuisines. From traditional adobo to international favorites, our AI can create diverse recipes based on your taste.",
  },
  {
    question: "Can I specify dietary restrictions?",
    answer:
      "Yes! You can specify dietary restrictions like vegetarian, vegan, gluten-free, or allergies. Our AI will generate recipes that accommodate your specific needs.",
  },
  {
    question: "How accurate are the cooking times?",
    answer:
      "Our AI provides estimated cooking times based on standard kitchen equipment and techniques. Actual times may vary depending on your specific setup and preferences.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 md:py-20">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[#6D2323] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
              Common Questions
            </span>
            <h2 className="text-[#1a1a1a] font-bold text-4xl md:text-5xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[#454545] text-lg md:text-xl">
              Find answers to the most common questions about PanlasaLabs
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#FEF9E1]/30 transition-colors duration-200"
                >
                  <span className="text-[#1a1a1a] font-semibold text-base md:text-lg pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#6D2323] flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-[#454545] text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <div className="mt-12 text-center bg-[#FEF9E1] rounded-xl p-8">
            <h3 className="text-[#1a1a1a] font-bold text-xl md:text-2xl mb-2">
              Still have questions?
            </h3>
            <p className="text-[#454545] text-sm md:text-base mb-4">
              Can't find the answer you're looking for? Feel free to reach out
              to our support team.
            </p>
            <a href="#contact-form">
              <button className="bg-[#6D2323] text-white px-6 py-2.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-sm">
                Contact Support
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
