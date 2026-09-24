import { fileURLToPath } from "node:url";
import stylex from "@stylexjs/unplugin";
import type { Plugin } from "vite-plus";
import { stylexLayers } from "./packages/utilities/src/layers.ts";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export const stylexOptions = {
  dev: false,
  runtimeInjection: false,
  classNamePrefix: "oxy",
  useCSSLayers: stylexLayers,
  unstable_moduleResolution: { type: "commonJS", rootDir },
} as const;

export function stylexCompilePlugin() {
  const { generateBundle, writeBundle, ...compileOnly } = stylex.rolldown(stylexOptions);
  return compileOnly;
}

export function stylexCssServerPlugins(): Plugin[] {
  const compiler = stylex.rolldown(stylexOptions) as Plugin & { __stylexCollectCss(): string };
  return [
    compiler,
    {
      name: "oxy:stylex-css",
      configureServer(server) {
        server.middlewares.use("/stylex.css", (_, response) => {
          response.setHeader("Content-Type", "text/css");
          response.end(compiler.__stylexCollectCss());
        });
      },
    },
  ];
}
