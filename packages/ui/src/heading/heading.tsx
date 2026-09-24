import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
} from "react-aria-components";
import { useStyled } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";

export const headingVariants = defineVariants({}, {});

export interface HeadingProps extends AriaHeadingProps {
  unstyled?: boolean;
  ref?: Ref<HTMLHeadingElement>;
}

const styles = stylex.create({
  root: {
    flexGrow: `var(--oxy-headline-grow, 0)`,
    minInlineSize: 0,
    margin: 0,
    color: `var(--oxy-headline-color, ${color["--oxy-color-on-surface"]})`,
    fontFamily: `var(--oxy-headline-family, ${typography["--oxy-typography-headline-small-family"]})`,
    fontSize: `var(--oxy-headline-size, ${typography["--oxy-typography-headline-small-size"]})`,
    lineHeight: `var(--oxy-headline-line-height, ${typography["--oxy-typography-headline-small-line-height"]})`,
    fontWeight: `var(--oxy-headline-weight, ${typography["--oxy-typography-headline-small-weight"]})`,
    letterSpacing: `var(--oxy-headline-tracking, ${typography["--oxy-typography-headline-small-tracking"]})`,
  },
});

export function Heading({ className, unstyled, ...props }: HeadingProps) {
  const styled = useStyled(
    { className, unstyled },
    { variants: headingVariants, styles: () => styles.root, reset: [] },
  );
  return <AriaHeading {...props} className={styled.className({ defaultClassName: undefined })} />;
}
