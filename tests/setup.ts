import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Server Components read the per-request CSP nonce through next/headers, which needs a request
// scope Vitest does not provide. Pages are rendered here as plain functions, so stand one in.
vi.mock("next/headers", () => ({
  headers: () => Promise.resolve(new Headers({ "x-nonce": "test-nonce" })),
  cookies: () => Promise.resolve({ toString: () => "", get: () => undefined }),
}));
