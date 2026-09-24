import { argbFromHex, hexFromArgb, themeFromSourceColor } from "@material/material-color-utilities";
import { materialDarkTheme } from "@oxy/material-theme";
import { createTheme, defaultTheme, tokens, type Theme } from "@oxy/tokens";
import type { Scheme } from "@oxy/ui";
import { useMemo } from "react";

export const seeds = [
  { name: "Baseline", value: "#6750a4" },
  { name: "Ocean", value: "#0061a4" },
  { name: "Forest", value: "#386a20" },
  { name: "Sunset", value: "#b3261e" },
  { name: "Amber", value: "#7d5700" },
  { name: "Lagoon", value: "#006a6a" },
] as const;

const baseThemes: Record<Scheme, Theme> = { light: defaultTheme, dark: materialDarkTheme };

const kebab = (role: string) => role.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

function seedTheme(seed: string, scheme: Scheme): Theme {
  const generated = themeFromSourceColor(argbFromHex(seed)).schemes[scheme].toJSON();
  const color = Object.fromEntries(
    Object.entries(generated)
      .map(([role, argb]) => [kebab(role), hexFromArgb(argb)] as const)
      .filter(([role]) => role in tokens.color),
  );
  return createTheme({ color }, baseThemes[scheme]);
}

export const useSeedTheme = (seed: string, scheme: Scheme) =>
  useMemo(
    () => (seed.toLowerCase() === seeds[0].value ? baseThemes[scheme] : seedTheme(seed, scheme)),
    [seed, scheme],
  );
