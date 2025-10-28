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

function parseRecipeFromText(text: string) {
  // Basic heuristics to extract title, description, ingredients and instructions.
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim());

  // Get title: first non-empty line (or line starting with Title:)
  let title = "";
  for (const l of lines) {
    if (!l) continue;
    const m = l.match(/^(?:Title[:\-]\s*)?(.*)$/i);
    if (m && m[1]) {
      title = m[1];
      break;
    }
  }

  // Find sections
  const textLower = text.toLowerCase();
  const ingIdx = textLower.search(/(^|\n)ingredients\b/);
  const instrIdx = textLower.search(
    /(^|\n)(instructions|directions|method|steps)\b/
  );

  // Description: text between title and ingredients (or first paragraph)
  let description = "";
  if (ingIdx > -1) {
    description = text.slice(0, ingIdx).replace(title, "").trim();
  } else if (lines.length > 1) {
    // take first paragraph after title
    const startLine = lines.indexOf(title) + 1;
    const paraLines: string[] = [];
    for (let i = startLine; i < lines.length; i++) {
      if (!lines[i]) break;
      paraLines.push(lines[i]);
    }
    description = paraLines.join(" ");
  }

  function extractSection(startRegex: RegExp, endRegex?: RegExp) {
    const start = textLower.search(startRegex);
    if (start === -1) return "";
    const after = text.slice(start).split(/\n/);
    // drop the header line
    after.shift();
    // take until an end header appears
    const sectionLines: string[] = [];
    for (const lineRaw of after) {
      const line = lineRaw.trim();
      if (!line) {
        // continue
        sectionLines.push("");
        continue;
      }
      if (endRegex && endRegex.test(line.toLowerCase())) break;
      // stop if another common header appears
      if (
        /^(ingredients|instructions|directions|method|steps|servings|time)[:\s]/i.test(
          line
        )
      )
        break;
      sectionLines.push(line);
    }
    return sectionLines.join("\n");
  }

  // Extract ingredients: look for Ingredients header
  let ingredientsText = "";
  if (ingIdx > -1) {
    ingredientsText = extractSection(
      /(^|\n)ingredients\b/i,
      /(^|\n)(instructions|directions|method|steps)\b/i
    );
  } else if (instrIdx > -1) {
    // maybe ingredients are between title and instructions
    const startLine = lines.indexOf(title) + 1;
    const endLine = lines.findIndex((l) =>
      /^(instructions|directions|method|steps)\b/i.test(l)
    );
    if (endLine > startLine) {
      ingredientsText = lines.slice(startLine, endLine).join("\n");
    }
  }

  const parseIngredientLines = (txt: string) => {
    if (!txt) return [] as string[];
    return txt
      .split(/\n/)
      .map((l) => l.replace(/^[-–•\d\.\)\s]+/, "").trim())
      .filter(Boolean);
  };

  const ingredients = parseIngredientLines(ingredientsText);

  // Extract instructions
  let instructionsText = "";
  if (instrIdx > -1) {
    instructionsText = extractSection(
      /(^|\n)(instructions|directions|method|steps)\b/i
    );
  } else {
    // fallback: lines that look like numbered steps
    const stepLines = lines.filter(
      (l) => /^\d+[\)\.]/.test(l) || /^step\s+\d+/i.test(l)
    );
    instructionsText = stepLines.join("\n");
  }

  const parseInstructionLines = (txt: string) => {
    if (!txt) return [] as string[];
    return txt
      .split(/\n/)
      .map((l) => l.replace(/^\d+[\)\.\s-]*/i, "").trim())
      .filter(Boolean);
  };

  const instructions = parseInstructionLines(instructionsText);

  // If nothing parsed, try a fallback: split text into paragraphs and treat last paragraphs as instructions
  if (ingredients.length === 0) {
    const maybeIngredients = lines.filter(
      (l) =>
        /\d+\s*(g|kg|cup|tbsp|tsp|pcs|pieces|ml|litre|clove|cloves)/i.test(l) ||
        /\b(cup|tbsp|tsp|grams|grams|kg|g)\b/i.test(l)
    );
    if (maybeIngredients.length) ingredients.push(...maybeIngredients);
  }

  if (instructions.length === 0) {
    // take paragraph sentences as steps
    const paras = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (paras.length > 1) {
      const last = paras.slice(1).join("\n\n");
      instructions.push(
        ...last
          .split(/\.|\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
  }

  const recipe = {
    title: title || "Generated Recipe",
    description: description || "",
    image: "",
    ingredients,
    instructions,
  };

  return recipe;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, save } = body || {};

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Ask the model to return strict JSON only. This prevents noisy
    // conversational text (titles like "Here's a delightful recipe for...")
    // and markdown/asterisk decorations from leaking into our parsed fields.
    // We also include an example schema and ask the model to respond with
    // a single JSON object only. If JSON parsing fails we fall back to
    // the heuristic text parser above.
    const systemInstruction = `You are a helpful recipe assistant. Given a user's prompt about ingredients, dietary preferences, or dish names, respond with a single valid JSON object and nothing else. Do NOT include any markdown, commentary, or extra text. The JSON must follow this schema exactly (fields may be null if unavailable):

    {
      "title": "string",
      "description": "string",
      "ingredients": ["string"],
      "instructions": ["string"],
      "prep_time": "string|null",
      "cook_time": "string|null",
      "servings": "string|null",
      "cuisine": "string|null",
      "difficulty": "string|null",
      "image_url": "string|null"
    }

    Example:
    {
      "title": "Halo-Halo",
      "description": "A Filipino shaved-ice dessert with sweet beans, fruits, and ube.",
      "ingredients": ["1 cup shaved ice", "1/2 cup sweetened red beans"],
      "instructions": ["Layer ingredients", "Add shaved ice", "Top with milk and ice cream"],
      "prep_time": "15 minutes",
      "cook_time": null,
      "servings": "2",
      "cuisine": "Filipino",
      "difficulty": "easy",
      "image_url": null
    }

    Only output valid JSON that can be parsed by JSON.parse().`;

    const contents = `${systemInstruction}\n\nUser: ${prompt}`;

    const response = await ai.models.generateContent({ model, contents });

    const text =
      (response as any).text ??
      (response as any)?.output?.[0]?.content?.[0]?.text ??
      null;

    if (!text) {
      return NextResponse.json(
        { error: "No text returned from AI" },
        { status: 500 }
      );
    }

    // Try to parse JSON directly from the model output. Models sometimes add
    // stray characters; try a safe extraction to the first/last braces if needed.
    let parsedJson: any = null;
    let recipe: any = null;
    try {
      // Attempt direct parse
      parsedJson = JSON.parse(text);
    } catch (e) {
      // Fallback: try to extract the first JSON object in the text blob
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonSubstring = text.slice(firstBrace, lastBrace + 1);
        try {
          parsedJson = JSON.parse(jsonSubstring);
        } catch (e2) {
          parsedJson = null;
        }
      }
    }

    function sanitizeString(s: any) {
      if (s === null || s === undefined) return null;
      let str = String(s).trim();
      // remove markdown bold/italic markers and stray asterisks
      str = str.replace(/\*+/g, "");
      // remove code fences and inline code markers
      str = str.replace(/```[\s\S]*?```/g, "");
      str = str.replace(/`+/g, "");
      // remove leading numbering like "1.", "2)", "1) "
      str = str.replace(/^\s*\d+[\)\.\-\s]+/, "");
      // collapse multiple spaces
      str = str.replace(/\s{2,}/g, " ");
      // remove CJK characters which occasionally leak into responses
      str = str.replace(/[\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]+/g, "");
      // If the string looks like raw JSON (starts with { or [), drop it
      if (/^[\s]*[\[{]/.test(str)) return "";
      return str.trim();
    }

    if (parsedJson && typeof parsedJson === "object") {
      // Map model fields to our recipe shape with safe defaults
      recipe = {
        title:
          (parsedJson.title && String(parsedJson.title).trim()) ||
          "Generated Recipe",
        description:
          (parsedJson.description && String(parsedJson.description).trim()) ||
          "",
        image:
          (parsedJson.image_url && String(parsedJson.image_url).trim()) || "",
        ingredients: Array.isArray(parsedJson.ingredients)
          ? parsedJson.ingredients
              .map((i: any) => sanitizeString(i))
              .filter(Boolean)
          : [],
        instructions: Array.isArray(parsedJson.instructions)
          ? parsedJson.instructions
              .map((s: any) => sanitizeString(s))
              .filter(Boolean)
          : [],
        prep_time: parsedJson.prep_time ?? null,
        cook_time: parsedJson.cook_time ?? null,
        servings: parsedJson.servings ?? null,
        cuisine: parsedJson.cuisine ?? null,
        difficulty: parsedJson.difficulty ?? null,
      };
    } else {
      // Last-resort: use the heuristic parser for free text responses
      recipe = parseRecipeFromText(text);
    }

    // Also sanitize title/description produced by fallback parser
    if (recipe) {
      recipe.title = sanitizeString(recipe.title) || "Generated Recipe";
      recipe.description = sanitizeString(recipe.description) || "";
      if (Array.isArray(recipe.ingredients)) {
        recipe.ingredients = recipe.ingredients
          .map((i: any) => sanitizeString(i))
          .filter(Boolean);
      }
      if (Array.isArray(recipe.instructions)) {
        recipe.instructions = recipe.instructions
          .map((s: any) => sanitizeString(s))
          .filter(Boolean);
      }
    }

    // If the model provided an image_url, validate it before saving. We
    // prefer the model-provided image but only accept it if it is a reachable
    // http(s) URL and the resource looks like an image (content-type).
    async function validateImageUrl(candidate: any) {
      if (!candidate || typeof candidate !== "string") return null;
      try {
        const u = new URL(candidate);
        if (!["http:", "https:"].includes(u.protocol)) return null;

        // Do a HEAD request to ensure the URL is reachable and is an image.
        // This is best-effort: if HEAD fails we'll reject the URL.
        const headRes = await fetch(u.toString(), { method: "HEAD" });
        if (!headRes.ok) return null;
        const ct = headRes.headers.get("content-type") || "";
        if (ct.startsWith("image/")) return u.toString();
        return null;
      } catch (e) {
        return null;
      }
    }

    // Validate and normalize recipe.image (may be empty string)
    if (recipe && recipe.image) {
      try {
        const valid = await validateImageUrl(recipe.image);
        recipe.image = valid || null;
      } catch (e) {
        recipe.image = null;
      }
    }

    // Save parsed recipe into the `public.recipes` table using the
    // service role key. We return only the inserted id to the client so the
    // chat UI never receives the full recipe content.
    let insertedId: string | null = null;
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        // Try to resolve server session to attach ownership to the saved recipe
        let sessionUserId: string | null = null;
        try {
          const session = await getServerSession(authOptions as any);
          if (session && (session as any).user && (session as any).user.id) {
            sessionUserId = (session as any).user.id as string;
          }
        } catch (e) {
          // don't block saving if session resolution fails
          console.warn("Unable to resolve server session for recipe save:", e);
        }

        const supabase = createSupabase(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const insertBody: any = {
          user_id: sessionUserId,
          title: recipe.title || null,
          description: recipe.description || null,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          cuisine: null,
          difficulty: null,
          prep_time: null,
          cook_time: null,
          servings: null,
          image_url: recipe.image || null,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: inserted, error } = await supabase
          .from("recipes")
          .insert([insertBody])
          .select("id")
          .single();

        if (!error && inserted && inserted.id) {
          insertedId = inserted.id;
        } else if (error) {
          console.warn("Supabase insert error:", error);
        }
      } catch (e) {
        console.warn("Failed to save recipe to Supabase:", e);
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
