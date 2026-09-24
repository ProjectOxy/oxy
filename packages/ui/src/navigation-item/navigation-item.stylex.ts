import * as stylex from "@stylexjs/stylex";

export const navigationItem = stylex.defineVars({
  verticalHeight: "var(--oxy-navigation-bar-height)",
  horizontalHeight: "var(--oxy-navigation-item-horizontal-indicator-height)",
  horizontalGap: "var(--oxy-navigation-item-horizontal-gap)",
  horizontalPaddingInlineEnd: "var(--oxy-navigation-item-horizontal-padding-inline)",
});

export const windowSize = stylex.defineConsts({
  medium: "@media (min-width: 600px)",
});
