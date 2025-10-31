import { ExtendedRecipe } from "@/types/chat";
import {
  parseArrayField,
  normalizeScalar,
  formatMinutes,
  normalizeDifficulty,
} from "./arrayParsers";

export async function fetchAndNormalizeRecipe(
  id: string
): Promise<ExtendedRecipe | null> {
  try {
    const res = await fetch(`/api/recipes/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    const db = json?.recipe ?? json;

    const ingredients = parseArrayField(db.ingredients).map((i) =>
      String(i)
        .replace(/^['\"]+|['\"]+$/g, "")
        .replace(/[,]+$/g, "")
        .trim()
    );

    const instructions = parseArrayField(db.instructions).map((s) =>
      String(s)
        .replace(/^['\"]+|['\"]+$/g, "")
        .replace(/[,]+$/g, "")
        .trim()
    );

    const tags = parseArrayField(db.tags).map(normalizeScalar).filter(Boolean);

    return {
      id: db.id ?? id,
      title: normalizeScalar(db.title ?? db.name ?? ""),
      description: normalizeScalar(db.description ?? ""),
      difficulty: normalizeDifficulty(db.difficulty),
      ingredients,
      instructions,
      image: db.image,
      prepTime: formatMinutes(db.prep_time ?? db.prepTime),
      cookTime: formatMinutes(db.cook_time ?? db.cookTime),
      servings: db.servings != null ? Number(db.servings) : 0,
      cuisine: db.cuisine || undefined,
      tags,
    };
  } catch (err) {
    console.error("Fetch recipe error:", err);
    return null;
  }
}
