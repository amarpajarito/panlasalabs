import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AVATAR_BUCKET = process.env.NEXT_PUBLIC_AVATAR_BUCKET ?? "avatars";

function getServerSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  try {
    const supabase = getServerSupabase();

    // create bucket if not exists
    const { data, error } = await supabase.storage.createBucket(AVATAR_BUCKET, {
      public: true,
    });

    if (error) {
      // if bucket already exists some SDKs return error; surface message
      console.error(
        "[storage/create-avatar-bucket] createBucket error:",
        error
      );
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, bucket: data });
  } catch (err: any) {
    console.error("[storage/create-avatar-bucket] error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
