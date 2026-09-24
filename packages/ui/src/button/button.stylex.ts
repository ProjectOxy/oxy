import * as stylex from "@stylexjs/stylex";

export const buttonSize = stylex.defineVars({
  height: "var(--oxy-button-sm-height)",
  paddingInline: "var(--oxy-button-sm-padding-inline)",
  gap: "var(--oxy-button-sm-gap)",
  radius: "calc(var(--oxy-button-sm-height) / 2)",
  squareRadius: "var(--oxy-button-sm-square-radius)",
  pressedRadius: "var(--oxy-button-sm-pressed-radius)",
  innerRadius: "var(--oxy-button-sm-inner-radius)",
  outlineWidth: "var(--oxy-button-sm-outline-width)",
});
