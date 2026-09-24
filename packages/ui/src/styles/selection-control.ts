import { focusRing as focusRingToken } from "@oxy/tokens/component.stylex";
import { color, state, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

export const selectionControl = stylex.create({
  root: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    verticalAlign: "top",
    color: color["--oxy-color-on-surface"],
    cursor: "pointer",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    fontFamily: typography["--oxy-typography-body-large-family"],
    fontSize: typography["--oxy-typography-body-large-size"],
    lineHeight: typography["--oxy-typography-body-large-line-height"],
    fontWeight: typography["--oxy-typography-body-large-weight"],
    letterSpacing: typography["--oxy-typography-body-large-tracking"],
  },
  disabled: {
    color: disabledContent,
    cursor: "default",
  },
  control: {
    position: "relative",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    outlineStyle: "none",
    outlineWidth: focusRingToken["--oxy-focus-ring-width"],
    outlineOffset: `calc(-1 * ${focusRingToken["--oxy-focus-ring-width"]})`,
    outlineColor: focusRingToken["--oxy-focus-ring-color"],
  },
  focusVisible: {
    outlineStyle: "solid",
  },
});
