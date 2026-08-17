import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  workers: 1,
  fullyParallel: false,
  use: { baseURL: "http://127.0.0.1:5173", trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      command: "node tests/e2e/mock-server.mjs",
      url: "http://127.0.0.1:4010/health",
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: "npm run build && npx next start -p 5173",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: true,
      timeout: 180_000,
      env: {
        INTERNAL_API_BASE_URL: "http://127.0.0.1:4010/api/v1",
        API_PROXY_TARGET: "http://127.0.0.1:4010",
      },
    },
  ],
});
