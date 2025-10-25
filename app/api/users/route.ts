import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment"
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[api/users] POST body:", body);
    const { id, email, name, first_name, last_name, provider, avatar_url } =
      body;

    // Basic validation
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const payload: any = {
      email,
      name,
      first_name,
      last_name,
      provider: provider ?? "email",
    };

    if (avatar_url) payload.avatar_url = avatar_url;

    // If caller supplies an id that looks like a UUID, include it; otherwise
    // let the DB generate the id.
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (id && uuidRegex.test(id)) {
      payload.id = id;
    }

    // Use upsert on email so repeated signups don't fail with unique constraint
    // errors. This will insert a new row or update the existing one.
    const { data, error } = await supabase
      .from("users")
      .upsert(payload, { onConflict: "email", ignoreDuplicates: false });

    if (error) {
      // Log detailed error server-side for debugging
      console.error(
        "[api/users] supabase upsert error:",
        error,
        "payload:",
        payload
      );
      // Return structured error info (non-sensitive) to the client for debugging
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: 500 }
      );
    }

    console.log("[api/users] upsert success:", data);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
