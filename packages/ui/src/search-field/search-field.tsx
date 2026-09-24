import type { Ref } from "react";
import {
  composeRenderProps,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  type SearchFieldRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext, type FieldPartName } from "../field/parts.ts";
import {
  fieldVariantGroups,
  textFieldParts,
  textFieldPartStyles,
  textFieldStyles,
} from "../field/text-field-styles.ts";

export const searchFieldVariants = defineVariants(
  { variant: ["bar", "filled", "outlined"], ...fieldVariantGroups },
  { variant: "bar", tone: "primary", density: "comfortable" },
);

export type SearchFieldVariants = VariantSelection<typeof searchFieldVariants.groups>;
export type SearchFieldSlot = FieldPartName;

export interface SearchFieldProps
  extends
    Omit<AriaSearchFieldProps, "className">,
    StyledProps<SearchFieldRenderProps, SearchFieldSlot> {
  ref?: Ref<HTMLDivElement>;
}

const searchInput = [textFieldPartStyles.input, textFieldPartStyles.searchInput];

export function SearchField({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: SearchFieldProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: searchFieldVariants,
      styles: ({ variant, tone, density }, state) =>
        textFieldStyles(variant, tone, density, { ...state, isPopulated: !state.isEmpty }),
      reset: [],
    },
  );

  return (
    <AriaSearchField {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <FieldPartsContext
            value={textFieldParts(
              (name, styles) => styled.part(name, state, styles),
              { ...state, isPopulated: !state.isEmpty },
              searchInput,
            )}
          >
            {children}
          </FieldPartsContext>
        </UnstyledScope>
      ))}
    </AriaSearchField>
  );
}
