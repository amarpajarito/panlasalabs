import Image from "next/image";

interface FeatureCardProps {
  imageSrc: string;
  title: string;
  description: string;
  imageAlt?: string;
}

export default function FeatureCard({
  imageSrc,
  title,
  description,
  imageAlt,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md">
      {/* Image */}
      <div className="relative w-full h-48">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-[#1a1a1a] font-bold text-lg md:text-xl mb-2">
          {title}
        </h3>
        <p className="text-[#454545] text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
