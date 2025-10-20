import Image from "next/image";

interface ReviewCardProps {
  rating: number;
  review: string;
  avatarSrc: string;
  name: string;
  designation: string;
}

export default function ReviewCard({
  rating,
  review,
  avatarSrc,
  name,
  designation,
}: ReviewCardProps) {
  return (
    <div className="bg-[#6D2323] text-white rounded-2xl p-8 shadow-lg">
      {/* Rating Stars */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 fill-current ${
              i < rating ? "text-yellow-300" : "text-gray-400"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>

      {/* Review Quote */}
      <div className="relative mb-6">
        <svg
          className="absolute -top-2 -left-2 w-8 h-8 text-white/20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
        <p className="text-lg md:text-xl leading-relaxed pl-6">{review}</p>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <div className="relative">
          <Image
            src={avatarSrc}
            alt={`${name} avatar`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
          />
        </div>
        <div>
          <p className="font-semibold text-base">{name}</p>
          <p className="text-sm opacity-80">{designation}</p>
        </div>
      </div>
    </div>
  );
}
