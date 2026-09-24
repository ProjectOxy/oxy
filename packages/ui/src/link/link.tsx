import { duration, easing } from "@oxy/motion/motion.stylex";
import { color, radius, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { use, type Ref } from "react";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  type LinkRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { focusRing } from "../styles/interaction.ts";
import { tones } from "../styles/tone.ts";
import { tone } from "../styles/vars.stylex.ts";
import { LinkPartContext } from "./part.ts";

export const linkVariants = defineVariants(
  {
    tone: ["primary", "secondary", "tertiary", "error"],
    decoration: ["underlined", "plain"],
  },
  { tone: "primary", decoration: "underlined" },
);

export type LinkVariants = VariantSelection<typeof linkVariants.groups>;

export interface LinkProps extends Omit<AriaLinkProps, "className">, StyledProps<LinkRenderProps> {
  ref?: Ref<HTMLAnchorElement>;
}

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

const styles = stylex.create({
  reset: {
    color: "inherit",
    textDecorationLine: "none",
  },
  root: {
    color: tone.color,
    borderRadius: radius["--oxy-radius-xs"],
    textDecorationThickness: "1px",
    textUnderlineOffset: "0.2em",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    transitionProperty: "color, text-decoration-color",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  underlined: {
    textDecorationLine: "underline",
  },
  plain: {
    textDecorationLine: "none",
  },
  hovered: {
    textDecorationLine: "underline",
    textDecorationThickness: "2px",
  },
  current: {
    color: color["--oxy-color-on-surface"],
    textDecorationLine: "none",
    cursor: "default",
  },
  disabled: {
    color: disabledContent,
    textDecorationLine: "none",
    cursor: "default",
  },
});

function linkStyles(
  { tone: toneName, decoration }: LinkVariants,
  { isHovered, isCurrent, isDisabled }: LinkRenderProps,
) {
  return [
    styles.root,
    focusRing.root,
    tones[toneName],
    styles[decoration],
    isHovered && styles.hovered,
    isCurrent && styles.current,
    isDisabled && styles.disabled,
  ];
}

export function Link({ className, classNames, unstyled, ...props }: LinkProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: linkVariants,
      styles: linkStyles,
      reset: [styles.reset],
      part: use(LinkPartContext),
    },
  );

  return <AriaLink {...props} className={styled.className} />;
}
