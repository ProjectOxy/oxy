import {
  argbFromHex,
  type DynamicScheme,
  hexFromArgb,
  Hct,
  SchemeMonochrome,
  SchemeTonalSpot,
} from "@material/material-color-utilities";
import { tokens, type ThemeOverrides } from "@oxy/tokens";

export type ColorScheme = "light" | "dark";
export type Contrast = "standard" | "medium" | "high";

export const colorSchemes: readonly ColorScheme[] = ["light", "dark"];
export const contrasts: readonly Contrast[] = ["standard", "medium", "high"];

const contrastLevel: Record<Contrast, number> = { standard: 0, medium: 0.5, high: 1 };

const schemeVariants = { tonalSpot: SchemeTonalSpot, monochrome: SchemeMonochrome };

interface SchemeOptions {
  seed: string;
  scheme: ColorScheme;
  contrast: Contrast;
  variant: keyof typeof schemeVariants;
}

const camelCase = (name: string) => name.replace(/-(\w)/g, (_, char: string) => char.toUpperCase());

function argbOf(scheme: DynamicScheme, role: string): number {
  const argb: unknown = Reflect.get(scheme, camelCase(role));
  if (typeof argb !== "number") throw new Error(`No Material color role for color.${role}`);
  return argb;
}

export function schemeColors({ seed, scheme, contrast, variant }: SchemeOptions) {
  const dynamicScheme = new schemeVariants[variant](
    Hct.fromInt(argbFromHex(seed)),
    scheme === "dark",
    contrastLevel[contrast],
    "2025",
  );
  return Object.fromEntries(
    Object.entries(tokens.color)
      .filter(([, value]) => !value.startsWith("{"))
      .map(([role]) => [role, hexFromArgb(argbOf(dynamicScheme, role))]),
  ) satisfies ThemeOverrides["color"];
}
