import { baselineSeed, createMaterialTheme } from "@oxy/material-theme";
import type { Scheme } from "@oxy/ui";
import { useMemo } from "react";

export const seeds = [
  { name: "Baseline", value: baselineSeed },
  { name: "Ocean", value: "#0061a4" },
  { name: "Forest", value: "#386a20" },
  { name: "Sunset", value: "#b3261e" },
  { name: "Amber", value: "#7d5700" },
  { name: "Lagoon", value: "#006a6a" },
] as const;

export const useSeedTheme = (seed: string, scheme: Scheme) =>
  useMemo(() => createMaterialTheme({ seed, scheme }), [seed, scheme]);
