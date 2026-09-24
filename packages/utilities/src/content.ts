import { glob, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { extractCandidates } from "./generate.ts";

export async function scanContent(patterns: string[], cwd = process.cwd()) {
  const candidates = new Set<string>();
  for await (const file of glob(patterns, { cwd })) {
    for (const candidate of extractCandidates(await readFile(resolve(cwd, file), "utf8")))
      candidates.add(candidate);
  }
  return candidates;
}
