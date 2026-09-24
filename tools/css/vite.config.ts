import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import stylex from "@stylexjs/unplugin";
import { defineConfig, type Plugin } from "vite-plus";
import { stylexOptions } from "../../stylex.config.ts";

const outDir = fileURLToPath(new URL("../../dist", import.meta.url));

const cssOnly: Plugin = {
  name: "oxy:css-only",
  closeBundle: () => rm(`${outDir}/oxy.js`, { force: true }),
};

export default defineConfig({
  plugins: [stylex.vite(stylexOptions), cssOnly],
  build: {
    outDir,
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "oxy",
      cssFileName: "oxy",
    },
    rollupOptions: {
      external: [/^react/, /^@internationalized\//, /^@stylexjs\//],
    },
  },
});
