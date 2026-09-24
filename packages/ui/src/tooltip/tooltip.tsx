import { presence } from "@oxy/motion";
import { tooltip } from "@oxy/tokens/component.stylex";
import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  type TooltipRenderProps,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";

export type TooltipTriggerProps = TooltipTriggerComponentProps;

export function TooltipTrigger(props: TooltipTriggerProps) {
  return <AriaTooltipTrigger {...props} />;
}

export const tooltipVariants = defineVariants({ variant: ["plain", "rich"] }, { variant: "plain" });

export type TooltipVariants = VariantSelection<typeof tooltipVariants.groups>;

export interface TooltipProps
  extends Omit<AriaTooltipProps, "className">, StyledProps<TooltipRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    transformOrigin: "var(--trigger-anchor-point)",
    outlineStyle: "none",
  },
  plain: {
    display: "flex",
    alignItems: "center",
    minBlockSize: tooltip["--oxy-tooltip-plain-min-height"],
    maxInlineSize: tooltip["--oxy-tooltip-plain-max-width"],
    paddingInline: tooltip["--oxy-tooltip-plain-padding-inline"],
    paddingBlock: tooltip["--oxy-tooltip-plain-padding-block"],
    borderRadius: tooltip["--oxy-tooltip-plain-radius"],
    backgroundColor: tooltip["--oxy-tooltip-plain-container-color"],
    color: color["--oxy-color-inverse-on-surface"],
    fontFamily: typography["--oxy-typography-body-small-family"],
    fontSize: typography["--oxy-typography-body-small-size"],
    lineHeight: typography["--oxy-typography-body-small-line-height"],
    fontWeight: typography["--oxy-typography-body-small-weight"],
    letterSpacing: typography["--oxy-typography-body-small-tracking"],
    "--oxy-overlay-arrow-fill": tooltip["--oxy-tooltip-plain-container-color"],
    "--oxy-supporting-color": "currentColor",
  },
  rich: {
    display: "flex",
    flexDirection: "column",
    gap: tooltip["--oxy-tooltip-rich-gap"],
    maxInlineSize: tooltip["--oxy-tooltip-rich-max-width"],
    paddingInline: tooltip["--oxy-tooltip-rich-padding-inline"],
    paddingBlock: tooltip["--oxy-tooltip-rich-padding-block"],
    borderRadius: tooltip["--oxy-tooltip-rich-radius"],
    backgroundColor: tooltip["--oxy-tooltip-rich-container-color"],
    boxShadow: tooltip["--oxy-tooltip-rich-elevation"],
    color: color["--oxy-color-on-surface-variant"],
    fontFamily: typography["--oxy-typography-body-medium-family"],
    fontSize: typography["--oxy-typography-body-medium-size"],
    lineHeight: typography["--oxy-typography-body-medium-line-height"],
    fontWeight: typography["--oxy-typography-body-medium-weight"],
    letterSpacing: typography["--oxy-typography-body-medium-tracking"],
    "--oxy-overlay-arrow-fill": tooltip["--oxy-tooltip-rich-container-color"],
    "--oxy-headline-family": typography["--oxy-typography-title-small-family"],
    "--oxy-headline-size": typography["--oxy-typography-title-small-size"],
    "--oxy-headline-line-height": typography["--oxy-typography-title-small-line-height"],
    "--oxy-headline-weight": typography["--oxy-typography-title-small-weight"],
    "--oxy-headline-tracking": typography["--oxy-typography-title-small-tracking"],
    "--oxy-headline-color": color["--oxy-color-on-surface-variant"],
  },
});

export function Tooltip({ offset = 4, className, unstyled, ...props }: TooltipProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: tooltipVariants,
      styles: ({ variant }: TooltipVariants) => [styles.root, styles[variant], presence.scale],
      reset: [],
    },
  );
  return <AriaTooltip {...props} offset={offset} className={styled.className} />;
}
