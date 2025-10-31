import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient as createSupabase } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "models/gemini-2.5-flash";

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI endpoint will fail without it.");
}

const ai = new GoogleGenAI({ apiKey });

// Enhanced system prompt with strict quantity requirements
const SYSTEM_PROMPT = `You are a Filipino recipe expert. Return ONLY valid JSON, no markdown or extra text.

CRITICAL: Every ingredient MUST start with a quantity (number + unit). Never omit quantities.

JSON Schema (all fields required, use null if unavailable):
{
  "title": "Dish Name",
  "description": "Brief description (2-3 sentences)",
  "ingredients": ["quantity + unit + ingredient name"],
  "instructions": ["step by step"],
  "prep_time": "15 minutes",
  "cook_time": "30 minutes",
  "servings": "4",
  "cuisine": "Filipino",
  "difficulty": "Easy|Medium|Hard",
  "image_url": null
}

Ingredient Format Rules:
✓ CORRECT: "500g pork belly", "2 large onions, chopped", "3 cloves garlic, minced", "1/4 cup soy sauce"
✗ WRONG: "kg pork belly", "large onions", "cloves garlic", "soy sauce"

For ANY Filipino dish (including obscure, regional, or misspelled names):
- Infer the closest traditional recipe
- Provide complete quantities for ALL ingredients
- Use standard Filipino ingredient names (calamansi, patis, toyo, etc.)
- Include at least 5 ingredients and 4 instructions
- If quantity is uncertain, provide reasonable estimate

Example for "sisig":
{
  "title": "Pork Sisig",
  "description": "A sizzling Filipino dish made from chopped pork parts, seasoned with calamansi and chili peppers.",
  "ingredients": [
    "500g pork jowl and ears, mixed",
    "200g pork belly",
    "3 large onions (2 chopped, 1 sliced for garnish)",
    "6 cloves garlic, minced",
    "2 tbsp ginger, minced",
    "3 tbsp cooking oil",
    "3 pcs raw eggs (optional)",
    "5 pcs calamansi",
    "3 red chili peppers, chopped",
    "2 tbsp soy sauce",
    "Salt and pepper to taste"
  ],
  "instructions": [
    "Boil pork parts with ginger until tender, about 45 minutes",
    "Grill boiled pork until crispy and charred",
    "Chop pork into small pieces",
    "Sauté garlic, onions, and ginger in oil",
    "Add chopped pork and season with soy sauce, calamansi, salt and pepper",
    "Serve on sizzling plate, top with raw egg and garnish with onions"
  ],
  "prep_time": "20 minutes",
  "cook_time": "60 minutes",
  "servings": "4-6",
  "cuisine": "Filipino",
  "difficulty": "Medium",
  "image_url": null
}`;

// Extract JSON from model output
function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
  }
  return null;
}

// Clean and validate ingredient string
function cleanIngredient(s: any): string | null {
  if (!s) return null;

  let cleaned = String(s)
    .replace(/\*+|`+|```[\s\S]*?```/g, "") // Remove markdown
    .replace(/^[\-–•\)\.\s"'\u201c\u201d]+/, "") // Remove bullets
    .replace(/\s{2,}/g, " ") // Collapse spaces
    .trim();

  if (!cleaned) return null;

  // Check if starts with quantity (number, fraction, or range)
  const hasQuantity =
    /^(\d+\.?\d*|\d*\.\d+|\d+\/\d+|\d+\s*-\s*\d+)\s*[a-zA-Z]/.test(cleaned);

  if (!hasQuantity) {
    // Try to infer reasonable quantity based on ingredient type
    const ingredient = cleaned.toLowerCase();

    // Common Filipino ingredients with default quantities
    if (ingredient.includes("garlic") && ingredient.includes("clove")) {
      return `3 cloves ${cleaned}`;
    }
    if (ingredient.includes("onion")) {
      return `1 large ${cleaned}`;
    }
    if (ingredient.includes("ginger")) {
      return `1 tbsp ${cleaned}`;
    }
    if (ingredient.includes("egg")) {
      return `2 pcs ${cleaned}`;
    }
    if (ingredient.includes("oil")) {
      return `2 tbsp ${cleaned}`;
    }
    if (ingredient.match(/\b(pork|chicken|beef|fish)\b/)) {
      return `500g ${cleaned}`;
    }
    if (ingredient.match(/\b(salt|pepper|sugar)\b/)) {
      return `to taste - ${cleaned}`;
    }

    // Generic fallback
    return `1 cup ${cleaned}`;
  }

  return cleaned;
}

// Clean regular strings
function cleanString(s: any): string | null {
  if (!s) return null;
  return (
    String(s)
      .replace(/\*+|`+|```[\s\S]*?```/g, "")
      .replace(/^\s*\d+[\)\.\-\s]+/, "")
      .replace(/\s{2,}/g, " ")
      .trim() || null
  );
}

// Parse time strings to minutes
function parseMinutes(val: any): number | null {
  if (!val) return null;
  const s = String(val).toLowerCase();

  if (/^\d+$/.test(s)) return parseInt(s, 10);

  const hours = s.match(/(\d+)\s*(?:h|hr|hour)/);
  const mins = s.match(/(\d+)\s*(?:m|min)/);
  let total = 0;
  if (hours) total += parseInt(hours[1], 10) * 60;
  if (mins) total += parseInt(mins[1], 10);
  if (total) return total;

  const range = s.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (range)
    return Math.round((parseInt(range[1], 10) + parseInt(range[2], 10)) / 2);

  const firstNum = s.match(/(\d+)/);
  return firstNum ? parseInt(firstNum[1], 10) : null;
}

// Parse servings to integer
function parseServings(val: any): number | null {
  if (!val) return null;
  const match = String(val).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// Normalize difficulty levels
function normalizeDifficulty(val: any): string | null {
  if (!val) return null;
  const s = String(val).toLowerCase();
  if (s.includes("easy") || s.includes("beginner")) return "Easy";
  if (s.includes("medium") || s.includes("moderate")) return "Medium";
  if (s.includes("hard") || s.includes("difficult")) return "Hard";
  return null;
}

// Validate image URL
async function validateImageUrl(url: any): Promise<string | null> {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;

    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    return contentType.startsWith("image/") ? url : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Generate recipe
    const response = await ai.models.generateContent({
      model,
      contents: `${SYSTEM_PROMPT}\n\nUser: ${prompt}`,
    });

    const text =
      (response as any).text ??
      (response as any)?.output?.[0]?.content?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "No text returned from AI" },
        { status: 500 }
      );
    }

    // Parse JSON response
    let parsed = extractJSON(text);
    if (!parsed) {
      return NextResponse.json(
        { error: "Failed to parse recipe JSON" },
        { status: 500 }
      );
    }

    // Build clean recipe with validated ingredients
    const recipe = {
      title: cleanString(parsed.title) || "Generated Recipe",
      description: cleanString(parsed.description) || "",
      ingredients: Array.isArray(parsed.ingredients)
        ? parsed.ingredients.map(cleanIngredient).filter(Boolean)
        : [],
      instructions: Array.isArray(parsed.instructions)
        ? parsed.instructions.map(cleanString).filter(Boolean)
        : [],
      prep_time: parseMinutes(parsed.prep_time),
      cook_time: parseMinutes(parsed.cook_time),
      servings: parseServings(parsed.servings),
      cuisine: cleanString(parsed.cuisine),
      difficulty: normalizeDifficulty(parsed.difficulty),
      image_url: await validateImageUrl(parsed.image_url),
    };

    // Validate minimum requirements
    if (recipe.ingredients.length < 3 || recipe.instructions.length < 3) {
      console.warn("Recipe validation failed: insufficient details");
      return NextResponse.json(
        { error: "Generated recipe lacks sufficient details" },
        { status: 500 }
      );
    }

    // Save to database if configured
    let insertedId: string | null = null;
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        // Get user session
        let userId: string | null = null;
        try {
          const session = await getServerSession(authOptions as any);
          userId = (session as any)?.user?.id || null;
        } catch (e) {
          console.warn("Session resolution failed:", e);
        }

        const supabase = createSupabase(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { data, error } = await supabase
          .from("recipes")
          .insert([
            {
              user_id: userId,
              title: recipe.title,
              description: recipe.description,
              ingredients: recipe.ingredients,
              instructions: recipe.instructions,
              cuisine: recipe.cuisine,
              difficulty: recipe.difficulty,
              prep_time: recipe.prep_time,
              cook_time: recipe.cook_time,
              servings: recipe.servings,
              image_url: recipe.image_url,
              is_public: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select("id")
          .single();

        if (!error && data?.id) {
          insertedId = data.id;
        } else if (error) {
          console.warn("Supabase insert error:", error);
        }
      } catch (e) {
        console.warn("Failed to save recipe:", e);
      }
    }

    return NextResponse.json({
      id: insertedId,
      message: insertedId ? "saved" : "generated",
    });
  } catch (err: any) {
    console.error("/api/ai/prompted error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
