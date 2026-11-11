import { defineConfig } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "node mock-server/server.js",
    url: BASE_URL + "/confirmation.html",
    reuseExistingServer: !process.env.CI,
    timeout: 20_000,
  },
});