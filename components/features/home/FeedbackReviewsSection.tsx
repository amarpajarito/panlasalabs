"use client";

import ReviewCard from "./ReviewCard";
import { useState } from "react";

// Constants
const DEFAULT_AVATAR = "/images/testimonial-user-logo.png";

const reviews = [
  {
    rating: 5,
    review:
      "PanlasaLabs made cooking so much easier! I just type in what's in my fridge and get amazing Filipino recipes. Perfect for busy weeknights!",
    name: "Maria Santos",
    designation: "Home Cook",
  },
  {
    rating: 4,
    review:
      "The AI suggestions are really smart. It helped me create a healthier version of adobo that my family loved. Highly recommend!",
    name: "Juan dela Cruz",
    designation: "Food Enthusiast",
  },
  {
    rating: 5,
    review:
      "As a beginner cook, this app is a lifesaver! The step-by-step instructions are clear, and the Filipino recipes are authentic.",
    name: "Angela Reyes",
    designation: "Student",
  },
  {
    rating: 5,
    review:
      "I love how it considers my dietary restrictions. Finally found a recipe generator that understands vegetarian Filipino cuisine!",
    name: "Carlos Bautista",
    designation: "Vegetarian Chef",
  },
  {
    rating: 4,
    review:
      "Great for discovering new recipes! The ingredient swap feature is brilliant when I'm missing something. Very practical and user-friendly.",
    name: "Liza Mendoza",
    designation: "Working Mom",
  },
  {
    rating: 5,
    review:
      "This changed how I meal prep! The AI understands Filipino flavors perfectly and helps reduce food waste. Salamat PanlasaLabs!",
    name: "Ramon Garcia",
    designation: "Meal Prep Enthusiast",
  },
];

// Star Rating Component
const StarRating = ({
  rating,
  size = "w-4 h-4",
}: {
  rating: number;
  size?: string;
}) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`${size} fill-current text-yellow-400`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))}
  </div>
);

export default function FeedbackReviewsSection() {
  const [filter, setFilter] = useState<"all" | 5 | 4 | 3>("all");

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((review) => review.rating === filter);

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section
      id="testimonials"
      className="w-full py-16 md:py-20 bg-gradient-to-b from-white to-[#FEF9E1]/20"
    >
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div>
            <span className="text-[#6D2323] text-sm font-bold uppercase tracking-[0.2em] mb-3 block">
              Testimonials
            </span>
            <h2 className="text-[#1a1a1a] font-bold text-4xl md:text-5xl mb-2">
              Feedback & Reviews
            </h2>
            <p className="text-[#454545] text-lg">
              What our users are saying about PanlasaLabs
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#6D2323] mb-1">
                {averageRating}
              </div>
              <StarRating rating={5} />
              <p className="text-sm text-[#454545]">{reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              filter === "all"
                ? "bg-[#6D2323] text-white shadow-lg"
                : "bg-white text-[#6D2323] border-2 border-[#6D2323] hover:bg-[#6D2323] hover:text-white"
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilter(5)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              filter === 5
                ? "bg-[#6D2323] text-white shadow-lg"
                : "bg-white text-[#6D2323] border-2 border-[#6D2323] hover:bg-[#6D2323] hover:text-white"
            }`}
          >
            ⭐ 5 Stars
          </button>
          <button
            onClick={() => setFilter(4)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              filter === 4
                ? "bg-[#6D2323] text-white shadow-lg"
                : "bg-white text-[#6D2323] border-2 border-[#6D2323] hover:bg-[#6D2323] hover:text-white"
            }`}
          >
            ⭐ 4 Stars
          </button>
          <button
            onClick={() => setFilter(3)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              filter === 3
                ? "bg-[#6D2323] text-white shadow-lg"
                : "bg-white text-[#6D2323] border-2 border-[#6D2323] hover:bg-[#6D2323] hover:text-white"
            }`}
          >
            ⭐ 3 Stars
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review, index) => (
            <ReviewCard
              key={index}
              rating={review.rating}
              review={review.review}
              avatarSrc={DEFAULT_AVATAR}
              name={review.name}
              designation={review.designation}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#454545] text-lg">
              No reviews found with this rating.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
