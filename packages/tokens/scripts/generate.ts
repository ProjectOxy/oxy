import { writeFile } from "node:fs/promises";
import { assertContrast } from "../src/contrast.ts";
import { stylexModules } from "../src/generate.ts";

assertContrast();

await Promise.all(
  Object.entries(stylexModules()).map(([file, source]) =>
    writeFile(new URL(`../src/${file}`, import.meta.url), source),
  ),
);
