import { defaultTheme, type Theme } from "./theme.ts";
import { resolveTokens } from "./tree.ts";

export const WCAG_AA = 4.5;

export interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  passes: boolean;
}

type Rgb = [number, number, number];

function parseColor(value: string): Rgb | undefined {
  const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(value.trim())?.[1];
  if (hex) {
    const full = hex.length === 3 ? hex.replace(/./g, "$&$&") : hex;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
  }
  const rgb = /^rgb\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*\)$/i.exec(value.trim());
  return rgb ? (rgb.slice(1).map(Number) as Rgb) : undefined;
}

function luminance(rgb: Rgb) {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  if (!fg || !bg) return Number.NaN;
  const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

export function checkContrast(theme: Theme = defaultTheme, minimum = WCAG_AA): ContrastResult[] {
  const resolved = resolveTokens(theme.tokens);
  const pairs = Object.keys(theme.tokens.color).flatMap((role) => {
    const [, prefix, surface] = /^(.*)on-(.+)$/.exec(role) ?? [];
    const background = `${prefix}${surface}`;
    return surface !== undefined && background in theme.tokens.color ? [[role, background]] : [];
  });

  return pairs.map(([foreground, background]) => {
    const ratio = contrastRatio(
      resolved.get(`color.${foreground}`) as string,
      resolved.get(`color.${background}`) as string,
    );
    return {
      foreground: `color.${foreground}`,
      background: `color.${background}`,
      ratio,
      passes: ratio >= minimum,
    };
  });
}

export function assertContrast(theme: Theme = defaultTheme, minimum = WCAG_AA) {
  const failures = checkContrast(theme, minimum).filter(({ passes }) => !passes);
  if (failures.length === 0) return;
  const lines = failures.map(({ foreground, background, ratio }) =>
    Number.isNaN(ratio)
      ? `  ${foreground} / ${background}: colors cannot be parsed`
      : `  ${foreground} / ${background}: ${ratio.toFixed(2)}:1`,
  );
  throw new Error(`Token contrast below WCAG AA (${minimum}:1):\n${lines.join("\n")}`);
}
