"use client";

import RecipeCard from "@/components/features/recipe/RecipeCard";
import type { PublicRecipe } from "@/types/recipe";

export default function AllRecipesSection() {
  const sampleRecipes: PublicRecipe[] = [
    {
      id: "1",
      title: "Lumpia Shanghai",
      description:
        "Crispy Filipino spring rolls filled with savory ground pork and veggies—perfect as an appetizer.",
      image: "/images/recipe/LumpiaShanghai.jpg",
      difficulty: "Medium",
      ingredients: [
        "1 lb ground pork",
        "50 pcs lumpia wrappers",
        "1 large carrot, minced",
        "1 large onion, minced",
        "5 cloves garlic, minced",
        "2 tbsp soy sauce",
      ],
      instructions: [
        "Mix pork, vegetables, soy sauce and seasoning.",
        "Place filling on wrapper and roll tightly.",
        "Fry in hot oil until golden brown.",
        "Drain and serve with dipping sauce.",
      ],
    },
    {
      id: "2",
      title: "Pancit Bihon",
      description:
        "A classic stir-fried rice noodle dish with vegetables and choice of protein.",
      image: "/images/recipe/PancitBihon.png",
      difficulty: "Medium",
      ingredients: [
        "250g bihon (rice vermicelli)",
        "1 cup sliced cabbage",
        "1 cup carrots, julienned",
        "1/2 cup green beans, sliced",
        "2 cloves garlic",
      ],
      instructions: [
        "Soak noodles until pliable.",
        "Stir-fry vegetables and protein.",
        "Add noodles and toss with seasonings.",
      ],
    },
    {
      id: "3",
      title: "Halo-Halo",
      description:
        "A refreshing shaved-ice dessert layered with sweet toppings.",
      image: "/images/recipe/HaloHalo.jpg",
      difficulty: "Easy",
      ingredients: ["Shaved ice", "Evaporated milk", "Sweet beans", "Fruits"],
      instructions: [
        "Layer ingredients in a glass.",
        "Top with shaved ice and milk.",
        "Serve chilled.",
      ],
    },

    {
      id: "4",
      title: "Chicken Adobo",
      description:
        "The undisputed Filipino favorite. A savory and tangy stew made with soy sauce, vinegar, garlic, and bay leaves.",
      image: "/images/recipe/Adobo.png",
      difficulty: "Easy",
      ingredients: [
        "1 kg chicken cuts",
        "1/2 cup soy sauce",
        "1/4 cup vinegar",
        "5 cloves garlic, crushed",
        "2 pcs dried bay leaves",
        "1 tsp whole peppercorns",
      ],
      instructions: [
        "Combine chicken, soy sauce, garlic, and peppercorns in a pot.",
        "Simmer for 20 minutes.",
        "Add vinegar and bay leaves, simmer for another 10 minutes without stirring.",
        "Serve hot with rice.",
      ],
    },
    {
      id: "5",
      title: "Pork Sinigang",
      description:
        "A comforting sour soup made with pork, flavored with tamarind and fresh vegetables.",
      image: "/images/recipe/Sinigang.png",
      difficulty: "Medium",
      ingredients: [
        "1/2 kg pork belly, cubed",
        "1 packet sinigang mix (tamarind base)",
        "1 large tomato, quartered",
        "1 large onion, quartered",
        "1 bunch kangkong (water spinach)",
        "1 radish (labanos), sliced",
        "2 pcs taro (gabi), cubed",
      ],
      instructions: [
        "Boil pork in water until tender, skimming scum.",
        "Add onion, tomato, and taro. Simmer until taro is soft.",
        "Add radish and sinigang mix. Stir.",
        "Add kangkong and cook for 2 more minutes.",
        "Season with fish sauce (patis) to taste.",
      ],
    },
    {
      id: "6",
      title: "Sizzling Pork Sisig",
      description:
        "A sizzling Kapampangan dish made from chopped pork, onions, and calamansi.",
      image: "/images/recipe/Sisig.png",
      difficulty: "Hard",
      ingredients: [
        "1 lb pig's face (maskara) or pork belly",
        "1/4 cup soy sauce",
        "2 large red onions, chopped",
        "5 pcs chili peppers (siling haba)",
        "3 tbsp calamansi juice",
        "1/4 cup butter or margarine",
        "1 raw egg (optional)",
      ],
      instructions: [
        "Boil pig's face until tender.",
        "Grill or broil until crispy.",
        "Chop into fine pieces.",
        "In a pan, sauté onions and chili.",
        "Add chopped pork, soy sauce, and calamansi juice.",
        "Heat a sizzling plate, add butter, pour the sisig, and top with a raw egg.",
      ],
    },
    {
      id: "7",
      title: "Kare-Kare",
      description:
        "A rich peanut-based stew traditionally made with oxtail and vegetables, served with bagoong.",
      image: "/images/recipe/Kare-Kare.png",
      difficulty: "Hard",
      ingredients: [
        "2 lbs oxtail, cut into 2-inch pieces",
        "1/2 cup peanut butter",
        "1/4 cup toasted ground rice",
        "1 bunch bok choy (pechay)",
        "1 eggplant, sliced",
        "1 bunch string beans",
        "1 tbsp atsuete powder (annatto)",
      ],
      instructions: [
        "Boil oxtail in water until fork-tender (use pressure cooker to save time).",
        "In a separate pot, sauté garlic and atsuete powder.",
        "Add peanut butter and ground rice, stir until thick. Add oxtail broth.",
        "Add oxtail and simmer for 15 minutes.",
        "Add vegetables and cook until tender-crisp.",
        "Serve with bagoong (shrimp paste) on the side.",
      ],
    },
    {
      id: "8",
      title: "Bagnet",
      description:
        "A crispy deep-fried pork belly dish from Ilocos, prized for its crunchy skin and juicy meat.",
      image: "/images/recipe/Bagnet.png",
      difficulty: "Medium",
      ingredients: [
        "2 lbs pork belly (liempo), whole slab",
        "1 head garlic, crushed",
        "2 tbsp salt",
        "4 cups water",
        "4 cups cooking oil",
      ],
      instructions: [
        "Boil pork belly with salt and garlic in water until tender.",
        "Remove from water and air dry completely for several hours or overnight.",
        "Deep fry in hot oil over medium heat for 30 minutes.",
        "Remove and let it cool down for 15 minutes.",
        "Fry a second time over high heat until skin is crispy and blistered.",
        "Chop and serve with vinegar dipping sauce.",
      ],
    },

    {
      id: "9",
      title: "Bicol Express",
      description:
        "A fiery and creamy Bicolano stew made with pork, coconut milk, and a generous amount of chili.",
      image: "/images/recipe/BicolExpress.jpg",
      difficulty: "Medium",
      ingredients: [
        "1 lb pork belly, cubed",
        "2 cups coconut milk",
        "1/2 cup shrimp paste (bagoong alamang)",
        "10 pcs long green chilies (siling haba), sliced",
        "5 pcs red chilies (siling labuyo), minced",
        "1 large onion, chopped",
        "3 cloves garlic, minced",
      ],
      instructions: [
        "In a pan, combine pork, coconut milk, onion, and garlic. Bring to a boil.",
        "Simmer until pork is tender and coconut milk has rendered its oil.",
        "Add shrimp paste and all the chilies.",
        "Continue to cook, stirring occasionally, until the sauce is thick and creamy.",
        "Serve hot with rice.",
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {sampleRecipes.map((r) => (
        <div key={r.id} className="h-full">
          <RecipeCard recipe={r} />
        </div>
      ))}
    </div>
  );
}
