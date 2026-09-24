import * as stylex from "@stylexjs/stylex";

export const fieldMarker = stylex.defineMarker();

export const field = stylex.defineVars({
  height: "56px",
  paddingInline: "16px",
  startRadius: "0px",
  endRadius: "0px",
  containerColor: "transparent",
  containerShadow: "none",
  indicator: "currentColor",
  indicatorWidth: "1px",
  hoverOpacity: "0",
  labelColor: "inherit",
  labelBackground: "transparent",
  labelFloatCenter: "0px",
  labelOffset: "0px",
  labelShift: "0px",
  contentColor: "inherit",
  supportingColor: "inherit",
});
