import AllRecipesSection from "@/components/features/recipe/AllRecipesSection";

export default function AllRecipesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full py-16 md:py-20">
        <div className="max-w-[1512px] mx-auto px-4 sm:px-6 md:px-12 lg:px-[86px]">
          <div className="mb-8">
            <h1 className="text-[#1a1a1a] font-bold text-3xl md:text-4xl lg:text-5xl mb-2">
              All Recipes
            </h1>
            <p className="text-[#454545] text-base md:text-lg max-w-2xl">
              A collection of recipes — click a card to quickly view ingredients
              and step-by-step instructions.
            </p>
          </div>

          <AllRecipesSection />
        </div>
      </section>
    </main>
  );
}
