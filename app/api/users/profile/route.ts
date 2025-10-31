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

    // Build update payload for public.users table
    const publicPayload: any = {};
    if (typeof name === "string") publicPayload.name = name;
    if (typeof first_name === "string") publicPayload.first_name = first_name;
    if (typeof last_name === "string") publicPayload.last_name = last_name;
    if (typeof avatar_url === "string") publicPayload.avatar_url = avatar_url;

    if (Object.keys(publicPayload).length === 0) {
      return NextResponse.json(
        { error: "No fields provided" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // STEP 1: Update public.users table
    const { data: publicUser, error: publicError } = await supabase
      .from("users")
      .update(publicPayload)
      .eq("id", session.user.id)
      .select()
      .maybeSingle();

    if (publicError) {
      console.error(
        "[api/users/profile] public.users update error:",
        publicError
      );
      return NextResponse.json({ error: publicError.message }, { status: 500 });
    }

    // STEP 2: Update auth.users table (for NextAuth session)
    // This is what updates the display name in Supabase Auth
    const authPayload: any = {};

    // Supabase auth.users stores user metadata in raw_user_meta_data
    const userMetadata: any = {};
    if (typeof name === "string") {
      userMetadata.name = name;
      userMetadata.full_name = name; // Some providers use full_name
    }
    if (typeof avatar_url === "string") {
      userMetadata.avatar_url = avatar_url;
      userMetadata.picture = avatar_url; // Some providers use picture
    }

    if (Object.keys(userMetadata).length > 0) {
      // Get current user metadata first
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
          {
            user_metadata: updatedMetadata,
          }
        );

        if (authError) {
          console.error(
            "[api/users/profile] auth.users update error:",
            authError
          );
          // Don't fail the request - public.users is already updated
        } else {
          console.log("[api/users/profile] Successfully updated auth.users");
        }
      }
    }

    return NextResponse.json({ ok: true, user: publicUser });
  } catch (err: any) {
    console.error("[api/users/profile] PATCH error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
