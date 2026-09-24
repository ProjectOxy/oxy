import { duration, easing } from "@oxy/motion/motion.stylex";
import { focusRing as focusRingToken } from "@oxy/tokens/component.stylex";
import { state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { density } from "./vars.stylex.ts";

const focusVisible = ":is([data-focus-visible])";
const touchTargetInset = `min(0px, (100% - ${density.touchTarget}) / 2)`;

export const focusRing = stylex.create({
  root: {
    outlineStyle: { default: "none", [focusVisible]: "solid" },
    outlineWidth: focusRingToken["--oxy-focus-ring-width"],
    outlineOffset: focusRingToken["--oxy-focus-ring-offset"],
    outlineColor: focusRingToken["--oxy-focus-ring-color"],
  },
});

export const touchTarget = stylex.create({
  root: {
    position: "absolute",
    insetBlock: touchTargetInset,
    insetInline: touchTargetInset,
  },
});

export const stateLayer = stylex.create({
  root: {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    backgroundColor: "currentColor",
    opacity: 0,
    pointerEvents: "none",
    transitionProperty: "opacity",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  hovered: { opacity: state["--oxy-state-hover"] },
  focused: { opacity: state["--oxy-state-focus"] },
  pressed: { opacity: state["--oxy-state-pressed"] },
});

export interface InteractionState {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
  isDisabled: boolean;
}

export const stateLayerStyles = ({
  isHovered,
  isPressed,
  isFocusVisible,
  isDisabled,
}: InteractionState) => [
  stateLayer.root,
  !isDisabled &&
    ((isPressed && stateLayer.pressed) ||
      (isFocusVisible && stateLayer.focused) ||
      (isHovered && stateLayer.hovered)),
];
