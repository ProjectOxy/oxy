import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import { Label as AriaLabel, type LabelProps as AriaLabelProps } from "react-aria-components";
import { useStyled } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { useFieldParts } from "../field/parts.ts";

export const labelVariants = defineVariants({}, {});

export interface LabelProps extends AriaLabelProps {
  unstyled?: boolean;
  ref?: Ref<HTMLLabelElement>;
}

const styles = stylex.create({
  root: {
    color: color["--oxy-color-on-surface-variant"],
    fontFamily: typography["--oxy-typography-label-large-family"],
    fontSize: typography["--oxy-typography-label-large-size"],
    lineHeight: typography["--oxy-typography-label-large-line-height"],
    fontWeight: typography["--oxy-typography-label-large-weight"],
    letterSpacing: typography["--oxy-typography-label-large-tracking"],
  },
});

export function Label({ className, unstyled, ...props }: LabelProps) {
  const styled = useStyled(
    { className, unstyled },
    { variants: labelVariants, styles: () => styles.root, reset: [], part: useFieldParts().label },
  );
  return <AriaLabel {...props} className={styled.className({ defaultClassName: undefined })} />;
}
