import Image from "next/image";

export default function StorySection() {
  return (
    <section id="our-story" className="w-full py-12 md:py-16">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="pr-0 lg:pr-8">
            <h2 className="text-[#6D2323] font-bold text-3xl md:text-4xl mb-6">
              How PanlasaLabs Began
            </h2>
            <div className="space-y-4 text-[#454545] text-base md:text-lg leading-relaxed">
              <p>
                <strong className="text-[#6D2323]">
                  PanlasaLabs began with a simple idea
                </strong>{" "}
                — to make cooking feel less like a chore and more like an
                adventure. It's an AI-powered web application that learns your
                taste, understands what ingredients you have, and crafts
                personalized recipes just for you.
              </p>
              <p>
                Whether you're a beginner exploring new dishes or a foodie
                experimenting with flavors, PanlasaLabs guides you step-by-step,
                helping you transform simple ingredients into something
                extraordinary.
              </p>
              <p>
                <strong className="text-[#6D2323]">
                  From local favorites to global cuisines
                </strong>
                , PanlasaLabs redefines how you cook — making every meal a story
                of creativity, taste, and innovation.
              </p>
            </div>
          </div>

          {/* Image - constrained width for large screens */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="rounded-2xl overflow-hidden shadow-2xl max-w-[420px] md:max-w-[520px] mx-auto lg:mx-0">
              <Image
                src="/images/about/about-1.jpg"
                alt="Cooking with passion"
                width={520}
                height={650}
                className="w-full object-cover aspect-[4/5]"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-[#FEF9E1] rounded-2xl -z-10 hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
