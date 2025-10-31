import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getServerSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const supabase = getServerSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data?.user) return null;

        return {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || data.user.email!,
          image: data.user.user_metadata?.avatar_url || null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      const supabase = getServerSupabase();

      // Check if user exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (!existingUser) {
        // Create new user in public.users
        const { error } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          name: user.name || profile?.name || user.email,
          avatar_url: user.image || (profile as any)?.picture || null,
          provider: account?.provider || "credentials",
          auth_provider: account?.provider || "credentials",
        });

        if (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // Handle session updates (from updateSession call)
      if (trigger === "update" && session) {
        console.log("[jwt callback] Session update triggered:", session);

        // Fetch latest data from auth.users
        const supabase = getServerSupabase();
        try {
          const { data: authUser } = await supabase.auth.admin.getUserById(
            token.id as string
          );

          if (authUser?.user) {
            const metadata = authUser.user.user_metadata || {};

            // Update token with latest auth.users metadata
            token.name = metadata.name || metadata.full_name || token.name;
            token.picture =
              metadata.avatar_url || metadata.picture || token.picture;

            console.log("[jwt callback] Updated token from auth.users:", {
              name: token.name,
              picture: token.picture,
            });
          }

          // Also fetch from public.users as fallback
          const { data: publicUser } = await supabase
            .from("users")
            .select("name, avatar_url")
            .eq("id", token.id)
            .maybeSingle();

          if (publicUser) {
            // Use public.users data if auth.users didn't have it
            if (!token.name && publicUser.name) {
              token.name = publicUser.name;
            }
            if (!token.picture && publicUser.avatar_url) {
              token.picture = publicUser.avatar_url;
            }
          }
        } catch (err) {
          console.error(
            "[jwt callback] Error fetching updated user data:",
            err
          );
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
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
