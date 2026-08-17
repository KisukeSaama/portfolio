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
