import { scanContent } from "./content.ts";
import { generateUtilities, type UtilitiesConfig } from "./generate.ts";

export const utilitiesModuleId = "virtual:oxy/utilities.css";

const resolvedId = `\0${utilitiesModuleId}`;

export function oxyUtilities(config: UtilitiesConfig = {}) {
  let root = process.cwd();
  let purge = false;
  return {
    name: "oxy:utilities",
    configResolved(resolved: { root: string; command: string }) {
      root = resolved.root;
      purge = resolved.command === "build" && config.content !== undefined;
    },
    resolveId: (id: string) => (id === utilitiesModuleId ? resolvedId : undefined),
    async load(id: string) {
      if (id !== resolvedId) return undefined;
      const used = purge ? await scanContent(config.content ?? [], root) : undefined;
      return generateUtilities(config, used);
    },
  };
}
