// @vitest-environment node
import { create, type Font } from "fontkit";
import { build, type Plugin, type Rolldown } from "vite-plus";
import { expect, test } from "vite-plus/test";
import { arrowBack, home } from "../src/index.ts";
import { materialSymbols, materialSymbolsCss } from "../src/vite.ts";

const icons = new URL("../src/index.ts", import.meta.url).pathname;

const virtualEntry = (code: string): Plugin => ({
  name: "entry",
  resolveId: (id) => (id === "entry" ? "\0entry" : undefined),
  load: (id) => (id === "\0entry" ? code : undefined),
});

async function bundle(code: string) {
  const result = (await build({
    configFile: false,
    logLevel: "silent",
    plugins: [virtualEntry(code), materialSymbols()],
    build: {
      write: false,
      rollupOptions: {
        input: "entry",
        external: [/^react/, /^@stylexjs\//, /^@oxy\//],
        preserveEntrySignatures: "strict",
      },
    },
  })) as Rolldown.RolldownOutput;
  return result.output;
}

const chunkSize = (output: Rolldown.RolldownOutput["output"]) =>
  output.reduce((size, file) => size + (file.type === "chunk" ? file.code.length : 0), 0);

test("importing one icon does not pull in the whole set", async () => {
  const one = await bundle(`export { Icon, arrowBack } from "${icons}";`);
  const all = await bundle(`export * from "${icons}";`);
  const code = one.flatMap((file) => (file.type === "chunk" ? file.code : [])).join("");
  expect(code.match(/\bcodepoint:\s*\w+/g)).toEqual([`codepoint:${arrowBack.codepoint}`]);
  expect(chunkSize(one)).toBeLessThan(4_000);
  expect(chunkSize(all)).toBeGreaterThan(100 * chunkSize(one));
});

test("the Vite plugin ships a font with only the icons in the bundle", async () => {
  const output = await bundle(
    `import "${materialSymbolsCss}"; import { arrowBack } from "${icons}"; console.log(arrowBack);`,
  );
  const font = output.find((file) => file.fileName.endsWith(".woff2"));
  const css = output.find((file) => file.fileName.endsWith(".css"));
  if (font?.type !== "asset" || css?.type !== "asset") throw new Error("font or CSS missing");
  const subset = create(Buffer.from(font.source)) as Font;
  expect(subset.glyphForCodePoint(arrowBack.codepoint).id).not.toBe(0);
  expect(subset.glyphForCodePoint(home.codepoint).id).toBe(0);
  expect(Object.keys(subset.variationAxes).toSorted()).toEqual(["FILL", "GRAD", "opsz", "wght"]);
  expect(font.source.length).toBeLessThan(10_000);
  expect(css.source).toContain("Material Symbols Outlined");
  expect(css.source).toContain(font.fileName.split("/").at(-1));
});
