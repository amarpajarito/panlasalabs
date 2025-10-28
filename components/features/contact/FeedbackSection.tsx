"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function FeedbackSection() {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isLoggedIn = !!session;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        rating,
        message: feedback,
        user: session?.user ?? null,
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Try to parse JSON but guard against empty/non-json responses
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        // no-op: leave data as null
      }

      if (!res.ok) {
        console.error(
          "Failed to submit feedback status:",
          res.status,
          "body:",
          data
        );
        setSuccessMessage("Failed to submit feedback. Please try again.");
      } else {
        setSuccessMessage("Thank you for your feedback!");
        // If API returned the normalized feedback and/or provided user info, emit a client event
        try {
          const normalized = data?.feedback ?? null;
          const provided = data?.provided ?? null;
          const emitted = {
            rating: normalized?.rating ?? rating,
            message: normalized?.message ?? feedback,
            name:
              normalized?.name ??
              provided?.provided_name ??
              session?.user?.name ??
              null,
            avatar_url:
              normalized?.avatar_url ??
              provided?.provided_avatar ??
              session?.user?.image ??
              null,
            created_at: normalized?.created_at ?? new Date().toISOString(),
          };
          // dispatch a cross-window event so the reviews component can listen and update immediately
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("feedback:submitted", { detail: emitted })
            );
          }
        } catch (e) {
          console.warn("Could not emit feedback event", e);
        }

        setRating(0);
        setFeedback("");
      }

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSuccessMessage("Failed to submit feedback. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="feedback"
      className="w-full py-16 md:py-20 bg-gradient-to-b from-white to-[#FEF9E1]/20"
    >
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[#6D2323] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
              Share Your Experience
            </span>
            <h2 className="text-[#1a1a1a] font-bold text-4xl md:text-5xl mb-4">
              We Value Your Feedback
            </h2>
            <p className="text-[#454545] text-lg md:text-xl max-w-2xl mx-auto">
              Your insights help us improve PanlasaLabs and serve you better
            </p>
          </div>

          {/* Notice Badge */}
          {!isLoggedIn && (
            <div className="bg-[#FEF9E1] border border-[#6D2323]/20 rounded-xl p-4 mb-8 flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[#6D2323] flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-[#454545] text-sm md:text-base">
                <strong className="text-[#6D2323]">Note:</strong> You need to be
                logged in or create an account to share your feedback with us.
              </p>
            </div>
          )}

          {/* Feedback Form */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg">
            {!isLoggedIn ? (
              // Show login prompt if user is not logged in
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#FEF9E1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#6D2323]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-[#1a1a1a] font-bold text-xl md:text-2xl mb-3">
                  Sign In to Share Feedback
                </h3>
                <p className="text-[#454545] text-sm md:text-base mb-6 max-w-md mx-auto">
                  We'd love to hear from you! Please sign in to your account to
                  share your experience with PanlasaLabs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/login">
                    <button className="bg-[#6D2323] text-white px-8 py-3 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold">
                      Sign In
                    </button>
                  </a>
                  <a href="/signup">
                    <button className="border-2 border-[#6D2323] text-[#6D2323] px-8 py-3 rounded-lg hover:bg-[#6D2323] hover:text-white transition-colors duration-200 font-semibold">
                      Create Account
                    </button>
                  </a>
                </div>
              </div>
            ) : (
              // Show feedback form if user is logged in
              <form onSubmit={handleSubmit} className="space-y-8">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {successMessage}
                  </div>
                )}

                {/* Rating Section */}
                <div>
                  <label className="block text-[#1a1a1a] font-semibold text-lg mb-4 text-center">
                    How would you rate your experience?
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        <svg
                          className="w-10 h-10 md:w-12 md:h-12"
                          fill={
                            star <= (hoveredRating || rating)
                              ? "#6D2323"
                              : "none"
                          }
                          stroke={
                            star <= (hoveredRating || rating)
                              ? "#6D2323"
                              : "#6D2323"
                          }
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-center text-[#6D2323] font-medium mt-3">
                      {rating === 5 && "Excellent!"}
                      {rating === 4 && "Great!"}
                      {rating === 3 && "Good"}
                      {rating === 2 && "Fair"}
                      {rating === 1 && "Needs Improvement"}
                    </p>
                  )}
                </div>

                {/* Feedback Text */}
                <div>
                  <label
                    htmlFor="feedback"
                    className="block text-[#1a1a1a] font-semibold text-sm mb-2"
                  >
                    Tell us more about your experience
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-[#6D2323]/20 rounded-lg focus:outline-none focus:border-[#6D2323] transition-colors duration-200 resize-none"
                    placeholder="What did you like? What could we improve?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="w-full bg-[#6D2323] text-white px-8 py-3.5 rounded-lg hover:bg-[#8B3030] transition-colors duration-200 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            )}
          </div>

          {/* Info Message */}
          {isLoggedIn && (
            <p className="text-center text-[#454545] text-sm mt-6">
              Your feedback will be associated with your account and helps us
              create a better experience for everyone 🙏
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
