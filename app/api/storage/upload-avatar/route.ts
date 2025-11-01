import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key (bypasses RLS)
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(req: Request) {
  try {
    // Check authentication
    const session: any = await getServerSession(authOptions as any);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "You must be logged in to upload an avatar" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();

    // Create unique filename with timestamp
    const fileExt = file.name.split(".").pop();
    const filename = `${userId}/${Date.now()}.${fileExt}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file using service role (bypasses RLS)
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error(
        "[POST /api/storage/upload-avatar] Upload error:",
        uploadError
      );
      return NextResponse.json(
        { error: uploadError.message || "Failed to upload avatar" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filename);

    if (!data?.publicUrl) {
      return NextResponse.json(
        { error: "Failed to get public URL for uploaded image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: data.publicUrl,
    });
  } catch (err: any) {
    console.error("[POST /api/storage/upload-avatar] Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
