const values = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Innovation First",
    description:
      "We constantly push boundaries with AI technology to revolutionize how people discover and create recipes, making cooking more accessible and exciting.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-white"
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
    ),
    title: "Filipino Pride",
    description:
      "We celebrate and preserve Filipino culinary heritage while embracing global flavors, ensuring our culture remains at the heart of every recipe.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Community Driven",
    description:
      "Built for and with our users. We listen to feedback, adapt to needs, and create features that truly make a difference in your cooking journey.",
  },
];

export default function ValuesSection() {
  return (
    <section
      id="our-values"
      className="w-full py-16 md:py-20 bg-gradient-to-b from-white to-[#FEF9E1]/20"
    >
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#6D2323] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
            What Drives Us
          </span>
          <h2 className="text-[#1a1a1a] font-bold text-3xl md:text-4xl mb-6">
            Our Values
          </h2>
          <p className="text-[#454545] text-lg mb-12 max-w-2xl mx-auto">
            The principles that guide every decision we make at PanlasaLabs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-md">
                <div className="w-16 h-16 bg-[#6D2323] rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-[#6D2323] font-bold text-xl mb-3">
                  {value.title}
                </h3>
                <p className="text-[#454545] text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
