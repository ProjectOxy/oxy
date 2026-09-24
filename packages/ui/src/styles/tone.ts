import { color } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { tone } from "./vars.stylex.ts";

export const tones = stylex.create({
  primary: {
    [tone.color]: color["--oxy-color-primary"],
    [tone.onColor]: color["--oxy-color-on-primary"],
    [tone.container]: color["--oxy-color-primary-container"],
    [tone.onContainer]: color["--oxy-color-on-primary-container"],
  },
  secondary: {
    [tone.color]: color["--oxy-color-secondary"],
    [tone.onColor]: color["--oxy-color-on-secondary"],
    [tone.container]: color["--oxy-color-secondary-container"],
    [tone.onContainer]: color["--oxy-color-on-secondary-container"],
  },
  tertiary: {
    [tone.color]: color["--oxy-color-tertiary"],
    [tone.onColor]: color["--oxy-color-on-tertiary"],
    [tone.container]: color["--oxy-color-tertiary-container"],
    [tone.onContainer]: color["--oxy-color-on-tertiary-container"],
  },
  error: {
    [tone.color]: color["--oxy-color-error"],
    [tone.onColor]: color["--oxy-color-on-error"],
    [tone.container]: color["--oxy-color-error-container"],
    [tone.onContainer]: color["--oxy-color-on-error-container"],
  },
});
