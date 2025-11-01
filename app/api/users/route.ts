import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// GET: Fetch authenticated user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user from public.users table
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", (session.user as any).id)
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("[GET /api/users] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PATCH: Update authenticated user profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { name, first_name, last_name, avatar_url } = await req.json();

    // Build update payload for public.users
    const updateData: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    // Update public.users table (service role bypasses RLS)
    const { data: user, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update auth.users metadata for NextAuth session sync
    const authMetadata: any = {};
    if (name !== undefined) {
      authMetadata.name = name;
      authMetadata.full_name = name;
    }
    if (first_name !== undefined) authMetadata.first_name = first_name;
    if (last_name !== undefined) authMetadata.last_name = last_name;
    if (avatar_url !== undefined) {
      authMetadata.avatar_url = avatar_url;
      authMetadata.picture = avatar_url;
    }

    // Update auth.users metadata if we have updates
    if (Object.keys(authMetadata).length > 0) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: authMetadata }
      );
      if (authError) {
        console.error(
          "[PATCH /api/users] Auth metadata update failed:",
          authError
        );
      }
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("[PATCH /api/users] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// POST: Create user record (used during signup)
export async function POST(req: Request) {
  try {
    const { id, email, name, first_name, last_name, provider, avatar_url } =
      await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Build user payload
    const payload: any = {
      email,
      name:
        name ||
        `${first_name || ""} ${last_name || ""}`.trim() ||
        email.split("@")[0],
      first_name: first_name || null,
      last_name: last_name || null,
      provider: provider ?? "email",
      auth_provider: provider ?? "email",
    };

    if (avatar_url) payload.avatar_url = avatar_url;

    // Validate UUID format if ID provided
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (id && uuidRegex.test(id)) {
      payload.id = id;
    }

    // Upsert user record (create or update based on email)
    const { error } = await supabase
      .from("users")
      .upsert(payload, { onConflict: "email", ignoreDuplicates: false });

    if (error) {
      console.error("[POST /api/users] Error:", error);
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[POST /api/users] Unexpected error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
