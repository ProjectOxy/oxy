import { defineConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";
import { stylexCssServerPlugins } from "../../stylex.config.ts";

export default defineConfig({
  plugins: stylexCssServerPlugins(),
  // react-stately's Virtualizer reads process.env.VIRT_ON, which only exists under Node.
  define: { "process.env.VIRT_ON": JSON.stringify("1") },
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
