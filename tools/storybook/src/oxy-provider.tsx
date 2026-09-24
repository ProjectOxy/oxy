import { baselineSeed, type ColorScheme, createMaterialTheme } from "@oxy/material-theme";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { I18nProvider } from "react-aria-components";

export type Scheme = ColorScheme;

export const seeds = [
  { name: "Baseline", value: baselineSeed },
  { name: "Ocean", value: "#0061a4" },
  { name: "Forest", value: "#386a20" },
  { name: "Sunset", value: "#b3261e" },
  { name: "Amber", value: "#7d5700" },
  { name: "Lagoon", value: "#006a6a" },
] as const;

export interface OxyProviderProps {
  locale?: string;
  scheme?: Scheme;
  seed?: string;
  children: ReactNode;
}

export function OxyProvider({
  locale,
  scheme = "light",
  seed = baselineSeed,
  children,
}: OxyProviderProps) {
  const theme = useMemo(() => createMaterialTheme({ seed, scheme }), [seed, scheme]);
  const style: CSSProperties = { ...theme.vars, colorScheme: scheme, display: "contents" };
  return (
    <I18nProvider locale={locale}>
      <div data-scheme={scheme} style={style}>
        {children}
      </div>
    </I18nProvider>
  );
}
