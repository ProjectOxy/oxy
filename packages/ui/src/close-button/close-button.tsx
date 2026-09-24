import { closeButton } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  type ButtonRenderProps,
  composeRenderProps,
} from "react-aria-components";
import { buttonLayers, type ButtonLayerSlot } from "../button/layers.tsx";
import { buttonReset } from "../button/styles.ts";
import { GlyphIcon } from "../collection/glyphs.tsx";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { useStrings } from "../provider/context.ts";
import { focusRing } from "../styles/interaction.ts";

export const closeButtonVariants = defineVariants({}, {});

export type CloseButtonSlot = ButtonLayerSlot;

export interface CloseButtonProps
  extends Omit<AriaButtonProps, "className">, StyledProps<ButtonRenderProps, CloseButtonSlot> {
  ref?: Ref<HTMLButtonElement>;
}

const styles = stylex.create({
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "inline-grid",
    placeItems: "center",
    flexShrink: 0,
    inlineSize: closeButton["--oxy-close-button-size"],
    blockSize: closeButton["--oxy-close-button-size"],
    borderRadius: "50%",
    color: "inherit",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    "--oxy-icon-size": closeButton["--oxy-close-button-icon-size"],
  },
});

export function CloseButton({
  slot = "close",
  className,
  classNames,
  unstyled,
  children,
  ...props
}: CloseButtonProps) {
  const strings = useStrings();
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: closeButtonVariants,
      styles: () => [buttonReset.root, styles.root, focusRing.root],
      reset: [buttonReset.root],
    },
  );

  return (
    <AriaButton aria-label={strings("close")} {...props} slot={slot} className={styled.className}>
      {composeRenderProps(children, (children, state) =>
        buttonLayers(styled.slot, state, children ?? <GlyphIcon glyph="close" />),
      )}
    </AriaButton>
  );
}
