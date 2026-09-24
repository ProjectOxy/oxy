import * as stylex from "@stylexjs/stylex";

export const tone = stylex.defineVars({
  color: "var(--oxy-color-primary)",
  onColor: "var(--oxy-color-on-primary)",
  container: "var(--oxy-color-primary-container)",
  onContainer: "var(--oxy-color-on-primary-container)",
});

export const density = stylex.defineVars({
  offset: "0px",
  touchTarget: "var(--oxy-touch-target-size)",
});
