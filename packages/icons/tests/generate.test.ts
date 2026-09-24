// @vitest-environment node
import { readFile } from "node:fs/promises";
import { expect, test } from "vite-plus/test";
import { directionalSymbols, exportName, symbolNames, symbolsModule } from "../src/generate.ts";

test("committed symbols.ts matches the material-symbols font", { timeout: 30_000 }, async () => {
  expect(await readFile(`${import.meta.dirname}/../src/symbols.ts`, "utf8")).toBe(
    await symbolsModule(),
  );
});

test("every directional symbol exists in the font", async () => {
  const names = new Set(await symbolNames());
  expect([...directionalSymbols].filter((name) => !names.has(name))).toEqual([]);
});

test("symbol names become valid export names", () => {
  expect(exportName("arrow_back")).toBe("arrowBack");
  expect(exportName("arrow_back_2")).toBe("arrowBack2");
  expect(exportName("3d_rotation")).toBe("_3dRotation");
  expect(exportName("delete")).toBe("delete_");
});
