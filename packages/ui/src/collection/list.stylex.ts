import * as stylex from "@stylexjs/stylex";

export const listItem = stylex.defineVars({
  height: "var(--oxy-list-item-height)",
  paddingInline: "var(--oxy-list-item-padding-inline)",
  gap: "var(--oxy-list-item-gap)",
  iconSize: "var(--oxy-list-item-icon-size)",
  radius: "0px",
  edgeRadius: "0px",
  selectedRadius: "0px",
  container: "transparent",
  selectedContainer: "var(--oxy-color-secondary-container)",
  selectedContent: "var(--oxy-color-on-secondary-container)",
  supporting: "var(--oxy-color-on-surface-variant)",
});
