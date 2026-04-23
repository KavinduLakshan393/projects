import { redirect } from "next/navigation";

export default function Home() {
  // Temporarily redirect to the dashboard so we can test the App Shell.
  // In Phase 3, this will be protected by middleware and handle auth routing.
  redirect("/dashboard");
}
