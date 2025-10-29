import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getServerSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export async function GET(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, first_name, last_name, avatar_url, provider")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("[api/users/profile] select error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: data });
  } catch (err: any) {
    console.error("[api/users/profile] GET error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, first_name, last_name, avatar_url } = body;

    // Build update payload only with provided fields
    const payload: any = {};
    if (typeof name === "string") payload.name = name;
    if (typeof first_name === "string") payload.first_name = first_name;
    if (typeof last_name === "string") payload.last_name = last_name;
    if (typeof avatar_url === "string") payload.avatar_url = avatar_url;

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { error: "No fields provided" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("users")
      .update(payload)
      .eq("id", session.user.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("[api/users/profile] update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: data });
  } catch (err: any) {
    console.error("[api/users/profile] PATCH error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
