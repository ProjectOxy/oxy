import { readFile } from "node:fs/promises";
import { posix } from "node:path";
import subsetFont from "subset-font";
import type { Plugin, Rolldown } from "vite-plus";
import { fontFamily, fontPath, type SymbolStyle } from "./font.ts";

export type { SymbolStyle };

export interface MaterialSymbolsOptions {
  style?: SymbolStyle;
}

export const materialSymbolsCss = "virtual:oxy/material-symbols.css";

const resolvedCss = `\0${materialSymbolsCss}`;
const fontPlaceholder = "data:font/woff2;oxy-material-symbols";
const codepointPattern = /\bcodepoint:\s*(0x[\da-f]+|\d+)/gi;

type OutputFile = Rolldown.OutputAsset | Rolldown.OutputChunk;

const referencesFont = (file: OutputFile): file is Rolldown.OutputAsset & { source: string } =>
  file.type === "asset" && typeof file.source === "string" && file.source.includes(fontPlaceholder);

export function materialSymbols({ style = "outlined" }: MaterialSymbolsOptions = {}): Plugin {
  let serve = false;
  return {
    name: "oxy:material-symbols",
    enforce: "post",
    configResolved(config) {
      serve = config.command === "serve";
    },
    resolveId: (id) => (id === materialSymbolsCss ? resolvedCss : undefined),
    load(id) {
      if (id !== resolvedCss) return;
      const src = serve ? `/@fs${fontPath(style)}` : fontPlaceholder;
      return `@font-face { font-family: "${fontFamily(style)}"; font-style: normal; font-weight: 100 700; font-display: block; src: url("${src}") format("woff2"); }`;
    },
    async generateBundle(_, bundle) {
      const stylesheets = Object.values(bundle).filter(referencesFont);
      if (!stylesheets.length) return;
      const codepoints = new Set(
        Object.values(bundle).flatMap((file) =>
          file.type === "chunk"
            ? Array.from(file.code.matchAll(codepointPattern), ([, codepoint]) => Number(codepoint))
            : [],
        ),
      );
      const font = await subsetFont(
        await readFile(fontPath(style)),
        String.fromCodePoint(...codepoints),
        { targetFormat: "woff2" },
      );
      const fontFile = this.getFileName(
        this.emitFile({ type: "asset", name: `material-symbols-${style}.woff2`, source: font }),
      );
      for (const stylesheet of stylesheets) {
        const url = posix.relative(posix.dirname(stylesheet.fileName), fontFile);
        stylesheet.source = stylesheet.source.replaceAll(fontPlaceholder, url);
      }
    },
  };
}
