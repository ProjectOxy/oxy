import type { Theme } from "@oxy/tokens";
import * as stylex from "@stylexjs/stylex";
import { UNSAFE_PortalProvider } from "react-aria/PortalProvider";
import { useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { I18nProvider, useLocale } from "react-aria-components";
import { OxyContext } from "./context.ts";
import { mergeStrings, type Strings } from "./strings.ts";

export type Scheme = "light" | "dark";

export interface OxyProviderProps {
  theme?: Theme;
  scheme?: Scheme;
  locale?: string;
  strings?: Strings;
  unstyled?: boolean;
  children: ReactNode;
}

const styles = stylex.create({
  contents: { display: "contents" },
  light: { colorScheme: "light" },
  dark: { colorScheme: "dark" },
});

export function OxyProvider({
  theme,
  scheme,
  locale,
  strings,
  unstyled,
  children,
}: OxyProviderProps) {
  const parent = useContext(OxyContext);
  const value = useMemo(
    () => ({
      unstyled: unstyled ?? parent.unstyled,
      strings: strings ? mergeStrings(parent.strings, strings) : parent.strings,
    }),
    [parent, unstyled, strings],
  );

  const scope = (
    <OxyContext value={value}>
      <ThemeScope theme={theme} scheme={scheme}>
        {children}
      </ThemeScope>
    </OxyContext>
  );
  return locale ? <I18nProvider locale={locale}>{scope}</I18nProvider> : scope;
}

interface ThemeScopeProps {
  theme?: Theme;
  scheme?: Scheme;
  children: ReactNode;
}

function ThemeScope({ theme, scheme, children }: ThemeScopeProps) {
  const { locale, direction } = useLocale();
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const getContainer = useCallback(() => portalHost, [portalHost]);

  return (
    <div
      data-oxy-scope=""
      data-scheme={scheme}
      lang={locale}
      dir={direction}
      {...stylex.props(styles.contents, scheme && styles[scheme])}
      style={{ ...theme?.vars }}
    >
      <UNSAFE_PortalProvider getContainer={getContainer}>{children}</UNSAFE_PortalProvider>
      <div ref={setPortalHost} data-oxy-portal="" {...stylex.props(styles.contents)} />
    </div>
  );
}
