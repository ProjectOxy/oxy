import { duration, easing } from "@oxy/motion/motion.stylex";
import { dropZone } from "@oxy/tokens/component.stylex";
import { color, space, state, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  DropZone as AriaDropZone,
  type DropZoneProps as AriaDropZoneProps,
  type DropZoneRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { focusRing } from "../styles/interaction.ts";
import { tones } from "../styles/tone.ts";
import { tone } from "../styles/vars.stylex.ts";

export const dropZoneVariants = defineVariants(
  {
    variant: ["outlined", "filled"],
    tone: ["primary", "secondary", "tertiary", "error"],
  },
  { variant: "outlined", tone: "primary" },
);

export type DropZoneVariants = VariantSelection<typeof dropZoneVariants.groups>;

export interface DropZoneProps
  extends Omit<AriaDropZoneProps, "className">, StyledProps<DropZoneRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const onSurface = color["--oxy-color-on-surface"];
const disabledContent = `color-mix(in srgb, ${onSurface} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;
const disabledContainer = `color-mix(in srgb, ${onSurface} calc(${state["--oxy-state-disabled-container"]} * 100%), transparent)`;
const hoverLayer = `color-mix(in srgb, ${onSurface} calc(${state["--oxy-state-hover"]} * 100%), transparent)`;

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: space["--oxy-space-sm"],
    boxSizing: "border-box",
    padding: dropZone["--oxy-drop-zone-padding"],
    borderRadius: dropZone["--oxy-drop-zone-radius"],
    borderStyle: "dashed",
    borderWidth: dropZone["--oxy-drop-zone-outline-width"],
    borderColor: color["--oxy-color-outline"],
    backgroundColor: "transparent",
    color: color["--oxy-color-on-surface-variant"],
    textAlign: "center",
    fontFamily: typography["--oxy-typography-body-large-family"],
    fontSize: typography["--oxy-typography-body-large-size"],
    lineHeight: typography["--oxy-typography-body-large-line-height"],
    fontWeight: typography["--oxy-typography-body-large-weight"],
    letterSpacing: typography["--oxy-typography-body-large-tracking"],
    transition: `background-color ${duration.effectsFast} ${easing.effectsFast}, border-color ${duration.effectsFast} ${easing.effectsFast}`,
  },
  filled: {
    borderColor: "transparent",
    backgroundColor: color["--oxy-color-surface-container-highest"],
  },
  hovered: {
    backgroundImage: `linear-gradient(${hoverLayer}, ${hoverLayer})`,
  },
  dropTarget: {
    borderStyle: "solid",
    borderColor: tone.color,
    backgroundColor: tone.container,
    color: tone.onContainer,
  },
  disabled: {
    borderColor: disabledContainer,
    color: disabledContent,
  },
});

function dropZoneStyles(
  { variant, tone: toneName }: DropZoneVariants,
  { isHovered, isDropTarget, isDisabled }: DropZoneRenderProps,
) {
  return [
    styles.root,
    focusRing.root,
    tones[toneName],
    variant === "filled" && styles.filled,
    isHovered && !isDisabled && styles.hovered,
    isDropTarget && styles.dropTarget,
    isDisabled && styles.disabled,
  ];
}

export function DropZone({ className, unstyled, ...props }: DropZoneProps) {
  const styled = useStyled(
    { className, unstyled },
    { variants: dropZoneVariants, styles: dropZoneStyles, reset: [] },
  );
  return <AriaDropZone {...props} className={styled.className} />;
}
