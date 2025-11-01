import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";

export async function GET(req: Request, { params }: { params: any }) {
  try {
    // In Next.js app router, `params` may be a promise-like object. Await it
    // before accessing properties to avoid sync dynamic API errors.
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("recipes")
      .select(
        `id, user_id, title, description, ingredients, instructions, cuisine, difficulty, prep_time, cook_time, servings, created_at, updated_at`
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching recipe:", error);
      return NextResponse.json(
        { error: error.message || String(error) },
        { status: 500 }
      );
    }

    if (!data)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Return recipe - all recipes are accessible
    return NextResponse.json({ recipe: data });
  } catch (err: any) {
    console.error("/api/recipes/[id] error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
