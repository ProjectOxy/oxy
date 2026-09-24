import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  FieldError as AriaFieldError,
  type FieldErrorProps as AriaFieldErrorProps,
  type FieldErrorRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { useFieldParts } from "../field/parts.ts";

export const fieldErrorVariants = defineVariants({}, {});

export interface FieldErrorProps
  extends Omit<AriaFieldErrorProps, "className">, StyledProps<FieldErrorRenderProps> {
  ref?: Ref<HTMLElement>;
}

const styles = stylex.create({
  root: {
    color: color["--oxy-color-error"],
    fontFamily: typography["--oxy-typography-body-small-family"],
    fontSize: typography["--oxy-typography-body-small-size"],
    lineHeight: typography["--oxy-typography-body-small-line-height"],
    fontWeight: typography["--oxy-typography-body-small-weight"],
    letterSpacing: typography["--oxy-typography-body-small-tracking"],
  },
});

export function FieldError({ className, unstyled, ...props }: FieldErrorProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: fieldErrorVariants,
      styles: () => styles.root,
      reset: [],
      part: useFieldParts().fieldError,
    },
  );
  return <AriaFieldError {...props} className={styled.className} />;
}
