import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's internal database ID. */
      id: string;
      /** Flag to indicate if the user needs to complete the onboarding flow. */
      needsOnboarding?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    /** Flag to indicate if the user needs to complete the onboarding flow. */
    needsOnboarding?: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user's internal database ID. */
    userId?: string;
    /** Flag to indicate if the user needs to complete the onboarding flow. */
    needsOnboarding?: boolean;
  }
}
