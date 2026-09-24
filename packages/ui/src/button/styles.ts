import { duration, easing } from "@oxy/motion/motion.stylex";
import { button } from "@oxy/tokens/component.stylex";
import { color, elevation, state, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { densities } from "../styles/density.ts";
import { focusRing, type InteractionState } from "../styles/interaction.ts";
import { tones } from "../styles/tone.ts";
import { density, tone } from "../styles/vars.stylex.ts";
import { buttonSize } from "./button.stylex.ts";
import type { Orientation } from "./connected.ts";

export const buttonVariants = defineVariants(
  {
    variant: ["filled", "tonal", "outlined", "text", "elevated"],
    size: ["xs", "sm", "md", "lg", "xl"],
    tone: ["primary", "secondary", "tertiary", "error"],
    shape: ["round", "square"],
    density: ["comfortable", "compact", "dense"],
  },
  { variant: "filled", size: "sm", tone: "primary", shape: "round", density: "comfortable" },
);

export type ButtonVariants = VariantSelection<typeof buttonVariants.groups>;

export interface ButtonStyleState extends InteractionState {
  isSelected?: boolean;
}

const pressed = ":is([data-pressed])";
const expanded = ':is([aria-expanded="true"])';
const notFirst = ":not(:first-child)";
const notLast = ":not(:last-child)";
const blockSize = `calc(${buttonSize.height} - ${density.offset})`;
const fullRadius = `calc(${blockSize} / 2)`;
const disabledContainer = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-container"]} * 100%), transparent)`;
const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

export const buttonReset = stylex.create({
  root: {
    appearance: "none",
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
  },
});

const styles = stylex.create({
  root: {
    appearance: "none",
    position: "relative",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: buttonSize.gap,
    blockSize,
    margin: 0,
    paddingBlock: 0,
    paddingInline: buttonSize.paddingInline,
    borderStyle: "solid",
    borderWidth: buttonSize.outlineWidth,
    borderColor: "transparent",
    borderRadius: { default: buttonSize.radius, [pressed]: buttonSize.pressedRadius },
    backgroundColor: "transparent",
    whiteSpace: "nowrap",
    textDecoration: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    transitionProperty: "border-radius, background-color, color, border-color, box-shadow",
    transitionDuration: `${duration.spatialFast}, ${duration.effectsDefault}, ${duration.effectsDefault}, ${duration.effectsDefault}, ${duration.effectsDefault}`,
    transitionTimingFunction: `${easing.spatialFast}, ${easing.effectsDefault}, ${easing.effectsDefault}, ${easing.effectsDefault}, ${easing.effectsDefault}`,
  },
  filled: {
    backgroundColor: tone.color,
    color: tone.onColor,
  },
  tonal: {
    backgroundColor: tone.container,
    color: tone.onContainer,
  },
  outlined: {
    color: tone.color,
    borderColor: color["--oxy-color-outline-variant"],
  },
  text: {
    color: tone.color,
  },
  elevated: {
    backgroundColor: color["--oxy-color-surface-container-low"],
    color: tone.color,
    boxShadow: elevation["--oxy-elevation-level1"],
  },
  elevatedHovered: {
    boxShadow: elevation["--oxy-elevation-level2"],
  },
  xs: {
    [buttonSize.height]: button["--oxy-button-xs-height"],
    [buttonSize.paddingInline]: button["--oxy-button-xs-padding-inline"],
    [buttonSize.gap]: button["--oxy-button-xs-gap"],
    [buttonSize.squareRadius]: button["--oxy-button-xs-square-radius"],
    [buttonSize.pressedRadius]: button["--oxy-button-xs-pressed-radius"],
    [buttonSize.innerRadius]: button["--oxy-button-xs-inner-radius"],
    [buttonSize.outlineWidth]: button["--oxy-button-xs-outline-width"],
    "--oxy-icon-size": button["--oxy-button-xs-icon-size"],
    fontFamily: typography["--oxy-typography-label-large-family"],
    fontSize: typography["--oxy-typography-label-large-size"],
    lineHeight: typography["--oxy-typography-label-large-line-height"],
    fontWeight: typography["--oxy-typography-label-large-weight"],
    letterSpacing: typography["--oxy-typography-label-large-tracking"],
  },
  sm: {
    [buttonSize.height]: button["--oxy-button-sm-height"],
    [buttonSize.paddingInline]: button["--oxy-button-sm-padding-inline"],
    [buttonSize.gap]: button["--oxy-button-sm-gap"],
    [buttonSize.squareRadius]: button["--oxy-button-sm-square-radius"],
    [buttonSize.pressedRadius]: button["--oxy-button-sm-pressed-radius"],
    [buttonSize.innerRadius]: button["--oxy-button-sm-inner-radius"],
    [buttonSize.outlineWidth]: button["--oxy-button-sm-outline-width"],
    "--oxy-icon-size": button["--oxy-button-sm-icon-size"],
    fontFamily: typography["--oxy-typography-label-large-family"],
    fontSize: typography["--oxy-typography-label-large-size"],
    lineHeight: typography["--oxy-typography-label-large-line-height"],
    fontWeight: typography["--oxy-typography-label-large-weight"],
    letterSpacing: typography["--oxy-typography-label-large-tracking"],
  },
  md: {
    [buttonSize.height]: button["--oxy-button-md-height"],
    [buttonSize.paddingInline]: button["--oxy-button-md-padding-inline"],
    [buttonSize.gap]: button["--oxy-button-md-gap"],
    [buttonSize.squareRadius]: button["--oxy-button-md-square-radius"],
    [buttonSize.pressedRadius]: button["--oxy-button-md-pressed-radius"],
    [buttonSize.innerRadius]: button["--oxy-button-md-inner-radius"],
    [buttonSize.outlineWidth]: button["--oxy-button-md-outline-width"],
    "--oxy-icon-size": button["--oxy-button-md-icon-size"],
    fontFamily: typography["--oxy-typography-title-medium-family"],
    fontSize: typography["--oxy-typography-title-medium-size"],
    lineHeight: typography["--oxy-typography-title-medium-line-height"],
    fontWeight: typography["--oxy-typography-title-medium-weight"],
    letterSpacing: typography["--oxy-typography-title-medium-tracking"],
  },
  lg: {
    [buttonSize.height]: button["--oxy-button-lg-height"],
    [buttonSize.paddingInline]: button["--oxy-button-lg-padding-inline"],
    [buttonSize.gap]: button["--oxy-button-lg-gap"],
    [buttonSize.squareRadius]: button["--oxy-button-lg-square-radius"],
    [buttonSize.pressedRadius]: button["--oxy-button-lg-pressed-radius"],
    [buttonSize.innerRadius]: button["--oxy-button-lg-inner-radius"],
    [buttonSize.outlineWidth]: button["--oxy-button-lg-outline-width"],
    "--oxy-icon-size": button["--oxy-button-lg-icon-size"],
    fontFamily: typography["--oxy-typography-headline-small-family"],
    fontSize: typography["--oxy-typography-headline-small-size"],
    lineHeight: typography["--oxy-typography-headline-small-line-height"],
    fontWeight: typography["--oxy-typography-headline-small-weight"],
    letterSpacing: typography["--oxy-typography-headline-small-tracking"],
  },
  xl: {
    [buttonSize.height]: button["--oxy-button-xl-height"],
    [buttonSize.paddingInline]: button["--oxy-button-xl-padding-inline"],
    [buttonSize.gap]: button["--oxy-button-xl-gap"],
    [buttonSize.squareRadius]: button["--oxy-button-xl-square-radius"],
    [buttonSize.pressedRadius]: button["--oxy-button-xl-pressed-radius"],
    [buttonSize.innerRadius]: button["--oxy-button-xl-inner-radius"],
    [buttonSize.outlineWidth]: button["--oxy-button-xl-outline-width"],
    "--oxy-icon-size": button["--oxy-button-xl-icon-size"],
    fontFamily: typography["--oxy-typography-headline-large-family"],
    fontSize: typography["--oxy-typography-headline-large-size"],
    lineHeight: typography["--oxy-typography-headline-large-line-height"],
    fontWeight: typography["--oxy-typography-headline-large-weight"],
    letterSpacing: typography["--oxy-typography-headline-large-tracking"],
  },
  round: {
    [buttonSize.radius]: fullRadius,
  },
  square: {
    [buttonSize.radius]: buttonSize.squareRadius,
  },
  disabled: {
    color: disabledContent,
    boxShadow: "none",
    cursor: "default",
  },
  disabledContainer: {
    backgroundColor: disabledContainer,
  },
  disabledOutline: {
    borderColor: disabledContainer,
  },
});

const unselected = stylex.create({
  filled: {
    backgroundColor: color["--oxy-color-surface-container"],
    color: color["--oxy-color-on-surface-variant"],
  },
  tonal: {},
  outlined: {
    color: color["--oxy-color-on-surface-variant"],
  },
  text: {
    color: color["--oxy-color-on-surface-variant"],
  },
  elevated: {},
});

const selected = stylex.create({
  filled: {
    backgroundColor: tone.color,
    color: tone.onColor,
  },
  tonal: {
    backgroundColor: tone.color,
    color: tone.onColor,
  },
  outlined: {
    backgroundColor: color["--oxy-color-inverse-surface"],
    color: color["--oxy-color-inverse-on-surface"],
    borderColor: "transparent",
  },
  text: {
    color: tone.color,
  },
  elevated: {
    backgroundColor: tone.color,
    color: tone.onColor,
  },
});

const innerCorner = (edge: string) => ({
  default: null,
  [expanded]: fullRadius,
  [edge]: { default: buttonSize.innerRadius, [expanded]: fullRadius },
});

const connected = stylex.create({
  horizontal: {
    borderStartStartRadius: innerCorner(notFirst),
    borderEndStartRadius: innerCorner(notFirst),
    borderStartEndRadius: innerCorner(notLast),
    borderEndEndRadius: innerCorner(notLast),
  },
  vertical: {
    borderStartStartRadius: innerCorner(notFirst),
    borderStartEndRadius: innerCorner(notFirst),
    borderEndStartRadius: innerCorner(notLast),
    borderEndEndRadius: innerCorner(notLast),
  },
  selected: {
    borderStartStartRadius: fullRadius,
    borderStartEndRadius: fullRadius,
    borderEndStartRadius: fullRadius,
    borderEndEndRadius: fullRadius,
  },
});

const selectedShape = { round: "square", square: "round" } as const;
const containerVariants = new Set(["filled", "tonal", "elevated"]);

export function buttonStyles(
  { variant, size, tone: toneName, shape, density: densityName }: ButtonVariants,
  { isHovered, isDisabled, isSelected }: ButtonStyleState,
  orientation: Orientation | null,
) {
  const isToggle = isSelected !== undefined;
  return [
    styles.root,
    focusRing.root,
    tones[toneName],
    densities[densityName],
    styles[size],
    styles[isSelected && !orientation ? selectedShape[shape] : shape],
    styles[variant],
    isToggle && (isSelected ? selected[variant] : unselected[variant]),
    orientation && connected[orientation],
    orientation && isSelected && connected.selected,
    variant === "elevated" && isHovered && !isDisabled && styles.elevatedHovered,
    isDisabled && styles.disabled,
    isDisabled &&
      (containerVariants.has(variant) || (isSelected && variant === "outlined")) &&
      styles.disabledContainer,
    isDisabled && variant === "outlined" && styles.disabledOutline,
  ];
}
