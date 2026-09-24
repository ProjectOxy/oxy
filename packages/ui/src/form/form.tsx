import { space } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import { Form as AriaForm, type FormProps as AriaFormProps } from "react-aria-components";
import { useStyled } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";

export const formVariants = defineVariants(
  { density: ["comfortable", "compact", "dense"] },
  { density: "comfortable" },
);

export interface FormProps extends AriaFormProps {
  unstyled?: boolean;
  ref?: Ref<HTMLFormElement>;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  comfortable: { gap: space["--oxy-space-lg"] },
  compact: { gap: space["--oxy-space-md"] },
  dense: { gap: space["--oxy-space-sm"] },
});

export function Form({ className, unstyled, ...props }: FormProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: formVariants,
      styles: ({ density }) => [styles.root, styles[density]],
      reset: [],
    },
  );
  return <AriaForm {...props} className={styled.className({ defaultClassName: undefined })} />;
}
