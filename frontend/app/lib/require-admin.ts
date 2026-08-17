import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import type { Session } from "~/types/api";
import { adminSession } from "./admin-session";

export const requireAdmin = cache(async () => {
  const session: Session | null = await adminSession();
  if (!session?.authenticated || session.role !== "ADMIN") {
    redirect("/admin/login");
  }
  return session;
});
