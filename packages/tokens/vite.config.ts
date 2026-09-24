import { defineConfig } from "vite-plus";
import { stylexCompilePlugin } from "../../stylex.config.ts";

export default defineConfig({
  plugins: [stylexCompilePlugin()],
  pack: {
    entry: ["src/index.ts", "src/*.stylex.ts"],
    platform: "browser",
    dts: { generator: "tsgo" },
    exports: { devExports: true },
    deps: { resolveDepSubpath: true },
    plugins: [stylexCompilePlugin()],
  },
});
