import { NextResponse } from "next/server";
import { createClient as createSupabase } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session as any).user.id as string;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { ok: false, error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const supabase = createSupabase(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from("recipes")
      .select("id, title, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[api/users/history] supabase error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, history: data || [] });
  } catch (err: any) {
    console.error("[api/users/history] error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
