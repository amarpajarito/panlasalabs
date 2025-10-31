import { createClient as createBrowserClient } from "@/lib/supabase/client";

const AVATAR_BUCKET = process.env.NEXT_PUBLIC_AVATAR_BUCKET ?? "avatars";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  needsBucketCreation?: boolean;
}

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "File size must be less than 5MB",
      };
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Only JPEG, PNG, and WebP images are allowed",
      };
    }

    const supabase = createBrowserClient();

    // Create unique filename with timestamp
    const fileExt = file.name.split(".").pop();
    const filename = `${userId}/${Date.now()}.${fileExt}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filename, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      const errorMsg = String(uploadError.message ?? uploadError);

      // Check if bucket doesn't exist
      if (
        errorMsg.toLowerCase().includes("bucket not found") ||
        errorMsg.toLowerCase().includes("not found")
      ) {
        return {
          success: false,
          error: `Storage bucket "${AVATAR_BUCKET}" not found`,
          needsBucketCreation: true,
        };
      }

      return {
        success: false,
        error: errorMsg,
      };
    }

    // Get public URL
    const { data } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filename);

    if (!data?.publicUrl) {
      return {
        success: false,
        error: "Failed to get public URL for uploaded image",
      };
    }

    return {
      success: true,
      url: data.publicUrl,
    };
  } catch (err: any) {
    console.error("Avatar upload error:", err);
    return {
      success: false,
      error: err.message ?? "Failed to upload avatar",
    };
  }
}

export async function createAvatarBucket(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const res = await fetch("/api/storage/create-avatar-bucket", {
      method: "POST",
    });
    const json = await res.json();

    if (!res.ok || !json?.ok) {
      return {
        success: false,
        error: json?.error || "Failed to create bucket",
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message ?? "Failed to create bucket",
    };
  }
}
