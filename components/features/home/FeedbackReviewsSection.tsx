"use client";

import ReviewCard from "./ReviewCard";
import { useState, useEffect } from "react";

// Constants
const DEFAULT_AVATAR = "/images/testimonial-user-logo.png";

// Demo placeholders shown alongside real feedback to ensure the section
// always looks populated during demos. These are used as the initial
// state and to fill up to 6 items when the server returns fewer rows.
const PLACEHOLDER_REVIEWS = [
  {
    rating: 5,
    message:
      "The adobo recipe was spot on, simple steps, well-explained, and the balance of vinegar and soy was perfect. My whole family loved it.",
    name: "Maria Santos",
    avatar_url: null,
    created_at: new Date().toISOString(),
    placeholder: true,
  },
  {
    rating: 4,
    message:
      "Sinigang instructions were clear. I reduced the tamarind a bit for my kids and it was delicious. Would love more suggestions for vegetable swaps.",
    name: "Jose Reyes",
    avatar_url: null,
    created_at: new Date().toISOString(),
    placeholder: true,
  },
  {
    rating: 5,
    message:
      "I tried the pancit canton recipe, fast to make and the flavors came together nicely. Portion sizes were realistic for a family of four.",
    name: "Ana Cruz",
    avatar_url: null,
    created_at: new Date().toISOString(),
    placeholder: true,
  },
  {
    rating: 4,
    message:
      "The grilling tips (especially for pork) really helped, my lechon kawali turned out crispier than usual. Nice practical advice.",
    name: "Miguel Dela Cruz",
    avatar_url: null,
    created_at: new Date().toISOString(),
    placeholder: true,
  },
  {
    rating: 5,
    message:
      "Leche flan guide was excellent: clear timing and caramel technique made it silky smooth. Will use this for special occasions.",
    name: "Katrina Lopez",
    avatar_url: null,
    created_at: new Date().toISOString(),
    placeholder: true,
  },
  {
    rating: 4,
    message:
      "Loved the vegetarian ulam ideas, creative and satisfying. Would appreciate a few more protein alternatives for meal prep.",
    name: "Mark Villanueva",
    avatar_url: null,
    created_at: new Date().toISOString(),
    placeholder: true,
  },
];

// Star Rating Component that fills based on rating (0-5)
const StarRating = ({
  rating,
  size = "w-4 h-4",
}: {
  rating: number;
  size?: string;
}) => (
  <div className="flex gap-1">
    {[0, 1, 2, 3, 4].map((i) => {
      const filled = i < Math.round(rating);
      return (
        <svg
          key={i}
          className={`${size} ${
            filled ? "fill-current text-yellow-400" : "text-gray-300"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    })}
  </div>
);

export default function FeedbackReviewsSection() {
  const [filter, setFilter] = useState<"all" | 5 | 4 | 3>("all");
  const [reviews, setReviews] = useState<any[]>(PLACEHOLDER_REVIEWS);
  const [loading, setLoading] = useState(false);

  // Fetch feedback from API
  async function loadFeedback() {
    try {
      setLoading(true);
      const res = await fetch("/api/feedback");
      const data = await res.json();
      if (res.ok && data?.feedback) {
        // Map server rows to expected shape
        const mapped = data.feedback.map((r: any) => ({
          rating: r.rating,
          message: r.message,
          // don't force anonymous here; let the UI prefer server/user data
          name: r.name ?? null,
          avatar_url: r.avatar_url ?? null,
          created_at: r.created_at,
          provided_name: r.provided_name ?? null,
          provided_avatar: r.provided_avatar ?? null,
        }));
        // If server returned many rows, show them. Otherwise merge with
        // demo placeholders so the grid always looks full for demos.
        if (Array.isArray(mapped) && mapped.length > 0) {
          if (mapped.length >= 6) {
            setReviews(mapped);
          } else {
            // append placeholders to reach at least 6 items
            const merged = [...mapped, ...PLACEHOLDER_REVIEWS].slice(0, 6);
            setReviews(merged);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load feedback:", err);
    } finally {
      setLoading(false);
    }
  }

  // Load on mount
  useEffect(() => {
    loadFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for immediate client-side feedback submissions so we can show them without waiting for DB
  useEffect(() => {
    function onSubmitted(e: any) {
      const d = e.detail;
      if (!d) return;
      // prepend submitted review if not already present
      setReviews((prev) => {
        const exists = prev.some(
          (r) => r.created_at === d.created_at && r.message === d.message
        );
        if (exists) return prev;
        // prepend the new item and then remove placeholders if we exceed 6
        const newArr = [
          {
            rating: d.rating,
            message: d.message,
            name: d.name,
            avatar_url: d.avatar_url,
            created_at: d.created_at,
          },
          ...prev,
        ];
        // Remove placeholder items at the end to keep the list length reasonable
        const filtered = newArr.filter((r) => !r.placeholder || r.name !== undefined);
        // Ensure at most 6 items (prefer real entries)
        return filtered.slice(0, 6);
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener(
        "feedback:submitted",
        onSubmitted as EventListener
      );
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "feedback:submitted",
          onSubmitted as EventListener
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((review) => review.rating === filter);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : "0.0";

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
              <StarRating rating={Number(averageRating)} />
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
              review={review.message ?? review.review ?? ""}
              avatarSrc={
                review.avatar_url ?? review.provided_avatar ?? DEFAULT_AVATAR
              }
              name={review.name ?? review.provided_name ?? "Anonymous"}
              designation={review.designation ?? ""}
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
