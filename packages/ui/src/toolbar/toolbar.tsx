import { toolbar } from "@oxy/tokens/component.stylex";
import { color, space } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Toolbar as AriaToolbar,
  type ToolbarProps as AriaToolbarProps,
  type ToolbarRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";

export const toolbarVariants = defineVariants(
  {
    variant: ["docked", "floating"],
    color: ["standard", "vibrant"],
  },
  { variant: "docked", color: "standard" },
);

export type ToolbarVariants = VariantSelection<typeof toolbarVariants.groups>;

export interface ToolbarProps
  extends Omit<AriaToolbarProps, "className">, StyledProps<ToolbarRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: toolbar["--oxy-toolbar-gap"],
  },
  horizontal: {
    flexDirection: "row",
  },
  vertical: {
    flexDirection: "column",
  },
  dockedHorizontal: {
    inlineSize: "100%",
    minBlockSize: toolbar["--oxy-toolbar-height"],
    paddingInline: space["--oxy-space-lg"],
    justifyContent: "space-around",
  },
  dockedVertical: {
    blockSize: "100%",
    minInlineSize: toolbar["--oxy-toolbar-height"],
    paddingBlock: space["--oxy-space-lg"],
    justifyContent: "space-around",
  },
  floating: {
    display: "inline-flex",
    maxInlineSize: "100%",
    maxBlockSize: "100%",
    padding: toolbar["--oxy-toolbar-padding"],
    borderRadius: toolbar["--oxy-toolbar-floating-radius"],
    boxShadow: toolbar["--oxy-toolbar-floating-elevation"],
    overflow: "auto",
    scrollbarWidth: "none",
  },
  standard: {
    backgroundColor: color["--oxy-color-surface-container"],
    color: color["--oxy-color-on-surface"],
  },
  vibrant: {
    backgroundColor: color["--oxy-color-primary-container"],
    color: color["--oxy-color-on-primary-container"],
  },
});

function toolbarStyles(
  { variant, color: colorName }: ToolbarVariants,
  { orientation }: ToolbarRenderProps,
) {
  return [
    styles.root,
    styles[orientation],
    variant === "floating"
      ? styles.floating
      : orientation === "vertical"
        ? styles.dockedVertical
        : styles.dockedHorizontal,
    styles[colorName],
  ];
}

export function Toolbar({ className, classNames, unstyled, ...props }: ToolbarProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: toolbarVariants, styles: toolbarStyles, reset: [] },
  );

  return <AriaToolbar {...props} className={styled.className} />;
}
