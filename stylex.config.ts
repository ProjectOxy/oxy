import { fileURLToPath } from "node:url";
import stylex from "@stylexjs/unplugin";
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
