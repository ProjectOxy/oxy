import stylex from "@stylexjs/unplugin";
import { defineConfig, type Plugin } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";
import { stylexOptions } from "../../stylex.config.ts";

const stylexCompiler = stylex.rolldown(stylexOptions) as Plugin & { __stylexCollectCss(): string };

const stylexCss: Plugin = {
  name: "oxy:stylex-css",
  configureServer(server) {
    server.middlewares.use("/stylex.css", (_, response) => {
      response.setHeader("Content-Type", "text/css");
      response.end(stylexCompiler.__stylexCollectCss());
    });
  },
};

export default defineConfig({
  plugins: [stylexCompiler, stylexCss],
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
