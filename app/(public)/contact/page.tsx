import ContactHeroSection from "@/components/features/contact/ContactHeroSection";
import ContactFormSection from "@/components/features/contact/ContactFormSection";
import FeedbackSection from "@/components/features/contact/FeedbackSection";
import FAQSection from "@/components/features/contact/FAQSection";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactHeroSection />
      <ContactFormSection />
      <FeedbackSection />
      <FAQSection />
    </main>
  );
}
