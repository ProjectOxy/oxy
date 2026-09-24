import {
  colorSchemes,
  contrasts,
  createMaterialTheme,
  createNeutralTheme,
} from "@oxy/material-theme";
import { defaultTheme, WCAG_AA, type Theme } from "@oxy/tokens";

const themes: Record<string, Theme> = { default: defaultTheme };
for (const scheme of colorSchemes) {
  for (const contrast of contrasts) {
    themes[`material-${scheme}-${contrast}`] = createMaterialTheme({ scheme, contrast });
    themes[`neutral-${scheme}-${contrast}`] = createNeutralTheme({ scheme, contrast });
  }
}

export default { minimumRatio: WCAG_AA, themes };
