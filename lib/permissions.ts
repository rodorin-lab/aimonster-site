import { redirect } from "next/navigation";
import { auth } from "./auth";

// Server Component / Route Handler guard for membership pages.
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");
  return session;
}
