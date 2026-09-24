import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  TextArea as AriaTextArea,
  type InputRenderProps,
  type TextAreaProps as AriaTextAreaProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { field } from "../field/field.stylex.ts";
import { useFieldParts } from "../field/parts.ts";
import { mergeParts, standaloneInputStyles } from "../field/text-field-styles.ts";
import { inputReset } from "../input/input.tsx";

export const textAreaVariants = defineVariants({}, {});

export interface TextAreaProps
  extends Omit<AriaTextAreaProps, "className">, StyledProps<InputRenderProps> {
  ref?: Ref<HTMLTextAreaElement>;
}

const styles = stylex.create({
  root: {
    display: "block",
    minBlockSize: field.height,
    resize: "vertical",
    fieldSizing: "content",
  },
});

export function TextArea({ className, unstyled, ...props }: TextAreaProps) {
  const { input, container } = useFieldParts();
  const styled = useStyled(
    { className, unstyled },
    {
      variants: textAreaVariants,
      styles: (_, { isDisabled }) => [!input && standaloneInputStyles(isDisabled), styles.root],
      reset: [inputReset.reset],
      part: input && mergeParts(input, container),
    },
  );
  return <AriaTextArea {...props} className={styled.className} />;
}
