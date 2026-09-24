import { duration, easing } from "@oxy/motion/motion.stylex";
import { fab } from "@oxy/tokens/component.stylex";
import { color, state, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { focusRing, type InteractionState } from "../styles/interaction.ts";
import { tones } from "../styles/tone.ts";
import { tone } from "../styles/vars.stylex.ts";
import { fabSize } from "./fab.stylex.ts";

export const fabVariants = defineVariants(
  {
    variant: ["tonal", "filled"],
    size: ["sm", "md", "lg"],
    tone: ["primary", "secondary", "tertiary", "error"],
  },
  { variant: "tonal", size: "sm", tone: "primary" },
);

export type FabVariants = VariantSelection<typeof fabVariants.groups>;

const expanded = ':is([aria-expanded="true"])';
const disabledContainer = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-container"]} * 100%), transparent)`;
const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

export const fabReset = stylex.create({
  root: {
    appearance: "none",
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "inherit",
    font: "inherit",
  },
});

const styles = stylex.create({
  root: {
    appearance: "none",
    position: "relative",
    boxSizing: "border-box",
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    blockSize: fabSize.height,
    minInlineSize: fabSize.height,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: { default: fabSize.radius, [expanded]: `calc(${fabSize.height} / 2)` },
    boxShadow: fab["--oxy-fab-elevation"],
    whiteSpace: "nowrap",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    "--oxy-icon-size": fabSize.iconSize,
    transitionProperty: "border-radius, padding, background-color, color, box-shadow",
    transitionDuration: `${duration.spatialDefault}, ${duration.spatialDefault}, ${duration.effectsDefault}, ${duration.effectsDefault}, ${duration.effectsDefault}`,
    transitionTimingFunction: `${easing.spatialDefault}, ${easing.spatialDefault}, ${easing.effectsDefault}, ${easing.effectsDefault}, ${easing.effectsDefault}`,
  },
  hovered: {
    boxShadow: fab["--oxy-fab-hovered-elevation"],
  },
  tonal: {
    backgroundColor: { default: tone.container, [expanded]: tone.color },
    color: { default: tone.onContainer, [expanded]: tone.onColor },
  },
  filled: {
    backgroundColor: tone.color,
    color: tone.onColor,
  },
  sm: {
    [fabSize.height]: fab["--oxy-fab-sm-height"],
    [fabSize.iconSize]: fab["--oxy-fab-sm-icon-size"],
    [fabSize.radius]: fab["--oxy-fab-sm-radius"],
    [fabSize.paddingInline]: fab["--oxy-fab-sm-padding-inline"],
    [fabSize.gap]: fab["--oxy-fab-sm-gap"],
    fontFamily: typography["--oxy-typography-title-medium-family"],
    fontSize: typography["--oxy-typography-title-medium-size"],
    lineHeight: typography["--oxy-typography-title-medium-line-height"],
    fontWeight: typography["--oxy-typography-title-medium-weight"],
    letterSpacing: typography["--oxy-typography-title-medium-tracking"],
  },
  md: {
    [fabSize.height]: fab["--oxy-fab-md-height"],
    [fabSize.iconSize]: fab["--oxy-fab-md-icon-size"],
    [fabSize.radius]: fab["--oxy-fab-md-radius"],
    [fabSize.paddingInline]: fab["--oxy-fab-md-padding-inline"],
    [fabSize.gap]: fab["--oxy-fab-md-gap"],
    fontFamily: typography["--oxy-typography-title-large-family"],
    fontSize: typography["--oxy-typography-title-large-size"],
    lineHeight: typography["--oxy-typography-title-large-line-height"],
    fontWeight: typography["--oxy-typography-title-large-weight"],
    letterSpacing: typography["--oxy-typography-title-large-tracking"],
  },
  lg: {
    [fabSize.height]: fab["--oxy-fab-lg-height"],
    [fabSize.iconSize]: fab["--oxy-fab-lg-icon-size"],
    [fabSize.radius]: fab["--oxy-fab-lg-radius"],
    [fabSize.paddingInline]: fab["--oxy-fab-lg-padding-inline"],
    [fabSize.gap]: fab["--oxy-fab-lg-gap"],
    fontFamily: typography["--oxy-typography-headline-small-family"],
    fontSize: typography["--oxy-typography-headline-small-size"],
    lineHeight: typography["--oxy-typography-headline-small-line-height"],
    fontWeight: typography["--oxy-typography-headline-small-weight"],
    letterSpacing: typography["--oxy-typography-headline-small-tracking"],
  },
  disabled: {
    backgroundColor: disabledContainer,
    color: disabledContent,
    boxShadow: "none",
    cursor: "default",
  },
});

export const fabIcon = stylex.create({
  root: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    inlineSize: fabSize.iconSize,
    blockSize: fabSize.iconSize,
  },
});

export function fabStyles(
  { variant, size, tone: toneName }: FabVariants,
  { isHovered, isDisabled }: InteractionState,
) {
  return [
    styles.root,
    focusRing.root,
    tones[toneName],
    styles[size],
    styles[variant],
    isHovered && !isDisabled && styles.hovered,
    isDisabled && styles.disabled,
  ];
}
