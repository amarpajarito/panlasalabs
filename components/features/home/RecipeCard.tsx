import Image from "next/image";

interface RecipeCardProps {
  imageSrc: string;
  title: string;
  description: string;
  imageAlt?: string;
}

export default function RecipeCard({
  imageSrc,
  title,
  description,
  imageAlt,
}: RecipeCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full flex flex-col hover:scale-105 hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          width={400}
          height={400}
          className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#6D2323]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-white font-semibold text-sm flex items-center gap-2">
            View Recipe
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-[#6D2323] font-bold text-xl mb-3 group-hover:text-[#8B3030] transition-colors">
          {title}
        </h3>
        <p className="text-[#454545] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
