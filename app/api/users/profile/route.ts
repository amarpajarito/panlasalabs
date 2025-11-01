import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key (bypasses RLS)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getServerSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

// GET: Fetch user profile
export async function GET(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServerSupabase();

    // Fetch user data from public.users table
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, first_name, last_name, avatar_url, provider")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("[GET /api/users/profile] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: data });
  } catch (err: any) {
    console.error("[GET /api/users/profile] Unexpected error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PATCH: Update user profile
export async function PATCH(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, first_name, last_name, avatar_url } = body;

    // Build update payload for public.users table
    const publicPayload: any = { updated_at: new Date().toISOString() };
    if (typeof name === "string") publicPayload.name = name;
    if (typeof first_name === "string") publicPayload.first_name = first_name;
    if (typeof last_name === "string") publicPayload.last_name = last_name;
    if (typeof avatar_url === "string") publicPayload.avatar_url = avatar_url;

    if (Object.keys(publicPayload).length === 1) {
      // Only updated_at was added
      return NextResponse.json(
        { error: "No fields provided" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // Update public.users table (using service role to bypass RLS)
    const { data: publicUser, error: publicError } = await supabase
      .from("users")
      .update(publicPayload)
      .eq("id", session.user.id)
      .select()
      .maybeSingle();

    if (publicError) {
      console.error(
        "[PATCH /api/users/profile] public.users error:",
        publicError
      );
      return NextResponse.json({ error: publicError.message }, { status: 500 });
    }

    // Update auth.users metadata for NextAuth session sync
    const userMetadata: any = {};
    if (typeof name === "string") {
      userMetadata.name = name;
      userMetadata.full_name = name;
    }
    if (typeof avatar_url === "string") {
      userMetadata.avatar_url = avatar_url;
      userMetadata.picture = avatar_url;
    }

    if (Object.keys(userMetadata).length > 0) {
      // Get current user metadata
      const { data: authUser } = await supabase.auth.admin.getUserById(
        session.user.id
      );

      if (authUser?.user) {
        // Merge with existing metadata
        const updatedMetadata = {
          ...authUser.user.user_metadata,
          ...userMetadata,
        };

        // Update auth.users with new metadata
        const { error: authError } = await supabase.auth.admin.updateUserById(
          session.user.id,
          { user_metadata: updatedMetadata }
        );

        if (authError) {
          console.error(
            "[PATCH /api/users/profile] auth.users error:",
            authError
          );
          // Don't fail - public.users is already updated
        } else {
          console.log(
            "[PATCH /api/users/profile] Successfully updated auth.users"
          );
        }
      }
    }

    return NextResponse.json({ ok: true, user: publicUser });
  } catch (err: any) {
    console.error("[PATCH /api/users/profile] Unexpected error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
