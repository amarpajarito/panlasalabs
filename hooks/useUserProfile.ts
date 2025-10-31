import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, ProfileUpdatePayload } from "@/types/user";

export function useUserProfile() {
  const { data: session, update: updateSession } = useSession();
  const userId = (session as any)?.user?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/users/profile");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error || "Failed to load profile");
        }

        if (json?.ok && json.user) {
          setUser(json.user);
        }
      } catch (err: any) {
        console.error("Load profile error:", err);
        setError(err.message ?? "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  // Update user profile
  const updateProfile = async (
    payload: ProfileUpdatePayload
  ): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: "No user session" };
    }

    try {
      console.log("[useUserProfile] Updating with payload:", payload);

      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      console.log("[useUserProfile] API response:", json);

      if (!res.ok) {
        throw new Error(json?.error || "Failed to update profile");
      }

      if (json?.ok && json.user) {
        setUser(json.user);

        // Force session refresh to pull new data from auth
        if (updateSession) {
          console.log("[useUserProfile] Triggering session refresh");

          // This triggers the jwt callback with trigger="update"
          await updateSession({
            user: {
              name: json.user.name,
              image: json.user.avatar_url,
            },
          });
        }

        // Dispatch event
        const eventDetail = {
          name: json.user.name ?? undefined,
          image: json.user.avatar_url ?? undefined,
          email: json.user.email ?? undefined,
        };

        console.log(
          "[useUserProfile] Dispatching event with detail:",
          eventDetail
        );

        window.dispatchEvent(
          new CustomEvent("user-profile-updated", { detail: eventDetail })
        );

        return { success: true };
      }

      return { success: false, error: "Invalid response from server" };
    } catch (err: any) {
      console.error("Update profile error:", err);
      return {
        success: false,
        error: err.message ?? "Failed to update profile",
      };
    }
  };

  return {
    user,
    loading,
    error,
    updateProfile,
  };
}
