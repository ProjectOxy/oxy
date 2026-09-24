import { readFile } from "node:fs/promises";
import { expect, test } from "vite-plus/test";
import { stylexModule } from "../src/generate.ts";

test("committed motion.stylex.ts matches the motion tokens", async () => {
  expect(await readFile(`${import.meta.dirname}/../src/motion.stylex.ts`, "utf8")).toBe(
    await stylexModule(),
  );
});
