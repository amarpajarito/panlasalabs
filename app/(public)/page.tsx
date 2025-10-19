import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="px-3 md:px-[86px] pt-[49px] pb-12">
        <h1 className="text-[#6D2323] font-bold text-4xl md:text-5xl mb-4">
          PanlasaLabs
        </h1>
        <p className="text-[#454545] mb-6 max-w-lg text-base md:text-lg">
          An AI-powered web application designed to function as a personalized
          culinary assistant.
        </p>
        <Link href="/cuisines">
          <button className="bg-[#6D2323] text-white px-6 py-3 rounded hover:bg-[#4A1818] transition-colors font-medium">
            Generate a recipe now!
          </button>
        </Link>
        <div className="rounded-xl overflow-hidden shadow-lg mt-8 w-full">
          <Image
            src="/images/home/home-1.png"
            alt="Colorful Smoothies"
            width={1344}
            height={640}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </section>

      {/* Generated Recipes Section */}
      <section className="px-4 md:px-[86px] py-12">
        <h2 className="text-[#6D2323] font-bold text-3xl mb-8">
          Generated Recipes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recipe Card 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <Image
              src="/images/adobong chickchicken.png"
              alt="Adobo in Balsamic Vinegar"
              width={405}
              height={405}
              className="w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-[#6D2323] font-bold text-lg mb-2">
                Adobo in Balsamic Vinegar
              </h3>
              <p className="text-[#454545] text-sm">
                A modern twist on the classic Filipino favorite. Adobong Manok
                with balsamic vinegar balances savory and tangy flavors in a
                rich, aromatic sauce.
              </p>
            </div>
          </div>

          {/* Recipe Card 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <Image
              src="/images/tropical tofu stir fry pantropa.png"
              alt="Tropical Tofu Stir-Fry"
              width={405}
              height={405}
              className="w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-[#6D2323] font-bold text-lg mb-2">
                Tropical Tofu Stir-Fry
              </h3>
              <p className="text-[#454545] text-sm">
                Brightand packed with flavor, Tropical Tofu Stir-Fry combines
                crispy tofu, jucy pineapple, and sweet bell peppers in a light
                yet satisfying vegetarian meal.
              </p>
            </div>
          </div>

          {/* Recipe Card 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <Image
              src="/images/creamy garlic shirp pasta.png"
              alt="Garlic Butter Shrimp Pasta"
              width={405}
              height={405}
              className="w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-[#6D2323] font-bold text-lg mb-2">
                Garlic Butter Shrimp Pasta
              </h3>
              <p className="text-[#454545] text-sm">
                Garlic Butter Shrimp Pasta brings together the richness of
                Italian cuisine with a Filipino love for bold garlic flavor -
                Tossed in a buttery and garlicky sauce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-[1269px] mx-auto border-t-2 border-gray-200"></div>

      {/* What We Do Section */}
      <section className="px-4 md:px-[86px] py-12">
        <h2 className="text-[#6D2323] font-bold text-3xl text-center mb-8">
          WHAT WE DO
        </h2>
        <div className="flex justify-center gap-8 mb-8">
          <div className="w-16 h-16 bg-[#FEF9E1] rounded-lg flex items-center justify-center">
            <Image
              src="/images/icon1.png"
              alt="Icon 1"
              width={40}
              height={40}
            />
          </div>
          <div className="w-16 h-16 bg-[#FEF9E1] rounded-lg flex items-center justify-center">
            <Image
              src="/images/icon2.png"
              alt="Icon 2"
              width={40}
              height={40}
            />
          </div>
          <div className="w-16 h-16 bg-[#FEF9E1] rounded-lg flex items-center justify-center">
            <Image
              src="/images/icon3.png"
              alt="Icon 3"
              width={40}
              height={40}
            />
          </div>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#000000] font-bold text-lg mb-4">
            PanlasaLabs is an AI-powered web application designed to function as
            a personalized culinary assistant.
          </p>
          <p className="text-[#454545] text-sm">
            It helps users generate unique recipes based on the ingredients they
            have, their dietary restrictions, preferred cuisine, and flavor
            profile — with a special focus on Filipino cuisine while also
            offering international recipes.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-[1269px] mx-auto border-t-2 border-gray-200"></div>

      {/* AI Recipe Generator Section */}
      <section className="px-4 md:px-[86px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[#6D2323] font-bold text-3xl mb-6">
              AI Recipe Generator
            </h2>
            <p className="text-[#454545] mb-6">
              Any idea or ingredient list can be described, and PanlasaLabs will
              generate a special recipe specifically for you. No more tedious
              repetitions or never-ending searches.
            </p>
            <ul className="space-y-4 text-[#454545] text-sm mb-6">
              <li>
                • Transform leftover ingredients or pantry staples into tasty,
                budget-friendly meals while reducing food waste.
              </li>
              <li>
                • Ask for ingredient swaps, new cuisine ideas, or just friendly
                variations anytime.
              </li>
              <li>
                • Save, customize, and share your favorite recipes effortlessly.
              </li>
              <li>
                • Keep your creativity cooking every day with endless
                inspiration!
              </li>
            </ul>
            <div className="flex gap-4">
              <Link href="/cuisines">
                <button className="bg-[#6D2323] text-white px-6 py-2 rounded hover:bg-[#4A1818] transition-colors font-medium">
                  Try now
                </button>
              </Link>
              <Link href="/about">
                <button className="border-2 border-[#6D2323] text-[#6D2323] px-6 py-2 rounded hover:bg-[#6D2323] hover:text-white transition-colors font-medium">
                  Learn more
                </button>
              </Link>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/ingredients.png"
              alt="Fresh Ingredients"
              width={600}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feedback & Reviews Section */}
      <section className="px-4 md:px-[86px] py-12 bg-white">
        <h2 className="text-[#6D2323] font-bold text-3xl mb-8">
          Feedback & Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review Card 1 */}
          <div className="bg-[#AB3636] text-white rounded-xl p-6">
            <p className="text-lg mb-4">"A terrific piece of praise"</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div>
                <p className="font-semibold text-sm">Name</p>
                <p className="text-xs opacity-80">Designation</p>
              </div>
            </div>
          </div>

          {/* Review Card 2 */}
          <div className="bg-[#AB3636] text-white rounded-xl p-6">
            <p className="text-lg mb-4">"A fantastic bit of feedback"</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div>
                <p className="font-semibold text-sm">Name</p>
                <p className="text-xs opacity-80">Designation</p>
              </div>
            </div>
          </div>

          {/* Review Card 3 */}
          <div className="bg-[#AB3636] text-white rounded-xl p-6">
            <p className="text-lg mb-4">"A genuinely glowing review"</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div>
                <p className="font-semibold text-sm">Name</p>
                <p className="text-xs opacity-80">Designation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try Our Feature Section */}
      <section className="bg-[#B1AB86] px-4 md:px-[86px] py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-[#6D2323] font-bold text-3xl">Try our feature</h2>
          <div className="flex gap-4">
            <Link href="/cuisines">
              <button className="bg-[#6D2323] text-white px-6 py-2 rounded hover:bg-[#4A1818] transition-colors font-medium">
                Generate Recipe
              </button>
            </Link>
            <Link href="/about">
              <button className="bg-white text-[#6D2323] px-6 py-2 rounded hover:bg-gray-100 transition-colors font-medium">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
