import { readFile } from "node:fs/promises";
import { expect, test } from "vite-plus/test";
import { stylexModules } from "../src/generate.ts";
import * as api from "../src/index.ts";
import { cssVar, flattenTokens, tokens } from "../src/index.ts";

const modules = stylexModules();
const declaredVars = Object.values(modules).flatMap((source) =>
  Array.from(source.matchAll(/^ {2}"(--oxy-[\w-]+)":/gm), ([, name]) => name as string),
);

test("committed StyleX modules match the token source", async () => {
  for (const [file, source] of Object.entries(modules)) {
    expect(await readFile(`${import.meta.dirname}/../src/${file}`, "utf8")).toBe(source);
  }
});

test("StyleX vars cover exactly the semantic and component tokens", () => {
  const expected = Array.from(flattenTokens(tokens).keys(), cssVar);
  expect(declaredVars).toEqual(expected);
  expect(new Set(declaredVars).size).toBe(declaredVars.length);
});

test("primitives stay out of the component-facing API", () => {
  expect(declaredVars.some((name) => /^--oxy-(palette|size|font)-/.test(name))).toBe(false);
  expect(api).not.toHaveProperty("palette");
  expect(api).not.toHaveProperty("primitives");
});

test("component tokens alias semantic tokens through CSS variables", () => {
  expect(modules["component.stylex.ts"]).toContain(
    '"--oxy-button-container-color": "var(--oxy-color-primary)"',
  );
  expect(modules["semantic.stylex.ts"]).toContain('"--oxy-radius-md": "12px"');
  expect(modules["semantic.stylex.ts"]).toContain("export const typography = stylex.defineVars({");
  expect(modules["component.stylex.ts"]).toContain("export const focusRing = stylex.defineVars({");
});
