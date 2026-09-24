import { createContext, useContext, useMemo } from "react";
import { useLocale } from "react-aria-components";
import { createFormatter, defaultStrings, type Strings } from "./strings.ts";

export interface OxyContextValue {
  unstyled: boolean;
  strings: Strings;
}

export const OxyContext = createContext<OxyContextValue>({
  unstyled: false,
  strings: defaultStrings,
});

export function useUnstyled(unstyled?: boolean) {
  const context = useContext(OxyContext);
  return unstyled ?? context.unstyled;
}

export function useStrings() {
  const { locale } = useLocale();
  const { strings } = useContext(OxyContext);
  return useMemo(() => createFormatter(strings, locale), [strings, locale]);
}
