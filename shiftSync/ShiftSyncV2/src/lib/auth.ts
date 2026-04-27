import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE = "shiftsync_uid";

export async function getCurrentUserId(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value ?? null;
}

export async function requireUserId(): Promise<string> {
  const id = await getCurrentUserId();
  if (!id) {
    redirect("/login");
  }
  return id;
}

export const authCookieName = AUTH_COOKIE;
