import type { Ref } from "react";
import {
  composeRenderProps,
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  type NumberFieldRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext, type FieldPartName } from "../field/parts.ts";
import { fieldVariantGroups, textFieldParts, textFieldStyles } from "../field/text-field-styles.ts";

export const numberFieldVariants = defineVariants(
  { variant: ["filled", "outlined"], ...fieldVariantGroups },
  { variant: "filled", tone: "primary", density: "comfortable" },
);

export type NumberFieldVariants = VariantSelection<typeof numberFieldVariants.groups>;
export type NumberFieldSlot = FieldPartName;

export interface NumberFieldProps
  extends
    Omit<AriaNumberFieldProps, "className">,
    StyledProps<NumberFieldRenderProps, NumberFieldSlot> {
  ref?: Ref<HTMLDivElement>;
}

const isPopulated = ({ state }: NumberFieldRenderProps) => state.inputValue !== "";

export function NumberField({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: NumberFieldProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: numberFieldVariants,
      styles: ({ variant, tone, density }, state) =>
        textFieldStyles(variant, tone, density, { ...state, isPopulated: isPopulated(state) }),
      reset: [],
    },
  );

  return (
    <AriaNumberField {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <FieldPartsContext
            value={textFieldParts((name, styles) => styled.part(name, state, styles), {
              ...state,
              isPopulated: isPopulated(state),
            })}
          >
            {children}
          </FieldPartsContext>
        </UnstyledScope>
      ))}
    </AriaNumberField>
  );
}
