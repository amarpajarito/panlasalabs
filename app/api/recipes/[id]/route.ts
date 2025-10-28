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
        `id, user_id, title, description, ingredients, instructions, cuisine, difficulty, prep_time, cook_time, servings, image_url, is_public, created_at, updated_at`
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

    // Enforce access control: only return recipe if it's public or the
    // requester is the owner.
    if (data.is_public) {
      return NextResponse.json({ recipe: data });
    }

    // Try to resolve session; if owner, return recipe, otherwise 403.
    try {
      const session = await getServerSession(authOptions as any);
      const requesterId =
        session && (session as any).user ? (session as any).user.id : null;
      if (requesterId && data.user_id === requesterId) {
        return NextResponse.json({ recipe: data });
      }
    } catch (e) {
      console.warn("Could not resolve session for recipe access:", e);
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (err: any) {
    console.error("/api/recipes/[id] error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
