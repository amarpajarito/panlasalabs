import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// Fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", (session.user as any).id)
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("[profile] GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// Update user profile (public.users + auth.users)
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

    // Update public.users table
    const updateData: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    const { data: user, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update auth.users metadata
    const authMetadata: any = {};
    if (name !== undefined) {
      authMetadata.display_name = name;
      authMetadata.name = name;
      authMetadata.full_name = name;
    }
    if (first_name !== undefined) authMetadata.first_name = first_name;
    if (last_name !== undefined) authMetadata.last_name = last_name;
    if (avatar_url !== undefined) authMetadata.avatar_url = avatar_url;

    if (Object.keys(authMetadata).length > 0) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        {
          user_metadata: authMetadata,
        }
      );
      if (authError)
        console.error("[profile] Auth metadata update failed:", authError);
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("[profile] PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// Create user via upsert
export async function POST(req: Request) {
  try {
    const { id, email, name, first_name, last_name, provider, avatar_url } =
      await req.json();

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

    // Include UUID if provided
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (id && uuidRegex.test(id)) payload.id = id;

    const { error } = await supabase
      .from("users")
      .upsert(payload, { onConflict: "email", ignoreDuplicates: false });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[profile] POST error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
