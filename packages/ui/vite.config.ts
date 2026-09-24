import { defineConfig } from "vite-plus";
import { stylexCompilePlugin } from "../../stylex.config.ts";

export default defineConfig({
  plugins: [stylexCompilePlugin()],
  test: { environment: "jsdom" },
  pack: {
    entry: ["src/index.ts", "src/*/index.ts"],
    platform: "browser",
    dts: { generator: "tsgo" },
    exports: { devExports: true },
    deps: { resolveDepSubpath: true },
    plugins: [stylexCompilePlugin()],
  },
});
