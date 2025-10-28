import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// Helper function to create Supabase client for auth operations
function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-side anon client (safe to use for auth password grant).
function getSupabaseAnonClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-side Supabase client using the service role key.
// Use this for privileged operations (inserts/updates) inside server-side
// callbacks such as NextAuth signIn to avoid RLS blocks.
function getSupabaseServerClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
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

        // Use a server-capable anon client to perform the password grant.
        const supabase = getSupabaseAnonClient();

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        // Log the raw response for debugging when credentials fail
        console.log("[auth] signInWithPassword response:", { data, error });

        if (error || !data.user) {
          // Include error details in the thrown message for NextAuth logs
          const msg = error?.message || "Invalid credentials";
          console.error("[auth] Credentials authorize failed:", error);
          throw new Error(msg);
        }

        return {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || data.user.email,
          image: data.user.user_metadata?.avatar_url,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        // use the server client for DB writes to bypass RLS policies and the
        // need for an active Supabase auth session in this context
        const supabase = getSupabaseServerClient();

        // Check if user exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();

        if (!existingUser) {
          // Create user in Supabase. Do NOT use the OAuth provider's numeric
          // id as the PK (GitHub returns a numeric id like "145326531") since
          // our `users.id` column is a UUID. Let the DB generate a UUID (or
          // supply one from the server) instead of inserting the provider id.
          const payload: any = {
            email: user.email,
            name: user.name,
            provider: "github",
          };

          if (user.image) payload.avatar_url = user.image;

          try {
            const { error } = await supabase.from("users").insert(payload);
            if (error) {
              // Log but don't block sign-in; fix the DB schema if you want to
              // persist these fields.
              console.error("Error creating user:", error);
            }
          } catch (err) {
            console.error("Unexpected error creating user:", err);
          }
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Keep the token minimal and deterministic. On initial sign-in, ensure
      // the token.id is the application's user UUID (not the OAuth provider
      // numeric id). For GitHub OAuth we look up the user by email in our
      // Supabase `users` table and replace the token id with the DB UUID.
      const newToken: any = { ...token };
      if (user) {
        // Default: copy fields from NextAuth's user object
        newToken.email = user.email;
        newToken.name = user.name;
        newToken.picture = user.image;

        // If this is a GitHub sign-in (or other OAuth), NextAuth may provide
        // the provider's numeric id as user.id. Resolve the application
        // user UUID from our `users` table using the server Supabase client.
        if (account?.provider === "github") {
          try {
            const supabase = getSupabaseServerClient();
            const { data: dbUser, error } = await supabase
              .from("users")
              .select("id")
              .eq("email", user.email)
              .maybeSingle();

            if (!error && dbUser && (dbUser as any).id) {
              newToken.id = (dbUser as any).id;
            } else {
              // Fallback to whatever NextAuth gave us (rare). This avoids
              // blocking sign-in on unexpected DB issues.
              newToken.id = user.id;
            }
          } catch (e) {
            console.error(
              "Error resolving Supabase user id in jwt callback:",
              e
            );
            newToken.id = user.id;
          }
        } else {
          // Non-OAuth (credentials) paths should already return the application
          // user id from authorize(), so use that.
          newToken.id = user.id;
        }
      }

      if (account?.provider === "github") {
        newToken.provider = "github";
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
