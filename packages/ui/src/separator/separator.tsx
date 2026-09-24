import { separator } from "@oxy/tokens/component.stylex";
import { color } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";
import type { Orientation } from "../button/connected.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";

export const separatorVariants = defineVariants(
  { inset: ["full-width", "inset", "middle-inset"] },
  { inset: "full-width" },
);

export type SeparatorVariants = VariantSelection<typeof separatorVariants.groups>;

export interface SeparatorRenderProps {
  orientation: Orientation;
}

export interface SeparatorProps
  extends Omit<AriaSeparatorProps, "className">, StyledProps<SeparatorRenderProps> {
  ref?: Ref<HTMLElement>;
}

const styles = stylex.create({
  reset: {
    margin: 0,
    borderWidth: 0,
  },
  root: {
    flexShrink: 0,
    alignSelf: "stretch",
    margin: 0,
    borderStyle: "solid",
    borderWidth: 0,
    borderColor: color["--oxy-color-outline-variant"],
  },
  horizontal: {
    blockSize: 0,
    borderBlockStartWidth: separator["--oxy-separator-thickness"],
  },
  vertical: {
    inlineSize: 0,
    borderInlineStartWidth: separator["--oxy-separator-thickness"],
  },
  horizontalInset: {
    marginInlineStart: separator["--oxy-separator-inset"],
  },
  horizontalMiddleInset: {
    marginInline: separator["--oxy-separator-inset"],
  },
  verticalInset: {
    marginBlockStart: separator["--oxy-separator-inset"],
  },
  verticalMiddleInset: {
    marginBlock: separator["--oxy-separator-inset"],
  },
});

const insets = {
  horizontal: { inset: styles.horizontalInset, "middle-inset": styles.horizontalMiddleInset },
  vertical: { inset: styles.verticalInset, "middle-inset": styles.verticalMiddleInset },
};

function separatorStyles({ inset }: SeparatorVariants, { orientation }: SeparatorRenderProps) {
  return [styles.root, styles[orientation], inset !== "full-width" && insets[orientation][inset]];
}

export function Separator({ className, unstyled, ...props }: SeparatorProps) {
  const styled = useStyled(
    { className, unstyled },
    { variants: separatorVariants, styles: separatorStyles, reset: [styles.reset] },
  );

  return (
    <AriaSeparator
      {...props}
      className={styled.className({
        orientation: props.orientation ?? "horizontal",
        defaultClassName: undefined,
      })}
    />
  );
}
