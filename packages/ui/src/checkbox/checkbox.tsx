import { duration, easing } from "@oxy/motion/motion.stylex";
import { checkbox } from "@oxy/tokens/component.stylex";
import { color, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode, Ref } from "react";
import {
  Checkbox as AriaCheckbox,
  CheckboxButton as AriaCheckboxButton,
  CheckboxField as AriaCheckboxField,
  composeRenderProps,
  type CheckboxButtonProps as AriaCheckboxButtonProps,
  type CheckboxFieldProps as AriaCheckboxFieldProps,
  type CheckboxFieldRenderProps,
  type CheckboxProps as AriaCheckboxProps,
  type CheckboxRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext } from "../field/parts.ts";
import { controlGroup } from "../styles/control-group.ts";
import { densities } from "../styles/density.ts";
import { stateLayerStyles, touchTarget } from "../styles/interaction.ts";
import { selectionControl } from "../styles/selection-control.ts";
import { tones } from "../styles/tone.ts";
import { density, tone } from "../styles/vars.stylex.ts";

export const checkboxVariants = defineVariants(
  {
    tone: ["primary", "secondary", "tertiary", "error"],
    density: ["comfortable", "compact", "dense"],
  },
  { tone: "primary", density: "comfortable" },
);

export type CheckboxVariants = VariantSelection<typeof checkboxVariants.groups>;
export type CheckboxSlot = "control" | "touchTarget" | "stateLayer" | "box" | "icon";

export interface CheckboxProps
  extends Omit<AriaCheckboxProps, "className">, StyledProps<CheckboxRenderProps, CheckboxSlot> {
  ref?: Ref<HTMLLabelElement>;
}

export interface CheckboxButtonProps
  extends
    Omit<AriaCheckboxButtonProps, "className">,
    StyledProps<CheckboxRenderProps, CheckboxSlot> {
  ref?: Ref<HTMLLabelElement>;
}

export type CheckboxFieldSlot = "description" | "fieldError";

export interface CheckboxFieldProps
  extends
    Omit<AriaCheckboxFieldProps, "className">,
    StyledProps<CheckboxFieldRenderProps, CheckboxFieldSlot> {
  ref?: Ref<HTMLDivElement>;
}

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;
const styles = stylex.create({
  control: {
    inlineSize: `calc(${checkbox["--oxy-checkbox-state-layer-size"]} - ${density.offset})`,
    blockSize: `calc(${checkbox["--oxy-checkbox-state-layer-size"]} - ${density.offset})`,
    color: color["--oxy-color-on-surface"],
  },
  controlSelected: {
    color: tone.color,
  },
  box: {
    position: "relative",
    boxSizing: "border-box",
    inlineSize: checkbox["--oxy-checkbox-size"],
    blockSize: checkbox["--oxy-checkbox-size"],
    borderRadius: checkbox["--oxy-checkbox-radius"],
    borderStyle: "solid",
    borderWidth: checkbox["--oxy-checkbox-outline-width"],
    borderColor: color["--oxy-color-on-surface-variant"],
    backgroundColor: "transparent",
    color: tone.onColor,
    transitionProperty: "background-color, border-color",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  boxSelected: {
    backgroundColor: tone.color,
    borderColor: tone.color,
  },
  boxInvalid: {
    borderColor: color["--oxy-color-error"],
  },
  boxInvalidSelected: {
    backgroundColor: color["--oxy-color-error"],
    borderColor: color["--oxy-color-error"],
    color: color["--oxy-color-on-error"],
  },
  boxDisabled: {
    borderColor: disabledContent,
  },
  boxDisabledSelected: {
    backgroundColor: disabledContent,
    borderColor: "transparent",
    color: color["--oxy-color-surface"],
  },
  icon: {
    position: "absolute",
    inset: `calc(-1 * ${checkbox["--oxy-checkbox-outline-width"]})`,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    transitionProperty: "stroke-dashoffset",
    transitionDuration: duration.spatialFast,
    transitionTimingFunction: easing.spatialFast,
  },
  iconShown: {
    strokeDashoffset: 0,
  },
  field: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  supporting: {
    paddingInlineStart: `calc(${checkbox["--oxy-checkbox-state-layer-size"]} + 4px)`,
  },
});

function checkboxStyles(
  { tone: toneName, density: densityName }: CheckboxVariants,
  { isDisabled }: CheckboxRenderProps,
) {
  return [
    selectionControl.root,
    tones[toneName],
    densities[densityName],
    isDisabled && selectionControl.disabled,
  ];
}

function boxStyles({ isSelected, isIndeterminate, isInvalid, isDisabled }: CheckboxRenderProps) {
  const isChecked = isSelected || isIndeterminate;
  if (isDisabled) return [styles.box, styles.boxDisabled, isChecked && styles.boxDisabledSelected];
  if (isInvalid) return [styles.box, styles.boxInvalid, isChecked && styles.boxInvalidSelected];
  return [styles.box, isChecked && styles.boxSelected];
}

function useCheckbox({
  className,
  classNames,
  unstyled,
  children,
}: StyledProps<CheckboxRenderProps, CheckboxSlot> & {
  children: AriaCheckboxProps["children"];
}) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: checkboxVariants, styles: checkboxStyles, reset: [] },
  );

  const content = composeRenderProps(children, (children: ReactNode, state) => {
    const isChecked = state.isSelected || state.isIndeterminate;
    const control = styled.slot("control", state, [
      selectionControl.control,
      styles.control,
      (isChecked || state.isInvalid) && styles.controlSelected,
      state.isFocusVisible && selectionControl.focusVisible,
    ]);
    const target = styled.slot("touchTarget", state, [touchTarget.root]);
    const stateLayer = styled.slot("stateLayer", state, stateLayerStyles(state));
    const box = styled.slot("box", state, boxStyles(state));
    const icon = styled.slot("icon", state, [styles.icon, isChecked && styles.iconShown]);
    return (
      <>
        {control !== undefined && (
          <span aria-hidden data-slot="control" className={control}>
            {target !== undefined && <span data-slot="touch-target" className={target} />}
            {stateLayer !== undefined && <span data-slot="state-layer" className={stateLayer} />}
            {box !== undefined && (
              <span data-slot="box" className={box}>
                {icon !== undefined && (
                  <svg data-slot="icon" className={icon} viewBox="0 0 18 18">
                    <path
                      pathLength={1}
                      d={state.isIndeterminate ? "M4.5 9h9" : "M4 9.5l3.5 3.5 6.5-7"}
                    />
                  </svg>
                )}
              </span>
            )}
          </span>
        )}
        {children}
      </>
    );
  });

  return { className: styled.className, children: content };
}

export function Checkbox({ className, classNames, unstyled, children, ...props }: CheckboxProps) {
  const checkbox = useCheckbox({ className, classNames, unstyled, children });
  return <AriaCheckbox {...props} {...checkbox} />;
}

export function CheckboxButton({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: CheckboxButtonProps) {
  const checkbox = useCheckbox({ className, classNames, unstyled, children });
  return <AriaCheckboxButton {...props} {...checkbox} />;
}

export const checkboxFieldVariants = defineVariants({}, {});

export function CheckboxField({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: CheckboxFieldProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: checkboxFieldVariants, styles: () => styles.field, reset: [] },
  );

  return (
    <AriaCheckboxField {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <FieldPartsContext
            value={{
              description: styled.part("description", state, [
                controlGroup.supporting,
                styles.supporting,
              ]),
              fieldError: styled.part("fieldError", state, [
                controlGroup.supporting,
                controlGroup.error,
                styles.supporting,
              ]),
            }}
          >
            {children}
          </FieldPartsContext>
        </UnstyledScope>
      ))}
    </AriaCheckboxField>
  );
}
