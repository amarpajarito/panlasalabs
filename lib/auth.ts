import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// Server-side Supabase configuration with service role key for admin operations
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client with service role key (bypasses RLS)
function getServerSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

// Generate a deterministic UUID from a string (for OAuth provider IDs)
function generateUUIDFromString(str: string): string {
  const crypto = require("crypto");
  const hash = crypto.createHash("sha256").update(str).digest("hex");
  // Format as UUID v4
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    "4" + hash.substring(13, 16),
    ((parseInt(hash.substring(16, 18), 16) & 0x3f) | 0x80).toString(16) +
      hash.substring(18, 20),
    hash.substring(20, 32),
  ].join("-");
}

export const authOptions: NextAuthOptions = {
  providers: [
    // GitHub OAuth provider configuration
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // Email/password authentication via Supabase
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const supabase = getServerSupabase();

        // Attempt sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        // Handle specific error cases
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Please verify your email before signing in");
          }
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password");
          }
          throw new Error(error.message);
        }

        if (!data?.user) {
          throw new Error("Authentication failed");
        }

        // Fetch user details from public.users table
        const { data: userData } = await supabase
          .from("users")
          .select("name, avatar_url")
          .eq("id", data.user.id)
          .maybeSingle();

        // Return user object for session
        return {
          id: data.user.id,
          email: data.user.email!,
          name:
            userData?.name ||
            data.user.user_metadata?.name ||
            data.user.user_metadata?.full_name ||
            data.user.email!.split("@")[0],
          image:
            userData?.avatar_url || data.user.user_metadata?.avatar_url || null,
        };
      },
    }),
  ],
  callbacks: {
    // Handle sign-in process and create user records if needed
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.error("[signIn] No email provided");
        return false;
      }

      try {
        const supabase = getServerSupabase();

        // For OAuth providers (GitHub, etc.), generate a proper UUID from their ID
        let userId = user.id;
        if (account?.provider && account.provider !== "credentials") {
          // Generate deterministic UUID from provider + provider's user ID
          userId = generateUUIDFromString(
            `${account.provider}-${account.providerAccountId}`
          );
          user.id = userId; // Update user.id for token callbacks
        }

        // Check if user already exists in public.users
        const { data: existingUser } = await supabase
          .from("users")
          .select("id, name, avatar_url")
          .eq("email", user.email)
          .maybeSingle();

        if (!existingUser) {
          // Extract name from profile or user object
          let fullName = user.name || user.email.split("@")[0];

          // For GitHub OAuth, use profile data
          if (account?.provider === "github" && profile) {
            fullName = profile.name || (profile as any)?.login || fullName;
          }

          // Create new user record in public.users (using service role to bypass RLS)
          const { error: insertError } = await supabase.from("users").insert({
            id: userId,
            email: user.email,
            name: fullName,
            avatar_url: user.image || (profile as any)?.avatar_url || null,
            provider: account?.provider || "credentials",
            auth_provider: account?.provider || "credentials",
          });

          if (insertError) {
            console.error("[signIn] Error creating user:", insertError);
            return false;
          }

          console.log("[signIn] Successfully created user:", user.email);
        } else {
          // Update user.id to match existing user for OAuth re-login
          user.id = existingUser.id;

          // For OAuth logins, update name and image from database (not from provider)
          // This ensures user's custom profile changes are preserved
          if (account?.provider && account.provider !== "credentials") {
            user.name = existingUser.name || user.name;
            user.image = existingUser.avatar_url || user.image;
            console.log("[signIn] Using saved profile:", {
              name: user.name,
              image: user.image,
            });
          }
        }

        return true;
      } catch (error) {
        console.error("[signIn] Unexpected error:", error);
        return false;
      }
    },

    // Build JWT token with user data
    async jwt({ token, user, trigger, session }) {
      // On initial sign in, populate token with user data
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // Handle session updates (triggered by session.update())
      if (trigger === "update" && session) {
        const supabase = getServerSupabase();

        try {
          // Fetch latest user data from public.users table
          const { data: publicUser } = await supabase
            .from("users")
            .select("name, avatar_url")
            .eq("id", token.id)
            .maybeSingle();

          if (publicUser) {
            // Update token with fresh data
            if (publicUser.name) token.name = publicUser.name;
            if (publicUser.avatar_url) token.picture = publicUser.avatar_url;
          }

          // Also check auth.users metadata
          const { data: authUser } = await supabase.auth.admin.getUserById(
            token.id as string
          );

          if (authUser?.user?.user_metadata) {
            const metadata = authUser.user.user_metadata;
            token.name = metadata.name || metadata.full_name || token.name;
            token.picture =
              metadata.avatar_url || metadata.picture || token.picture;
          }
        } catch (err) {
          console.error("[jwt] Error fetching updated user data:", err);
        }
      }

      return token;
    },

    // Build session object from JWT token
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
