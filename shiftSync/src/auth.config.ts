import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// ──────────────────────────────────────────────────────────────────────────────
// NEXTAUTH EDGE CONFIG
//
// This configuration is used by the Next.js Edge Runtime (Middleware).
// It MUST NOT import any Node.js-specific modules (like Prisma/pg).
// ──────────────────────────────────────────────────────────────────────────────
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // We provide a minimal session callback for the middleware to see the claims
    // without needing to query the database.
    async session({ session, token }) {
      if (token?.userId) {
        session.user.id = token.userId as string;
        (session.user as any).needsOnboarding = token.needsOnboarding;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
