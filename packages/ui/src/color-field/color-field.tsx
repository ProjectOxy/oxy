import type { Ref } from "react";
import {
  ColorField as AriaColorField,
  composeRenderProps,
  type ColorFieldProps as AriaColorFieldProps,
  type ColorFieldRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext, type FieldPartName } from "../field/parts.ts";
import { fieldVariantGroups, textFieldParts, textFieldStyles } from "../field/text-field-styles.ts";

export const colorFieldVariants = defineVariants(
  { variant: ["filled", "outlined"], ...fieldVariantGroups },
  { variant: "filled", tone: "primary", density: "comfortable" },
);

export type ColorFieldVariants = VariantSelection<typeof colorFieldVariants.groups>;
export type ColorFieldSlot = FieldPartName;

export interface ColorFieldProps
  extends
    Omit<AriaColorFieldProps, "className">,
    StyledProps<ColorFieldRenderProps, ColorFieldSlot> {
  ref?: Ref<HTMLDivElement>;
}

const isPopulated = ({ state }: ColorFieldRenderProps) => state.inputValue !== "";

export function ColorField({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: ColorFieldProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: colorFieldVariants,
      styles: ({ variant, tone, density }, state) =>
        textFieldStyles(variant, tone, density, { ...state, isPopulated: isPopulated(state) }),
      reset: [],
    },
  );

  return (
    <AriaColorField {...props} className={styled.className}>
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
    </AriaColorField>
  );
}
