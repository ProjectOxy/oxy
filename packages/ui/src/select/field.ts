import { duration, easing } from "@oxy/motion/motion.stylex";
import { dropdown } from "@oxy/tokens/component.stylex";
import { color, state, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { densities } from "../styles/density.ts";
import { tones } from "../styles/tone.ts";
import { density, tone } from "../styles/vars.stylex.ts";
import { field } from "./field.stylex.ts";

export const fieldVariantGroups = {
  variant: ["filled", "outlined"],
  tone: ["primary", "secondary", "tertiary", "error"],
  density: ["comfortable", "compact", "dense"],
} as const;

export const fieldVariantDefaults = {
  variant: "filled",
  tone: "primary",
  density: "comfortable",
} as const;

type Group = typeof fieldVariantGroups;

export interface FieldVariants {
  variant: Group["variant"][number];
  tone: Group["tone"][number];
  density: Group["density"][number];
}

export const dropdownOffset = 4;

export interface FieldState {
  hasLabel: boolean;
  isFocused: boolean;
  isInvalid: boolean;
  isDisabled: boolean;
}

const onSurface = color["--oxy-color-on-surface"];
const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;
const mixOnSurface = (amount: string) =>
  `color-mix(in srgb, ${onSurface} calc(${amount} * 100%), transparent)`;
const hoverLayer = mixOnSurface(field.hoverOpacity);
const smallLineHeight = typography["--oxy-typography-body-small-line-height"];

const root = stylex.create({
  base: {
    position: "relative",
    boxSizing: "border-box",
    display: "inline-flex",
    flexDirection: "column",
    verticalAlign: "top",
    inlineSize: dropdown["--oxy-dropdown-width"],
    maxInlineSize: "100%",
    minInlineSize: 0,
    [field.height]: `calc(${dropdown["--oxy-dropdown-height"]} - ${density.offset})`,
    [field.content]: onSurface,
    [field.supporting]: color["--oxy-color-on-surface-variant"],
    [field.labelColor]: { default: color["--oxy-color-on-surface-variant"], ":hover": onSurface },
    [field.indicatorWidth]: dropdown["--oxy-dropdown-indicator-width"],
    [field.hoverOpacity]: { default: "0", ":hover": state["--oxy-state-hover"] },
  },
  filled: {
    [field.startRadius]: dropdown["--oxy-dropdown-radius"],
    [field.container]: dropdown["--oxy-dropdown-container-color"],
    [field.indicator]: { default: color["--oxy-color-on-surface-variant"], ":hover": onSurface },
    [field.outline]: `inset 0 calc(-1 * ${field.indicatorWidth}) 0 0 ${field.indicator}`,
    [field.labelFloatCenter]: `calc(${dropdown["--oxy-dropdown-label-inset"]} - ${density.offset} / 2 + ${smallLineHeight} / 2)`,
  },
  filledLabelled: {
    [field.contentShift]: `calc(${smallLineHeight} / 2)`,
  },
  outlined: {
    [field.startRadius]: dropdown["--oxy-dropdown-radius"],
    [field.endRadius]: dropdown["--oxy-dropdown-radius"],
    [field.indicator]: { default: color["--oxy-color-outline"], ":hover": onSurface },
    [field.outline]: `inset 0 0 0 ${field.indicatorWidth} ${field.indicator}`,
    [field.labelBackground]: color["--oxy-color-surface"],
  },
  invalid: {
    [tone.color]: color["--oxy-color-error"],
    [field.indicator]: {
      default: color["--oxy-color-error"],
      ":hover": color["--oxy-color-on-error-container"],
    },
    [field.labelColor]: {
      default: color["--oxy-color-error"],
      ":hover": color["--oxy-color-on-error-container"],
    },
    [field.supporting]: color["--oxy-color-error"],
  },
  focused: {
    [field.indicatorWidth]: dropdown["--oxy-dropdown-focus-indicator-width"],
    [field.indicator]: tone.color,
    [field.labelColor]: tone.color,
  },
  disabled: {
    [field.indicator]: disabledContent,
    [field.labelColor]: disabledContent,
    [field.content]: disabledContent,
    [field.supporting]: disabledContent,
    [field.hoverOpacity]: "0",
  },
  disabledFilled: {
    [field.container]: mixOnSurface("0.04"),
  },
  disabledOutlined: {
    [field.indicator]: mixOnSurface(state["--oxy-state-disabled-container"]),
  },
});

export function fieldStyles(
  { variant, tone: toneName, density: densityName }: FieldVariants,
  { hasLabel, isFocused, isInvalid, isDisabled }: FieldState,
) {
  return [
    root.base,
    tones[toneName],
    densities[densityName],
    root[variant],
    hasLabel && variant === "filled" && root.filledLabelled,
    isInvalid && root.invalid,
    isFocused && !isDisabled && root.focused,
    isDisabled && root.disabled,
    isDisabled && (variant === "filled" ? root.disabledFilled : root.disabledOutlined),
  ];
}

export const fieldParts = stylex.create({
  label: {
    position: "absolute",
    zIndex: 1,
    insetInlineStart: `calc(${dropdown["--oxy-dropdown-padding-inline"]} - 4px)`,
    insetBlockStart: `calc(${field.height} / 2)`,
    translate: "0 -50%",
    boxSizing: "border-box",
    maxInlineSize: `calc(100% - 2 * ${dropdown["--oxy-dropdown-padding-inline"]} - ${dropdown["--oxy-dropdown-icon-size"]})`,
    paddingInline: 4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    color: field.labelColor,
    transitionProperty: "inset-block-start, font-size, line-height, color",
    transitionDuration: `${duration.spatialFast}, ${duration.spatialFast}, ${duration.spatialFast}, ${duration.effectsFast}`,
    transitionTimingFunction: `${easing.spatialFast}, ${easing.spatialFast}, ${easing.spatialFast}, ${easing.effectsFast}`,
  },
  labelFloated: {
    insetBlockStart: field.labelFloatCenter,
    backgroundColor: field.labelBackground,
    fontSize: typography["--oxy-typography-body-small-size"],
    lineHeight: smallLineHeight,
    letterSpacing: typography["--oxy-typography-body-small-tracking"],
  },
  container: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: dropdown["--oxy-dropdown-gap"],
    inlineSize: "100%",
    minBlockSize: field.height,
    margin: 0,
    paddingBlock: 0,
    paddingInline: dropdown["--oxy-dropdown-padding-inline"],
    borderStyle: "none",
    borderStartStartRadius: field.startRadius,
    borderStartEndRadius: field.startRadius,
    borderEndStartRadius: field.endRadius,
    borderEndEndRadius: field.endRadius,
    backgroundColor: field.container,
    backgroundImage: `linear-gradient(${hoverLayer}, ${hoverLayer})`,
    boxShadow: field.outline,
    color: field.content,
    outlineStyle: "none",
    "--oxy-icon-size": dropdown["--oxy-dropdown-icon-size"],
    transitionProperty: "background-color, box-shadow",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  trigger: {
    appearance: "none",
    textAlign: "start",
    fontFamily: "inherit",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
  },
  triggerDisabled: {
    cursor: "default",
  },
  value: {
    flexGrow: 1,
    minInlineSize: 0,
    paddingBlockStart: `calc(2 * ${field.contentShift})`,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: field.content,
    transitionProperty: "opacity",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  placeholder: {
    color: color["--oxy-color-on-surface-variant"],
  },
  input: {
    appearance: "none",
    flexGrow: 1,
    minInlineSize: 0,
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    paddingBlockStart: `calc(2 * ${field.contentShift})`,
    borderWidth: 0,
    outlineStyle: "none",
    backgroundColor: "transparent",
    color: field.content,
    caretColor: tone.color,
    "::placeholder": { color: color["--oxy-color-on-surface-variant"], opacity: 1 },
  },
  inputResting: {
    "::placeholder": { color: color["--oxy-color-on-surface-variant"], opacity: 0 },
  },
  resting: {
    opacity: 0,
  },
  indicator: {
    appearance: "none",
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: color["--oxy-color-on-surface-variant"],
    cursor: "inherit",
    rotate: "0deg",
    transitionProperty: "rotate",
    transitionDuration: duration.spatialFast,
    transitionTimingFunction: easing.spatialFast,
  },
  indicatorOpen: {
    rotate: "180deg",
  },
  indicatorInvalid: {
    color: color["--oxy-color-error"],
  },
  indicatorDisabled: {
    color: disabledContent,
  },
  supporting: {
    display: "block",
    paddingInline: dropdown["--oxy-dropdown-padding-inline"],
    marginBlockStart: dropdown["--oxy-dropdown-supporting-gap"],
    color: field.supporting,
  },
  error: {
    color: color["--oxy-color-error"],
  },
  popover: {
    inlineSize: "var(--trigger-width)",
  },
});
