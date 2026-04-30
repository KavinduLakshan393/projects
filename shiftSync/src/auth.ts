import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return false;
      }

      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            avatarUrl: user.image,
          },
          create: {
            email: user.email,
            name: user.name,
            avatarUrl: user.image,
          },
        });

        return true;
      } catch (error) {
        console.error("PRISMA SIGN-IN ERROR:", error);
        return false;
      }
    },

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

      if (!token.userId && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: { settings: true },
        });

        if (dbUser) {
          token.userId = dbUser.id;
          token.needsOnboarding = !dbUser.settings;
        }
      }

      if (trigger === "update") {
        const updatedSession = session as { needsOnboarding?: unknown } | undefined;

        if (typeof updatedSession?.needsOnboarding === "boolean") {
          token.needsOnboarding = updatedSession.needsOnboarding;
        }
      }

      return token;
    },
  },
});