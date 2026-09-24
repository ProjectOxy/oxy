import * as stylex from "@stylexjs/stylex";

export const tab = stylex.defineVars({
  flex: "1 1 0%",
  selectedColor: "var(--oxy-color-primary)",
  iconHeight: "var(--oxy-tabs-icon-height)",
  contentDirection: "column",
  contentGap: "var(--oxy-tabs-stacked-gap)",
  contentPosition: "relative",
  indicatorThickness: "var(--oxy-tabs-primary-indicator-thickness)",
  indicatorRadius: "var(--oxy-tabs-primary-indicator-thickness)",
  indicatorMinLength: "var(--oxy-tabs-primary-indicator-min-length)",
});

export const tabPanels = stylex.defineVars({
  direction: "1",
});
