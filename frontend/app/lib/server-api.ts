import "server-only";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const serverBaseUrl =
  process.env.INTERNAL_API_BASE_URL ?? "http://localhost:8080/api/v1";

type ServerApiOptions = {
  authenticated?: boolean;
  notFoundOn404?: boolean;
  revalidate?: number;
};

export class ServerApiError extends Error {
  constructor(public readonly status: number) {
    super(`API request failed with status ${status}`);
  }
}

export async function serverApi<T>(
  path: string,
  options: ServerApiOptions = {},
): Promise<T> {
  const headers = new Headers({ Accept: "application/json" });
  if (options.authenticated) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    if (cookieHeader) headers.set("Cookie", cookieHeader);
  }

  const response = await fetch(`${serverBaseUrl}${path}`, {
    headers,
    cache:
      options.authenticated || options.revalidate === 0
        ? "no-store"
        : undefined,
    next:
      options.authenticated || options.revalidate === 0
        ? undefined
        : { revalidate: options.revalidate ?? 300 },
  });

  if (response.status === 404 && options.notFoundOn404) notFound();
  if (!response.ok) throw new ServerApiError(response.status);
  return response.json() as Promise<T>;
}

/**
 * For pages that are worth serving without the API. The home and projects pages are mostly static
 * narrative, and throwing here replaced all of it with a bare error screen whenever the backend was
 * unreachable. `notFound()` still propagates, so a missing project keeps returning a 404.
 */
export async function serverApiOrNull<T>(
  path: string,
  options: ServerApiOptions = {},
): Promise<T | null> {
  try {
    return await serverApi<T>(path, options);
  } catch (error) {
    // `notFound()` and `redirect()` signal through a thrown error; those must keep propagating.
    const digest = (error as { digest?: unknown }).digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_")) throw error;
    return null;
  }
}
