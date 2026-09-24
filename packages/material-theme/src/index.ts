import { createTheme } from "@oxy/tokens";
import { palette } from "@oxy/tokens/primitives";

const { primary, neutral } = palette;
const neutralVariant = palette["neutral-variant"];

export const materialDarkTheme = createTheme({
  color: {
    primary: primary[80],
    "on-primary": primary[20],
    "primary-container": primary[30],
    "on-primary-container": primary[90],
    surface: neutral[6],
    "on-surface": neutral[90],
    outline: neutralVariant[60],
  },
});
