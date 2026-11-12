import { defineConfig } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  // The mock holds cart state globally, so the shared-state tests run serially.
  // In a real system the cart would be scoped per session/test to allow full parallelism.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node mock-server/server.js",
    url: BASE_URL + "/shop.html",
    reuseExistingServer: !process.env.CI,
    timeout: 20_000,
  },
});