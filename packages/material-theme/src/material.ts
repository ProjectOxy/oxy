import type { ThemeOverrides } from "@oxy/tokens";
import { composeTheme } from "./compose.ts";
import { type ColorScheme, type Contrast, schemeColors } from "./scheme.ts";

export const baselineSeed = "#6750a4";

const spring = (damping: number, stiffness: number) => ({
  damping: String(damping),
  stiffness: String(stiffness),
});

export const expressiveTokens = {
  motion: {
    spring: {
      spatial: {
        fast: spring(0.6, 800),
        default: spring(0.8, 380),
        slow: spring(0.8, 200),
      },
      effects: {
        fast: spring(1, 3800),
        default: spring(1, 1600),
        slow: spring(1, 800),
      },
    },
  },
} satisfies ThemeOverrides;

export interface MaterialThemeOptions {
  seed?: string;
  scheme?: ColorScheme;
  contrast?: Contrast;
  overrides?: ThemeOverrides;
}

export function createMaterialTheme({
  seed = baselineSeed,
  scheme = "light",
  contrast = "standard",
  overrides = {},
}: MaterialThemeOptions = {}) {
  const color = schemeColors({ seed, scheme, contrast, variant: "tonalSpot" });
  return composeTheme({ color }, expressiveTokens, overrides);
}

export const materialTheme = /* @__PURE__ */ createMaterialTheme();
export const materialDarkTheme = /* @__PURE__ */ createMaterialTheme({ scheme: "dark" });
