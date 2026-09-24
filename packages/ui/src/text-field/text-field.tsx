import { useState, type Ref } from "react";
import {
  composeRenderProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type TextFieldRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext, type FieldPartName } from "../field/parts.ts";
import { fieldVariantGroups, textFieldParts, textFieldStyles } from "../field/text-field-styles.ts";

export const textFieldVariants = defineVariants(
  { variant: ["filled", "outlined"], ...fieldVariantGroups },
  { variant: "filled", tone: "primary", density: "comfortable" },
);

export type TextFieldVariants = VariantSelection<typeof textFieldVariants.groups>;
export type TextFieldSlot = FieldPartName;

export interface TextFieldProps
  extends Omit<AriaTextFieldProps, "className">, StyledProps<TextFieldRenderProps, TextFieldSlot> {
  ref?: Ref<HTMLDivElement>;
}

export function TextField({
  className,
  classNames,
  unstyled,
  children,
  value,
  defaultValue,
  onChange,
  ...props
}: TextFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const isPopulated = (value ?? uncontrolledValue) !== "";
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: textFieldVariants,
      styles: ({ variant, tone, density }, state) =>
        textFieldStyles(variant, tone, density, { ...state, isPopulated }),
      reset: [],
    },
  );

  return (
    <AriaTextField
      {...props}
      value={value}
      defaultValue={defaultValue}
      onChange={(next) => {
        setUncontrolledValue(next);
        onChange?.(next);
      }}
      className={styled.className}
    >
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <FieldPartsContext
            value={textFieldParts((name, styles) => styled.part(name, state, styles), {
              ...state,
              isPopulated,
            })}
          >
            {children}
          </FieldPartsContext>
        </UnstyledScope>
      ))}
    </AriaTextField>
  );
}
