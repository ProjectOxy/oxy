import { keyboard } from "@oxy/tokens/component.stylex";
import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, Ref } from "react";
import { Keyboard as AriaKeyboard } from "react-aria-components";
import { useStyled } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";

export const keyboardVariants = defineVariants(
  { appearance: ["keycap", "plain"] },
  { appearance: "keycap" },
);

export type KeyboardVariants = VariantSelection<typeof keyboardVariants.groups>;

export interface KeyboardProps extends HTMLAttributes<HTMLElement> {
  unstyled?: boolean;
  ref?: Ref<HTMLElement>;
}

const styles = stylex.create({
  reset: {
    fontFamily: "inherit",
  },
  root: {
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  keycap: {
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minInlineSize: keyboard["--oxy-keyboard-min-size"],
    blockSize: keyboard["--oxy-keyboard-min-size"],
    paddingInline: keyboard["--oxy-keyboard-padding-inline"],
    borderStyle: "solid",
    borderColor: color["--oxy-color-outline-variant"],
    borderWidth: keyboard["--oxy-keyboard-outline-width"],
    borderBlockEndWidth: keyboard["--oxy-keyboard-depth"],
    borderRadius: keyboard["--oxy-keyboard-radius"],
    backgroundColor: color["--oxy-color-surface-container-high"],
    color: color["--oxy-color-on-surface-variant"],
    fontFamily: typography["--oxy-typography-label-medium-family"],
    fontSize: typography["--oxy-typography-label-medium-size"],
    lineHeight: typography["--oxy-typography-label-medium-line-height"],
    fontWeight: typography["--oxy-typography-label-medium-weight"],
    letterSpacing: typography["--oxy-typography-label-medium-tracking"],
  },
  plain: {},
});

export function Keyboard({ className, unstyled, ...props }: KeyboardProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: keyboardVariants,
      styles: ({ appearance }) => [styles.root, styles[appearance]],
      reset: [styles.reset],
    },
  );

  return <AriaKeyboard {...props} className={styled.className({ defaultClassName: undefined })} />;
}
