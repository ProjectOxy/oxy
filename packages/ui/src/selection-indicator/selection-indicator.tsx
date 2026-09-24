import { duration, easing } from "@oxy/motion/motion.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  SelectionIndicator as AriaSelectionIndicator,
  type SelectionIndicatorProps as AriaSelectionIndicatorProps,
  type SharedElementRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";

const selectionIndicatorVariants = defineVariants({}, {});

export interface SelectionIndicatorProps
  extends Omit<AriaSelectionIndicatorProps, "className">, StyledProps<SharedElementRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  root: {
    position: "absolute",
    transitionProperty: "translate, inline-size, block-size",
    transitionDuration: duration.spatialDefault,
    transitionTimingFunction: easing.spatialDefault,
  },
});

export function SelectionIndicator({ className, unstyled, ...props }: SelectionIndicatorProps) {
  const styled = useStyled(
    { className, unstyled },
    { variants: selectionIndicatorVariants, styles: () => [styles.root], reset: [] },
  );

  return <AriaSelectionIndicator {...props} className={styled.className} />;
}
