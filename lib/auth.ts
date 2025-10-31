import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client (anon key for auth operations)
function getSupabaseAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-side Supabase client (service role for privileged operations)
function getSupabaseServerClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
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

        const supabase = getSupabaseAnonClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          console.error("[auth] Credentials failed:", error);
          throw new Error(error?.message || "Invalid credentials");
        }

        return {
          id: data.user.id,
          email: data.user.email!,
          name:
            data.user.user_metadata?.display_name ||
            data.user.user_metadata?.full_name ||
            data.user.email,
          image: data.user.user_metadata?.avatar_url,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        const supabase = getSupabaseServerClient();

        // Check if user exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (!existingUser) {
          // Create new user
          const { error } = await supabase.from("users").insert({
            email: user.email,
            name: user.name,
            avatar_url: user.image,
            provider: "github",
          });

          if (error) {
            console.error("[auth] Error creating user:", error);
          }
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      const newToken: any = { ...token };

      // Initial sign-in: set token data
      if (user) {
        newToken.email = user.email;
        newToken.name = user.name;
        newToken.picture = user.image;

        // Resolve user UUID from public.users table
        if (account?.provider === "github") {
          try {
            const supabase = getSupabaseServerClient();
            const { data: dbUser } = await supabase
              .from("users")
              .select("id")
              .eq("email", user.email)
              .single();

            newToken.id = dbUser?.id || user.id;
          } catch (e) {
            console.error("[auth] Error resolving user ID:", e);
            newToken.id = user.id;
          }

          newToken.provider = "github";
        } else {
          newToken.id = user.id;
        }
      }

      // Handle session updates (when updateSession is called)
      if (trigger === "update" && session) {
        newToken.name = session.user?.name ?? newToken.name;
        newToken.picture = session.user?.image ?? newToken.picture;
      }

      // Sync with auth.users metadata on every request
      if (newToken.id) {
        try {
          const supabase = getSupabaseServerClient();
          const { data: authUser } = await supabase.auth.admin.getUserById(
            newToken.id as string
          );

          if (authUser?.user?.user_metadata) {
            const meta = authUser.user.user_metadata;
            // Update token with latest metadata
            if (meta.display_name) newToken.name = meta.display_name;
            else if (meta.name) newToken.name = meta.name;
            else if (meta.full_name) newToken.name = meta.full_name;

            if (meta.avatar_url) newToken.picture = meta.avatar_url;
          }
        } catch (e) {
          // Silently fail - don't block auth flow
        }
      }

      return newToken;
    },

    async session({ session, token }) {
      if (session.user) {
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
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
