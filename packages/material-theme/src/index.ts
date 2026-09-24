import * as stylex from "@stylexjs/stylex";
import { color } from "@oxy/tokens/color.stylex";

export const materialDarkTheme = stylex.createTheme(color, {
  "--oxy-color-primary": "#d0bcff",
  "--oxy-color-on-primary": "#381e72",
  "--oxy-color-primary-container": "#4f378b",
  "--oxy-color-on-primary-container": "#e9ddff",
  "--oxy-color-surface": "#141218",
  "--oxy-color-on-surface": "#e6e0e9",
  "--oxy-color-outline": "#938f99",
});
