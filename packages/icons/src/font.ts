import { createRequire } from "node:module";

export type SymbolStyle = "outlined" | "rounded" | "sharp";

export const fontFamily = (style: SymbolStyle) =>
  `Material Symbols ${style[0]?.toUpperCase()}${style.slice(1)}`;

export const fontPath = (style: SymbolStyle) =>
  createRequire(import.meta.url).resolve(`material-symbols/material-symbols-${style}.woff2`);
