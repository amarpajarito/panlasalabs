"use client";

import FeatureCard from "./FeatureCard";

const features = [
  {
    src: "/images/home/home-5.jpg",
    alt: "AI-Powered Generation",
    title: "AI-Powered Generation",
    description:
      "Advanced algorithms create personalized recipes tailored to your unique preferences and available ingredients",
  },
  {
    src: "/images/home/home-6.jpg",
    alt: "Filipino Cuisine Focus",
    title: "Filipino Heritage",
    description:
      "Deep focus on authentic Filipino recipes while seamlessly offering diverse international cuisines",
  },
  {
    src: "/images/home/home-7.jpg",
    alt: "Personalized Experience",
    title: "Your Preferences Matter",
    description:
      "Accommodates dietary restrictions, allergies, and flavor preferences to create recipes just for you",
  },
];

export default function WhatWeDoSection() {
  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-[#6D2323] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
            What We Do
          </span>
          <h2 className="text-[#1a1a1a] font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Your AI-Powered Culinary Assistant
          </h2>
          <p className="text-[#454545] text-lg md:text-xl leading-relaxed">
            PanlasaLabs transforms the way you discover recipes by combining
            artificial intelligence with Filipino culinary heritage to deliver
            personalized cooking experiences.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              imageSrc={feature.src}
              imageAlt={feature.alt}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* Bottom Stats/Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t-2 border-[#F5F5F5]">
          <div className="text-center">
            <h4 className="text-[#6D2323] font-bold text-3xl md:text-4xl mb-2">
              Filipino First
            </h4>
            <p className="text-[#454545] text-sm md:text-base">
              Specializing in authentic Filipino recipes with cultural integrity
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-[#6D2323] font-bold text-3xl md:text-4xl mb-2">
              Smart AI
            </h4>
            <p className="text-[#454545] text-sm md:text-base">
              Powered by advanced algorithms for truly personalized results
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-[#6D2323] font-bold text-3xl md:text-4xl mb-2">
              Your Way
            </h4>
            <p className="text-[#454545] text-sm md:text-base">
              Adapts to dietary needs, allergies, and flavor preferences
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
