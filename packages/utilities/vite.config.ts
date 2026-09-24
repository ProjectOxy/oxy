import { defineConfig } from "vite-plus";
import { configDefaults } from "vite-plus/test/config";
import { generateUtilities } from "./src/generate.ts";

export default defineConfig({
  test: { exclude: [...configDefaults.exclude, "tests/**/*.browser.test.ts"] },
  pack: {
    entry: ["src/index.ts", "src/vite.ts", "src/cli.ts"],
    platform: "node",
    fixedExtension: false,
    dts: { generator: "tsgo" },
    exports: {
      devExports: true,
      bin: { "oxy-utilities": "./src/cli.ts" },
      exclude: ["cli"],
      customExports: (exports) => ({ ...exports, "./utilities.css": "./dist/utilities.css" }),
    },
    plugins: [
      {
        name: "oxy:utilities-css",
        generateBundle() {
          this.emitFile({ type: "asset", fileName: "utilities.css", source: generateUtilities() });
        },
      },
    ],
  },
});
