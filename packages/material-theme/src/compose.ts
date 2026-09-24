import { springVars } from "@oxy/motion";
import {
  createTheme,
  defaultTheme,
  semanticTokens,
  type Theme,
  type ThemeOverrides,
} from "@oxy/tokens";

export function composeTheme(...layers: ThemeOverrides[]): Theme {
  const theme = [semanticTokens, ...layers].reduce<Theme>(
    (base, overrides) => createTheme(overrides, base),
    defaultTheme,
  );
  return { ...theme, vars: { ...theme.vars, ...springVars(theme.tokens.motion.spring) } };
}
