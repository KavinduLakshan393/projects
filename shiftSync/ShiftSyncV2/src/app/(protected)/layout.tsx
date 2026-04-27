import ShellClient from "@/components/ShellClient";
import { requireUserId } from "@/lib/auth";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireUserId();
  return <ShellClient>{children}</ShellClient>;
}
