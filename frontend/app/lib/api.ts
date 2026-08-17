import { defaultLocale } from "~/i18n/config";
import { getDictionary } from "~/i18n";
import type { ApiError } from "~/types/api";

// Client-side transport failures are surfaced in the admin area, which is English-only.
const t = getDictionary(defaultLocale);

function baseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
}

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    public payload: ApiError,
  ) {
    super(payload.message);
  }
}

let csrfToken: string | null = null;
async function csrf() {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${baseUrl()}/auth/csrf`, {
    credentials: "include",
  });
  if (!response.ok)
    throw new Error(t.errors.csrf);
  const data = (await response.json()) as { token: string };
  csrfToken = data.token;
  return csrfToken;
}

export async function apiMutation<T>(path: string, init: RequestInit = {}) {
  const token = await csrf();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("X-XSRF-TOKEN", token);
  if (
    init.body &&
    !headers.has("Content-Type") &&
    !(init.body instanceof FormData)
  )
    headers.set("Content-Type", "application/json");
  const response = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  if (response.status === 403) {
    csrfToken = null;
  }
  if (!response.ok) {
    let payload: ApiError;
    try {
      payload = (await response.json()) as ApiError;
    } catch {
      payload = {
        code: "network_error",
        message: t.errors.network,
        correlationId: "unknown",
      };
    }
    throw new ApiRequestError(response.status, payload);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function resetCsrf() {
  csrfToken = null;
}
