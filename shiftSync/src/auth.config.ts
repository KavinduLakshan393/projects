import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const authConfig = {
  providers: [
    Google({
      clientId: getRequiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && typeof token.userId === "string") {
        session.user.id = token.userId;
        session.user.needsOnboarding = Boolean(token.needsOnboarding);
      }

      return session;
    },
  },
} satisfies NextAuthConfig;