import { color, radius } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  DropIndicator as AriaDropIndicator,
  type DropIndicatorProps as AriaDropIndicatorProps,
  type DropIndicatorRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";

export interface DropIndicatorProps
  extends Omit<AriaDropIndicatorProps, "className">, StyledProps<DropIndicatorRenderProps> {
  ref?: Ref<HTMLElement>;
}

const styles = stylex.create({
  root: {
    blockSize: 2,
    marginBlock: -1,
    borderRadius: radius["--oxy-radius-full"],
    backgroundColor: "transparent",
  },
  target: {
    backgroundColor: color["--oxy-color-primary"],
  },
});

const dropIndicatorVariants = defineVariants({}, {});

export function DropIndicator({ className, classNames, unstyled, ...props }: DropIndicatorProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: dropIndicatorVariants,
      styles: (_, { isDropTarget }: DropIndicatorRenderProps) => [
        styles.root,
        isDropTarget && styles.target,
      ],
      reset: [],
    },
  );

  return <AriaDropIndicator {...props} className={styled.className} />;
}
