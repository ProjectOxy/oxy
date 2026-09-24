import { duration, easing } from "@oxy/motion/motion.stylex";
import { datePicker, dropdown } from "@oxy/tokens/component.stylex";
import { color, space, state as stateToken } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import {
  FieldError,
  Label,
  Text,
  type DateSegmentRenderProps,
  type ValidationResult,
} from "react-aria-components";
import { typeScale } from "../collection/type.ts";
import type { ClassNameValue, SlotClassNames } from "../core/class-names.ts";
import type { Styles } from "../core/parts.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { field } from "../select/field.stylex.ts";
import {
  fieldParts,
  fieldStyles,
  fieldVariantDefaults,
  fieldVariantGroups,
} from "../select/field.ts";
import { focusRing } from "../styles/interaction.ts";
import { tone } from "../styles/vars.stylex.ts";

export const dateFieldVariants = defineVariants(fieldVariantGroups, fieldVariantDefaults);

export type DateFieldVariants = VariantSelection<typeof dateFieldVariants.groups>;

export type SegmentClassName = ClassNameValue<
  DateSegmentRenderProps & { defaultClassName: string | undefined }
>;

export type SegmentFieldClassNames<Slot extends string, State> = SlotClassNames<Slot, State> & {
  segment?: SegmentClassName;
};

export interface FieldChromeProps {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
}

interface FieldState {
  isInvalid: boolean;
  isDisabled: boolean;
}

type ChromeSlot = "label" | "description" | "fieldError";

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${stateToken["--oxy-state-disabled-content"]} * 100%), transparent)`;
const layer = (opacity: string) =>
  `linear-gradient(color-mix(in srgb, currentColor calc(${opacity} * 100%), transparent), color-mix(in srgb, currentColor calc(${opacity} * 100%), transparent))`;

export const dateFieldStyles = stylex.create({
  field: {
    cursor: "text",
  },
  input: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    minInlineSize: 0,
    paddingBlockStart: `calc(2 * ${field.contentShift})`,
    overflow: "hidden",
    whiteSpace: "nowrap",
    outlineStyle: "none",
  },
  range: {
    inlineSize: "max-content",
    minInlineSize: dropdown["--oxy-dropdown-width"],
  },
  grow: {
    flexGrow: 1,
  },
  separator: {
    flexShrink: 0,
    paddingBlockStart: `calc(2 * ${field.contentShift})`,
    color: color["--oxy-color-on-surface-variant"],
  },
  trigger: {
    appearance: "none",
    position: "relative",
    boxSizing: "border-box",
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    inlineSize: datePicker["--oxy-date-picker-trigger-size"],
    blockSize: datePicker["--oxy-date-picker-trigger-size"],
    marginBlock: 0,
    marginInlineStart: "auto",
    marginInlineEnd: `calc((${dropdown["--oxy-dropdown-icon-size"]} - ${datePicker["--oxy-date-picker-trigger-size"]}) / 2)`,
    padding: 0,
    borderWidth: 0,
    borderRadius: "50%",
    backgroundColor: "transparent",
    backgroundImage: {
      default: "none",
      ":is([data-hovered])": layer(stateToken["--oxy-state-hover"]),
      ":is([data-focus-visible])": layer(stateToken["--oxy-state-focus"]),
      ":is([data-pressed])": layer(stateToken["--oxy-state-pressed"]),
    },
    color: color["--oxy-color-on-surface-variant"],
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    transitionProperty: "color",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  triggerOpen: {
    color: tone.color,
  },
  triggerInvalid: {
    color: color["--oxy-color-error"],
  },
  triggerDisabled: {
    color: disabledContent,
    cursor: "default",
  },
  popover: {
    boxSizing: "border-box",
    maxInlineSize: `calc(100vw - 2 * ${space["--oxy-space-lg"]})`,
    overflow: "auto",
    borderRadius: datePicker["--oxy-date-picker-radius"],
    backgroundColor: datePicker["--oxy-date-picker-container-color"],
    boxShadow: datePicker["--oxy-date-picker-elevation"],
    outlineStyle: "none",
    transformOrigin: "var(--trigger-anchor-point)",
  },
  dialog: {
    outlineStyle: "none",
  },
});

export const triggerStyles = ({
  isOpen,
  isInvalid,
  isDisabled,
}: FieldState & { isOpen: boolean }) => [
  dateFieldStyles.trigger,
  focusRing.root,
  isOpen && dateFieldStyles.triggerOpen,
  isInvalid && dateFieldStyles.triggerInvalid,
  isDisabled && dateFieldStyles.triggerDisabled,
];

export function useSegmentFieldStyled<State extends FieldState, Slot extends string>(
  { className, classNames, unstyled }: StyledProps<State, Slot>,
  hasLabel: boolean,
  isFocused: (state: State) => boolean,
  extra: Styles = [],
) {
  return useStyled(
    { className, classNames, unstyled },
    {
      variants: dateFieldVariants,
      styles: (variants, state: State) => [
        fieldStyles(variants, {
          hasLabel,
          isFocused: isFocused(state),
          isInvalid: state.isInvalid,
          isDisabled: state.isDisabled,
        }),
        extra,
      ],
      reset: [],
    },
  );
}

export function useFocusWithin(onFocusChange: ((isFocused: boolean) => void) | undefined) {
  const [isFocused, setFocused] = useState(false);
  return [
    isFocused,
    (focused: boolean) => {
      setFocused(focused);
      onFocusChange?.(focused);
    },
  ] as const;
}

export function FieldChrome<State extends FieldState>({
  slot,
  state,
  label,
  description,
  errorMessage,
  children,
}: FieldChromeProps & {
  slot: (name: ChromeSlot, state: State, styles: Styles) => string | undefined;
  state: State;
  children: ReactNode;
}) {
  return (
    <>
      {label != null && (
        <Label
          className={slot("label", state, [
            fieldParts.label,
            typeScale.bodyLarge,
            fieldParts.labelFloated,
          ])}
        >
          {label}
        </Label>
      )}
      {children}
      {description != null && !state.isInvalid && (
        <Text
          slot="description"
          className={slot("description", state, [fieldParts.supporting, typeScale.bodySmall])}
        >
          {description}
        </Text>
      )}
      <FieldError
        className={slot("fieldError", state, [
          fieldParts.supporting,
          typeScale.bodySmall,
          fieldParts.error,
        ])}
      >
        {errorMessage}
      </FieldError>
    </>
  );
}
