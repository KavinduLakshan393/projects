import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    
    // 1. Auto-provision user on first sign in (Node runtime only)
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
      return false;
    },

    // 2. Add custom claims to the JWT (Node runtime during sign-in)
    async jwt({ token, user, trigger, session }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { settings: true },
        });

        if (dbUser) {
          token.userId = dbUser.id;
          token.needsOnboarding = !dbUser.settings;
        }
      }

      if (trigger === "update" && session?.needsOnboarding === false) {
        token.needsOnboarding = false;
      }

      return token;
    },
  },
});
