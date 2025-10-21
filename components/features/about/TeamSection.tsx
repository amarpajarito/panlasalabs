import Image from "next/image";

const developers = [
  {
    name: "Jae Gatmaitan",
    role: "UI/UX Designer",
    image: "/images/about/Jae Gatmaitan.png",
    description: "Crafting intuitive and beautiful user experiences",
  },
  {
    name: "Amar Pajarito",
    role: "Full Stack Developer",
    image: "/images/about/Amar Pajarito.png",
    description: "Building robust and scalable applications",
  },
  {
    name: "Aaron San Pedro",
    role: "UI/UX Designer",
    image: "/images/about/Aaron San Pedro.png",
    description: "Designing seamless user interactions",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="w-full py-16 md:py-20">
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        <div className="text-center mb-12">
          <span className="text-[#6D2323] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
            Meet The Team
          </span>
          <h2 className="text-[#1a1a1a] font-bold text-4xl md:text-5xl mb-4">
            Developers
          </h2>
          <p className="text-[#454545] text-lg md:text-xl max-w-2xl mx-auto">
            The passionate team behind PanlasaLabs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.slice(0, 3).map((dev, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src={dev.image}
                  alt={dev.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-[#1a1a1a] font-bold text-xl mb-1">
                  {dev.name}
                </h3>
                <p className="text-[#6D2323] font-semibold text-sm mb-3">
                  {dev.role}
                </p>
                <p className="text-[#454545] text-sm">{dev.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row - Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-3xl mx-auto">
          {developers.slice(3).map((dev, index) => (
            <div
              key={index + 3}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src={dev.image}
                  alt={dev.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-[#1a1a1a] font-bold text-xl mb-1">
                  {dev.name}
                </h3>
                <p className="text-[#6D2323] font-semibold text-sm mb-3">
                  {dev.role}
                </p>
                <p className="text-[#454545] text-sm">{dev.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
