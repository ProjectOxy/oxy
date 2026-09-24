import type { ThemeOverrides } from "@oxy/tokens";
import { size } from "@oxy/tokens/primitives";
import { composeTheme } from "./compose.ts";
import { type ColorScheme, type Contrast, schemeColors } from "./scheme.ts";

const systemFont = "system-ui, sans-serif";

const shadow = (offset: number) =>
  `0 ${offset}px ${offset * 2}px 0 color-mix(in srgb, {color.shadow} 20%, transparent)`;

const criticallyDamped = (stiffness: number) => ({ damping: "1", stiffness: String(stiffness) });

export const neutralTokens = {
  radius: {
    xs: size[2],
    sm: size[4],
    md: size[4],
    lg: size[8],
    "lg-increased": size[8],
    xl: size[12],
    "xl-increased": size[12],
    "2xl": size[16],
  },
  typography: { family: { brand: systemFont, plain: systemFont } },
  elevation: {
    level1: shadow(1),
    level2: shadow(2),
    level3: shadow(4),
    level4: shadow(6),
    level5: shadow(8),
  },
  motion: {
    spring: {
      spatial: {
        fast: criticallyDamped(1400),
        default: criticallyDamped(700),
        slow: criticallyDamped(300),
      },
    },
  },
} satisfies ThemeOverrides;

export interface NeutralThemeOptions {
  scheme?: ColorScheme;
  contrast?: Contrast;
  overrides?: ThemeOverrides;
}

export function createNeutralTheme({
  scheme = "light",
  contrast = "standard",
  overrides = {},
}: NeutralThemeOptions = {}) {
  const color = schemeColors({ seed: "#000000", scheme, contrast, variant: "monochrome" });
  return composeTheme({ color }, neutralTokens, overrides);
}

export const neutralTheme = /* @__PURE__ */ createNeutralTheme();
export const neutralDarkTheme = /* @__PURE__ */ createNeutralTheme({ scheme: "dark" });
