import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import { Text as AriaText, type TextProps as AriaTextProps } from "react-aria-components";
import { useStyled } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { useFieldParts, type FieldPartName } from "../field/parts.ts";

export const textVariants = defineVariants({}, {});

export interface TextProps extends AriaTextProps {
  unstyled?: boolean;
  ref?: Ref<HTMLElement>;
}

const partOfSlot: Partial<Record<string, FieldPartName>> = {
  description: "description",
  errorMessage: "fieldError",
};

const styles = stylex.create({
  root: {
    color: color["--oxy-color-on-surface-variant"],
    fontFamily: typography["--oxy-typography-body-medium-family"],
    fontSize: typography["--oxy-typography-body-medium-size"],
    lineHeight: typography["--oxy-typography-body-medium-line-height"],
    fontWeight: typography["--oxy-typography-body-medium-weight"],
    letterSpacing: typography["--oxy-typography-body-medium-tracking"],
  },
});

export function Text({ className, unstyled, ...props }: TextProps) {
  const parts = useFieldParts();
  const partName = props.slot ? partOfSlot[props.slot] : undefined;
  const styled = useStyled(
    { className, unstyled },
    {
      variants: textVariants,
      styles: () => styles.root,
      reset: [],
      part: partName && parts[partName],
    },
  );
  return <AriaText {...props} className={styled.className({ defaultClassName: undefined })} />;
}
