import { argbFromHex, hexFromArgb, themeFromSourceColor } from "@material/material-color-utilities";
import { materialDarkTheme } from "@oxy/material-theme";
import { createTheme, defaultTheme, tokens, type Theme } from "@oxy/tokens";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { I18nProvider } from "react-aria-components";

export type Scheme = "light" | "dark";

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

export interface OxyProviderProps {
  locale?: string;
  scheme?: Scheme;
  seed?: string;
  children: ReactNode;
}

export function OxyProvider({
  locale,
  scheme = "light",
  seed = seeds[0].value,
  children,
}: OxyProviderProps) {
  const theme = useMemo(
    () => (seed.toLowerCase() === seeds[0].value ? baseThemes[scheme] : seedTheme(seed, scheme)),
    [seed, scheme],
  );
  const style: CSSProperties = { ...theme.vars, colorScheme: scheme, display: "contents" };
  return (
    <I18nProvider locale={locale}>
      <div data-scheme={scheme} style={style}>
        {children}
      </div>
    </I18nProvider>
  );
}
