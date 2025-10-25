import Image from "next/image";

export default function StorySection() {
  return (
    <section id="our-story" className="w-full py-24 md:py-32 bg-white">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 space-y-10">
            {/* Heading */}
            <h2 className="text-[#1a1a1a] font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
              How PanlasaLabs <br />
              <span className="text-[#6D2323]">Began</span>
            </h2>

            {/* Story Paragraphs */}
            <div className="space-y-8 text-[#454545] text-lg leading-relaxed">
              <p>
                PanlasaLabs was founded by a group of students who shared a
                passion for both food and technology. They noticed how many
                people, especially beginners, wanted to cook but often struggled
                to find recipes that matched their ingredients, time, or skill
                level.
              </p>

              <p>
                Inspired by this challenge, they developed an AI-powered web
                application designed to act as a personal culinary assistant.
                The system generates recipes based on the ingredients users have
                on hand, their preferred flavors, and even their dietary needs.
              </p>

              <p>
                PanlasaLabs represents the team's belief that food and
                innovation can go hand in hand. By blending local flavors with
                modern technology, it encourages everyone to explore, create,
                and savor every dish with confidence and curiosity.
              </p>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/about/about-1.jpg"
                alt="Cooking with passion"
                width={600}
                height={650}
                className="w-full h-[450px] md:h-[600px] object-cover"
              />
            </div>

            {/* Simple Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FEF9E1] rounded-2xl -z-10 hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
