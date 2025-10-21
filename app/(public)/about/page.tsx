import AboutHeroSection from "@/components/features/about/AboutHeroSection";
import StorySection from "@/components/features/about/StorySection";
import ValuesSection from "@/components/features/about/ValuesSection";
import TeamSection from "@/components/features/about/TeamSection";
import AboutCTASection from "@/components/features/about/AboutCTASection";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHeroSection />
      <StorySection />
      <ValuesSection />
      <TeamSection />
      <AboutCTASection />
    </main>
  );
}
