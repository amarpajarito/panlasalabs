import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface UserData {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function useUserSession() {
  const { data: session, update: updateSession } = useSession();
  const [user, setUser] = useState<UserData | null>(null);

  // Use refs to avoid stale closures
  const sessionRef = useRef(session);
  const updateSessionRef = useRef(updateSession);

  // Keep refs updated
  useEffect(() => {
    sessionRef.current = session;
    updateSessionRef.current = updateSession;
  }, [session, updateSession]);

  // Sync with session
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: (session.user as any).id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    } else {
      setUser(null);
    }
  }, [session]);

  // Listen for profile updates (only set up once)
  useEffect(() => {
    const handleProfileUpdate = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail) return;

      console.log("[useUserSession] Received profile update:", detail);

      // Update local state immediately for instant UI feedback
      setUser((prev) => (prev ? { ...prev, ...detail } : null));

      // Force NextAuth session refresh
      const currentUpdateSession = updateSessionRef.current;
      if (currentUpdateSession) {
        console.log("[useUserSession] Triggering NextAuth session update");
        currentUpdateSession({
          user: {
            name: detail.name,
            image: detail.image,
          },
        });
      }
    };

    window.addEventListener("user-profile-updated", handleProfileUpdate);
    return () =>
      window.removeEventListener("user-profile-updated", handleProfileUpdate);
  }, []); // Empty deps - uses refs for latest values

  return { user, session };
}
