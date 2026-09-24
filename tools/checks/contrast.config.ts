import { materialDarkTheme } from "@oxy/material-theme";
import { defaultTheme, WCAG_AA, type Theme } from "@oxy/tokens";

export default {
  minimumRatio: WCAG_AA,
  themes: {
    default: defaultTheme,
    "material-dark": materialDarkTheme,
  } satisfies Record<string, Theme>,
};
