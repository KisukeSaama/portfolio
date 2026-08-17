import "server-only";

import type { Session } from "~/types/api";
import { ServerApiError, serverApi } from "./server-api";

/**
 * Reads the current session without ever failing the render. An expired or missing cookie answers
 * 401, which used to throw and replace the whole administration area, sign-in page included, with
 * the 500 screen. Treating it as "not signed in" is what the caller wanted to know anyway.
 */
export async function adminSession(): Promise<Session | null> {
  try {
    return await serverApi<Session>("/auth/session", { authenticated: true });
  } catch (error) {
    if (error instanceof ServerApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}
