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
    // Validate user ID is provided (indicates authenticated session)
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to upload an avatar",
      };
    }

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

    // Upload via API route (uses service role to bypass RLS)
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/storage/upload-avatar", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      // Check if bucket doesn't exist
      if (
        result.error?.toLowerCase().includes("bucket not found") ||
        result.error?.toLowerCase().includes("not found")
      ) {
        return {
          success: false,
          error: `Storage bucket "${AVATAR_BUCKET}" not found`,
          needsBucketCreation: true,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to upload avatar",
      };
    }

    if (!result.url) {
      return {
        success: false,
        error: "Failed to get public URL for uploaded image",
      };
    }

    return {
      success: true,
      url: result.url,
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
