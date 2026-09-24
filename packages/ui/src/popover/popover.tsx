import { presence } from "@oxy/motion";
import { popover } from "@oxy/tokens/component.stylex";
import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  type PopoverRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";

export const popoverVariants = defineVariants({}, {});

export interface PopoverProps
  extends Omit<AriaPopoverProps, "className">, StyledProps<PopoverRenderProps> {
  ref?: Ref<HTMLElement>;
}

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    borderRadius: popover["--oxy-popover-radius"],
    backgroundColor: popover["--oxy-popover-container-color"],
    boxShadow: popover["--oxy-popover-elevation"],
    color: color["--oxy-color-on-surface"],
    outlineStyle: "none",
    transformOrigin: "var(--trigger-anchor-point)",
    "--oxy-overlay-padding": popover["--oxy-popover-padding"],
    "--oxy-overlay-arrow-fill": popover["--oxy-popover-container-color"],
    "--oxy-headline-family": typography["--oxy-typography-title-medium-family"],
    "--oxy-headline-size": typography["--oxy-typography-title-medium-size"],
    "--oxy-headline-line-height": typography["--oxy-typography-title-medium-line-height"],
    "--oxy-headline-weight": typography["--oxy-typography-title-medium-weight"],
    "--oxy-headline-tracking": typography["--oxy-typography-title-medium-tracking"],
  },
});

export function Popover({ className, unstyled, ...props }: PopoverProps) {
  const styled = useStyled(
    { className, unstyled },
    { variants: popoverVariants, styles: () => [styles.root, presence.scale], reset: [] },
  );
  return <AriaPopover {...props} className={styled.className} />;
}
