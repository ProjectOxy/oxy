import { popover } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  OverlayArrow as AriaOverlayArrow,
  type OverlayArrowProps as AriaOverlayArrowProps,
  type OverlayArrowRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";

export const overlayArrowVariants = defineVariants({}, {});

export type OverlayArrowSlot = "arrow";

export interface OverlayArrowProps
  extends
    Omit<AriaOverlayArrowProps, "className">,
    StyledProps<OverlayArrowRenderProps, OverlayArrowSlot> {
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  root: {
    display: "flex",
  },
  arrow: {
    display: "block",
    inlineSize: popover["--oxy-popover-arrow-width"],
    blockSize: popover["--oxy-popover-arrow-height"],
    fill: `var(--oxy-overlay-arrow-fill, ${popover["--oxy-popover-container-color"]})`,
  },
});

const rotations = stylex.create({
  top: {},
  bottom: { rotate: "180deg" },
  left: { rotate: "-90deg" },
  right: { rotate: "90deg" },
  center: {},
});

export function OverlayArrow({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: OverlayArrowProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: overlayArrowVariants, styles: () => styles.root, reset: [] },
  );

  return (
    <AriaOverlayArrow {...props} className={styled.className}>
      {children ??
        ((state) => (
          <svg
            aria-hidden
            data-slot="arrow"
            viewBox="0 0 12 6"
            className={styled.slot("arrow", state, [
              styles.arrow,
              state.placement && rotations[state.placement],
            ])}
          >
            <path d="M0 0 6 6 12 0z" />
          </svg>
        ))}
    </AriaOverlayArrow>
  );
}
