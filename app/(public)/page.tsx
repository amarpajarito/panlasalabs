import HeroSection from "@/components/features/home/HeroSection";
import TrendingRecipesSection from "@/components/features/home/TrendingRecipeSection";
import HowItWorksSection from "@/components/features/home/HowItWorksSection";
import AIRecipeGeneratorSection from "@/components/features/home/AIRecipeGeneratorSection";
import FeedbackReviewsSection from "@/components/features/home/FeedbackReviewsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <TrendingRecipesSection />
      <HowItWorksSection />
      <AIRecipeGeneratorSection />
      <FeedbackReviewsSection />
    </main>
  );
}
