import { duration, easing } from "@oxy/motion/motion.stylex";
import { radio } from "@oxy/tokens/component.stylex";
import { color, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode, Ref } from "react";
import {
  composeRenderProps,
  Radio as AriaRadio,
  RadioButton as AriaRadioButton,
  RadioField as AriaRadioField,
  RadioGroup as AriaRadioGroup,
  type RadioButtonProps as AriaRadioButtonProps,
  type RadioFieldProps as AriaRadioFieldProps,
  type RadioFieldRenderProps,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioGroupRenderProps,
  type RadioProps as AriaRadioProps,
  type RadioRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext } from "../field/parts.ts";
import { controlGroup, controlGroupParts } from "../styles/control-group.ts";
import { densities } from "../styles/density.ts";
import { stateLayerStyles, touchTarget } from "../styles/interaction.ts";
import { selectionControl } from "../styles/selection-control.ts";
import { tones } from "../styles/tone.ts";
import { density, tone } from "../styles/vars.stylex.ts";

export const radioGroupVariants = defineVariants({}, {});

export type RadioGroupSlot = "label" | "description" | "fieldError";

export interface RadioGroupProps
  extends
    Omit<AriaRadioGroupProps, "className">,
    StyledProps<RadioGroupRenderProps, RadioGroupSlot> {
  ref?: Ref<HTMLDivElement>;
}

export const radioVariants = defineVariants(
  {
    tone: ["primary", "secondary", "tertiary", "error"],
    density: ["comfortable", "compact", "dense"],
  },
  { tone: "primary", density: "comfortable" },
);

export type RadioVariants = VariantSelection<typeof radioVariants.groups>;
export type RadioSlot = "control" | "touchTarget" | "stateLayer" | "ring" | "dot";

export interface RadioProps
  extends Omit<AriaRadioProps, "className">, StyledProps<RadioRenderProps, RadioSlot> {
  ref?: Ref<HTMLLabelElement>;
}

export interface RadioButtonProps
  extends Omit<AriaRadioButtonProps, "className">, StyledProps<RadioRenderProps, RadioSlot> {
  ref?: Ref<HTMLLabelElement>;
}

export type RadioFieldSlot = "description" | "fieldError";

export interface RadioFieldProps
  extends
    Omit<AriaRadioFieldProps, "className">,
    StyledProps<RadioFieldRenderProps, RadioFieldSlot> {
  ref?: Ref<HTMLDivElement>;
}

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;
const styles = stylex.create({
  control: {
    inlineSize: `calc(${radio["--oxy-radio-state-layer-size"]} - ${density.offset})`,
    blockSize: `calc(${radio["--oxy-radio-state-layer-size"]} - ${density.offset})`,
    color: color["--oxy-color-on-surface"],
  },
  controlSelected: {
    color: tone.color,
  },
  ring: {
    position: "relative",
    display: "grid",
    placeItems: "center",
    boxSizing: "border-box",
    inlineSize: radio["--oxy-radio-size"],
    blockSize: radio["--oxy-radio-size"],
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: radio["--oxy-radio-outline-width"],
    borderColor: color["--oxy-color-on-surface-variant"],
    color: tone.color,
    transitionProperty: "border-color",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  ringSelected: {
    borderColor: tone.color,
  },
  ringInvalid: {
    borderColor: color["--oxy-color-error"],
    color: color["--oxy-color-error"],
  },
  ringDisabled: {
    borderColor: disabledContent,
    color: disabledContent,
  },
  dot: {
    inlineSize: radio["--oxy-radio-dot-size"],
    blockSize: radio["--oxy-radio-dot-size"],
    borderRadius: "50%",
    backgroundColor: "currentColor",
    scale: 0,
    transitionProperty: "scale",
    transitionDuration: duration.spatialFast,
    transitionTimingFunction: easing.spatialFast,
  },
  dotSelected: {
    scale: 1,
  },
  field: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  supporting: {
    paddingInlineStart: `calc(${radio["--oxy-radio-state-layer-size"]} + 4px)`,
  },
});

function radioStyles(
  { tone: toneName, density: densityName }: RadioVariants,
  { isDisabled }: RadioRenderProps,
) {
  return [
    selectionControl.root,
    tones[toneName],
    densities[densityName],
    isDisabled && selectionControl.disabled,
  ];
}

const ringStyles = ({ isSelected, isInvalid, isDisabled }: RadioRenderProps) => [
  styles.ring,
  isSelected && styles.ringSelected,
  isInvalid && styles.ringInvalid,
  isDisabled && styles.ringDisabled,
];

function useRadio({
  className,
  classNames,
  unstyled,
  children,
}: StyledProps<RadioRenderProps, RadioSlot> & { children: AriaRadioProps["children"] }) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: radioVariants, styles: radioStyles, reset: [] },
  );

  const content = composeRenderProps(children, (children: ReactNode, state) => {
    const control = styled.slot("control", state, [
      selectionControl.control,
      styles.control,
      (state.isSelected || state.isInvalid) && styles.controlSelected,
      state.isFocusVisible && selectionControl.focusVisible,
    ]);
    const target = styled.slot("touchTarget", state, [touchTarget.root]);
    const stateLayer = styled.slot("stateLayer", state, stateLayerStyles(state));
    const ring = styled.slot("ring", state, ringStyles(state));
    const dot = styled.slot("dot", state, [styles.dot, state.isSelected && styles.dotSelected]);
    return (
      <>
        {control !== undefined && (
          <span aria-hidden data-slot="control" className={control}>
            {target !== undefined && <span data-slot="touch-target" className={target} />}
            {stateLayer !== undefined && <span data-slot="state-layer" className={stateLayer} />}
            {ring !== undefined && (
              <span data-slot="ring" className={ring}>
                {dot !== undefined && <span data-slot="dot" className={dot} />}
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

export function RadioGroup({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: RadioGroupProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: radioGroupVariants,
      styles: (_, { orientation }) => [
        controlGroup.root,
        orientation === "horizontal" && controlGroup.horizontal,
      ],
      reset: [],
    },
  );

  return (
    <AriaRadioGroup {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <FieldPartsContext
            value={controlGroupParts(
              (name, styles) => styled.part(name, state, styles),
              state.orientation === "horizontal",
            )}
          >
            {children}
          </FieldPartsContext>
        </UnstyledScope>
      ))}
    </AriaRadioGroup>
  );
}

export function Radio({ className, classNames, unstyled, children, ...props }: RadioProps) {
  const radio = useRadio({ className, classNames, unstyled, children });
  return <AriaRadio {...props} {...radio} />;
}

export function RadioButton({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: RadioButtonProps) {
  const radio = useRadio({ className, classNames, unstyled, children });
  return <AriaRadioButton {...props} {...radio} />;
}

export const radioFieldVariants = defineVariants({}, {});

export function RadioField({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: RadioFieldProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: radioFieldVariants, styles: () => styles.field, reset: [] },
  );

  return (
    <AriaRadioField {...props} className={styled.className}>
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
    </AriaRadioField>
  );
}
