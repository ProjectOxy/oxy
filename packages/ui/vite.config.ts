import { defineConfig } from "vite-plus";
import { configDefaults } from "vite-plus/test/config";
import { stylexCompilePlugin } from "../../stylex.config.ts";

export default defineConfig({
  plugins: [stylexCompilePlugin()],
  test: {
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "tests/**/*.browser.test.tsx"],
  },
  pack: {
    entry: ["src/index.ts", "src/*/index.ts"],
    platform: "browser",
    dts: { generator: "tsgo" },
    exports: { devExports: true },
    deps: { resolveDepSubpath: true },
    plugins: [stylexCompilePlugin()],
  },
});
