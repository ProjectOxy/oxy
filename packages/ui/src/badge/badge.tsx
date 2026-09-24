import { badge } from "@oxy/tokens/component.stylex";
import { radius, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useNumberFormatter } from "react-aria";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { tones } from "../styles/tone.ts";
import { tone } from "../styles/vars.stylex.ts";

export const badgeVariants = defineVariants(
  { tone: ["error", "primary", "secondary", "tertiary"] },
  { tone: "error" },
);

export type BadgeVariants = VariantSelection<typeof badgeVariants.groups>;
export type BadgeSlot = "anchor";

export interface BadgeRenderProps {
  isDot: boolean;
  isAnchored: boolean;
}

export interface BadgeProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, "className" | "children">,
    StyledProps<BadgeRenderProps, BadgeSlot> {
  value?: number | string;
  max?: number;
  formatOptions?: Intl.NumberFormatOptions;
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

const largeSize = badge["--oxy-badge-large-size"];
const smallSize = badge["--oxy-badge-small-size"];

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    minInlineSize: largeSize,
    blockSize: largeSize,
    paddingInline: badge["--oxy-badge-padding-inline"],
    borderRadius: radius["--oxy-radius-full"],
    backgroundColor: tone.color,
    color: tone.onColor,
    fontFamily: typography["--oxy-typography-label-small-family"],
    fontSize: typography["--oxy-typography-label-small-size"],
    lineHeight: typography["--oxy-typography-label-small-line-height"],
    fontWeight: typography["--oxy-typography-label-small-weight"],
    letterSpacing: typography["--oxy-typography-label-small-tracking"],
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  dot: {
    minInlineSize: smallSize,
    blockSize: smallSize,
    paddingInline: 0,
  },
  anchored: {
    position: "absolute",
    insetBlockStart: `calc(${largeSize} / -4)`,
    insetInlineStart: "50%",
  },
  anchoredDot: {
    insetBlockStart: 0,
    insetInlineStart: `calc(100% - ${smallSize})`,
  },
  anchor: {
    position: "relative",
    display: "inline-flex",
    verticalAlign: "middle",
  },
});

function badgeStyles({ tone: toneName }: BadgeVariants, { isDot, isAnchored }: BadgeRenderProps) {
  return [
    styles.root,
    tones[toneName],
    isDot && styles.dot,
    isAnchored && styles.anchored,
    isAnchored && isDot && styles.anchoredDot,
  ];
}

export function Badge({
  value,
  max = 999,
  formatOptions,
  className,
  classNames,
  unstyled,
  children,
  ...props
}: BadgeProps) {
  const format = useNumberFormatter(formatOptions);
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: badgeVariants, styles: badgeStyles, reset: [] },
  );

  const state = { isDot: value === undefined, isAnchored: children != null };
  const isLabelled = props["aria-label"] !== undefined;
  const content =
    typeof value === "number"
      ? value > max
        ? `${format.format(max)}+`
        : format.format(value)
      : value;
  const element = (
    <span
      role={isLabelled ? "img" : undefined}
      aria-hidden={state.isDot && !isLabelled ? true : undefined}
      {...props}
      data-dot={state.isDot || undefined}
      className={styled.className({ ...state, defaultClassName: undefined })}
    >
      {content}
    </span>
  );

  if (!state.isAnchored) return element;
  return (
    <span data-slot="anchor" className={styled.slot("anchor", state, [styles.anchor])}>
      {children}
      {element}
    </span>
  );
}
