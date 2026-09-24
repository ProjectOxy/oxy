import { duration, easing } from "@oxy/motion/motion.stylex";
import { colorThumb } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type ReactNode, type Ref } from "react";
import {
  ColorThumb as AriaColorThumb,
  composeRenderProps,
  type ColorThumbProps as AriaColorThumbProps,
  type ColorThumbRenderProps,
} from "react-aria-components";
import type { Part } from "../core/parts.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { focusRing, touchTarget } from "../styles/interaction.ts";

export const colorThumbVariants = defineVariants({}, {});

export interface ColorThumbProps
  extends Omit<AriaColorThumbProps, "className">, StyledProps<ColorThumbRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export const ColorThumbPartContext = createContext<Part | undefined>(undefined);

const spatial = `${duration.spatialFast} ${easing.spatialFast}`;

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    inlineSize: colorThumb["--oxy-color-thumb-size"],
    blockSize: colorThumb["--oxy-color-thumb-size"],
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: colorThumb["--oxy-color-thumb-border-width"],
    borderColor: colorThumb["--oxy-color-thumb-border-color"],
    boxShadow: colorThumb["--oxy-color-thumb-elevation"],
    cursor: "grab",
    transition: `inline-size ${spatial}, block-size ${spatial}`,
  },
  dragging: {
    inlineSize: colorThumb["--oxy-color-thumb-dragging-size"],
    blockSize: colorThumb["--oxy-color-thumb-dragging-size"],
    cursor: "grabbing",
  },
  disabled: {
    boxShadow: "none",
    cursor: "default",
  },
});

export function ColorThumb({ className, unstyled, children, ...props }: ColorThumbProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: colorThumbVariants,
      styles: (_, { isDragging, isDisabled }) => [
        styles.root,
        focusRing.root,
        isDragging && styles.dragging,
        isDisabled && styles.disabled,
      ],
      reset: [],
      part: useContext(ColorThumbPartContext),
    },
  );

  return (
    <AriaColorThumb {...props} className={styled.className}>
      {composeRenderProps(children, (children: ReactNode) =>
        styled.isUnstyled ? (
          children
        ) : (
          <>
            <span data-slot="touch-target" {...stylex.props(touchTarget.root)} />
            {children}
          </>
        ),
      )}
    </AriaColorThumb>
  );
}
