import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";
import { stylexCssServerPlugins } from "../../stylex.config.ts";

export default defineConfig({
  plugins: stylexCssServerPlugins(),
  test: {
    name: "@oxy/utilities (browser)",
    include: ["tests/**/*.browser.test.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
