import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";
import { stylexCssServerPlugins } from "../../stylex.config.ts";

export default defineConfig({
  plugins: stylexCssServerPlugins(),
  test: {
    name: "@oxy/ui (browser)",
    include: ["tests/**/*.browser.test.tsx"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
