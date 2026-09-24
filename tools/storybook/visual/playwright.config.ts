import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const port = 6007;
const storybookDir = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  testDir: ".",
  outputDir: "test-results",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "report", open: "never" }]]
    : [["list"], ["html", { outputFolder: "report", open: "never" }]],
  expect: {
    toHaveScreenshot: { animations: "disabled", caret: "hide", maxDiffPixels: 0 },
  },
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    ...devices["Desktop Chrome"],
    viewport: { width: 800, height: 600 },
    deviceScaleFactor: 1,
  },
  webServer: {
    command: `node_modules/.bin/http-server storybook-static --port ${port} --silent -c-1`,
    cwd: storybookDir,
    url: `http://127.0.0.1:${port}/iframe.html`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
