import { duration, easing } from "@oxy/motion/motion.stylex";
import { datePicker, textField } from "@oxy/tokens/component.stylex";
import { color, state as stateToken } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  type DateInputRenderProps,
  DateSegment as AriaDateSegment,
  type DateSegmentProps as AriaDateSegmentProps,
  type DateSegmentRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { field } from "../field/field.stylex.ts";
import { standaloneInputStyles } from "../field/text-field-styles.ts";
import { tone } from "../styles/vars.stylex.ts";

const noVariants = defineVariants({}, {});

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${stateToken["--oxy-state-disabled-content"]} * 100%), transparent)`;

const styles = stylex.create({
  standalone: {
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    cursor: "text",
    [field.indicator]: {
      default: color["--oxy-color-outline"],
      ":hover": color["--oxy-color-on-surface"],
      ":focus-within": tone.color,
    },
    [field.indicatorWidth]: {
      default: textField["--oxy-text-field-indicator-width"],
      ":focus-within": textField["--oxy-text-field-focus-indicator-width"],
    },
  },
  invalid: {
    [field.indicator]: color["--oxy-color-error"],
  },
  segment: {
    boxSizing: "border-box",
    display: "inline-block",
    paddingInline: "1px",
    borderRadius: datePicker["--oxy-date-picker-segment-radius"],
    outlineStyle: "none",
    caretColor: "transparent",
    fontVariantNumeric: "tabular-nums",
    textAlign: "end",
    whiteSpace: "pre",
    transitionProperty: "background-color, color",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  literal: {
    paddingInline: 0,
  },
  placeholder: {
    color: color["--oxy-color-on-surface-variant"],
  },
  focused: {
    backgroundColor: tone.container,
    color: tone.onContainer,
  },
  invalidFocused: {
    backgroundColor: color["--oxy-color-error-container"],
    color: color["--oxy-color-on-error-container"],
  },
  disabled: {
    color: disabledContent,
  },
});

export interface DateInputProps
  extends Omit<AriaDateInputProps, "className" | "children">, StyledProps<DateInputRenderProps> {
  children?: AriaDateInputProps["children"];
  ref?: Ref<HTMLDivElement>;
}

const renderSegment: AriaDateInputProps["children"] = (segment) => (
  <DateSegment segment={segment} />
);

export function DateInput({
  className,
  unstyled,
  children = renderSegment,
  ...props
}: DateInputProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: noVariants,
      styles: (_, { isDisabled, isInvalid }: DateInputRenderProps) => [
        standaloneInputStyles(isDisabled),
        styles.standalone,
        isInvalid && styles.invalid,
      ],
      reset: [],
    },
  );

  return (
    <AriaDateInput {...props} className={styled.className}>
      {children}
    </AriaDateInput>
  );
}

export interface DateSegmentProps
  extends Omit<AriaDateSegmentProps, "className">, StyledProps<DateSegmentRenderProps> {
  ref?: Ref<HTMLSpanElement>;
}

const dateSegmentStyles = (state: DateSegmentRenderProps) => [
  styles.segment,
  state.type === "literal" && styles.literal,
  state.isPlaceholder && styles.placeholder,
  state.isFocused && (state.isInvalid ? styles.invalidFocused : styles.focused),
  state.isDisabled && styles.disabled,
];

export function DateSegment({ className, unstyled, ...props }: DateSegmentProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: noVariants,
      styles: (_, state: DateSegmentRenderProps) => dateSegmentStyles(state),
      reset: [],
    },
  );

  return <AriaDateSegment {...props} className={styled.className} />;
}
