import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    // 1. Auto-provision user on first sign in
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
            },
          });
        }
        return true;
      }
      return false; // Reject sign-ins without email
    },

    // 2. Add custom claims to the JWT
    async jwt({ token, user, trigger, session }) {
      // `user` is only available on initial sign-in
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { settings: true },
        });

        if (dbUser) {
          token.userId = dbUser.id;
          // If no settings exist, they need onboarding
          token.needsOnboarding = !dbUser.settings;
        }
      }

      // Allow manually updating the token when onboarding completes
      if (trigger === "update" && session?.needsOnboarding === false) {
        token.needsOnboarding = false;
      }

      return token;
    },

    // 3. Expose those claims to the client/server session object
    async session({ session, token }) {
      if (token?.userId) {
        session.user.id = token.userId as string;
        // We cast to any here to bypass the default NextAuth types safely,
        // although extending the types in next-auth.d.ts is best practice.
        (session.user as any).needsOnboarding = token.needsOnboarding;
      }
      return session;
    },
  },
});
