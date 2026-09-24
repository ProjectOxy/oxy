import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
  type InputRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { useFieldParts } from "../field/parts.ts";
import { mergeParts, standaloneInputStyles } from "../field/text-field-styles.ts";

export const inputVariants = defineVariants({}, {});

export interface InputProps
  extends Omit<AriaInputProps, "className">, StyledProps<InputRenderProps> {
  ref?: Ref<HTMLInputElement>;
}

export const inputReset = stylex.create({
  reset: {
    appearance: "none",
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
  },
});

export function Input({ className, unstyled, ...props }: InputProps) {
  const { input, container } = useFieldParts();
  const styled = useStyled(
    { className, unstyled },
    {
      variants: inputVariants,
      styles: (_, { isDisabled }) => (input ? [] : standaloneInputStyles(isDisabled)),
      reset: [inputReset.reset],
      part: input && mergeParts(input, container),
    },
  );
  return <AriaInput {...props} className={styled.className} />;
}
