import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import type { Session } from "~/types/api";
import { serverApi } from "./server-api";

export const requireAdmin = cache(async () => {
  const session = await serverApi<Session>("/auth/session", {
    authenticated: true,
  });
  if (!session.authenticated || session.role !== "ADMIN") {
    redirect("/admin/login");
  }
  return session;
});
