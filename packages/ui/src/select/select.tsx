import { presence } from "@oxy/motion";
import { use, type ReactNode, type Ref } from "react";
import {
  Button,
  FieldError,
  Label,
  ListBox,
  Popover,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  type SelectRenderProps,
  SelectStateContext,
  SelectValue as AriaSelectValue,
  type SelectValueProps as AriaSelectValueProps,
  type SelectValueRenderProps,
  Text,
  type ValidationResult,
} from "react-aria-components";
import { GlyphIcon } from "../collection/glyphs.tsx";
import { listContainer, surface } from "../collection/list.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { densities } from "../styles/density.ts";
import {
  dropdownOffset,
  fieldParts,
  fieldStyles,
  fieldVariantDefaults,
  fieldVariantGroups,
} from "./field.ts";
import { typeScale } from "../collection/type.ts";

export const selectVariants = defineVariants(fieldVariantGroups, fieldVariantDefaults);

export type SelectVariants = VariantSelection<typeof selectVariants.groups>;

export type SelectSlot =
  | "label"
  | "trigger"
  | "value"
  | "indicator"
  | "description"
  | "fieldError"
  | "popover"
  | "listbox";

type SelectionMode = "single" | "multiple";

export interface SelectProps<T extends object, M extends SelectionMode = "single">
  extends
    Omit<AriaSelectProps<T, M>, "className" | "children">,
    StyledProps<SelectRenderProps, SelectSlot> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  items?: Iterable<T>;
  dependencies?: readonly unknown[];
  children: ReactNode | ((item: T) => ReactNode);
  ref?: Ref<HTMLDivElement>;
}

function WithSelection({ children }: { children: (hasSelection: boolean) => ReactNode }) {
  const state = use(SelectStateContext);
  return children((state?.selectedItems.length ?? 0) > 0);
}

export function Select<T extends object, M extends SelectionMode = "single">({
  label,
  description,
  errorMessage,
  items,
  dependencies,
  children,
  className,
  classNames,
  unstyled,
  ...props
}: SelectProps<T, M>) {
  const hasLabel = label != null;
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: selectVariants,
      styles: (variants, state: SelectRenderProps) =>
        fieldStyles(variants, {
          hasLabel,
          isFocused: state.isFocused || state.isOpen,
          isInvalid: state.isInvalid,
          isDisabled: state.isDisabled,
        }),
      reset: [],
    },
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaSelect {...props} className={styled.className}>
        {(state) => {
          const variants = styled.variants(state);
          const indicator = styled.slot("indicator", state, [
            fieldParts.indicator,
            state.isOpen && fieldParts.indicatorOpen,
            state.isInvalid && fieldParts.indicatorInvalid,
            state.isDisabled && fieldParts.indicatorDisabled,
          ]);
          return (
            <WithSelection>
              {(hasSelection) => {
                const isFloated = hasSelection || state.isFocused || state.isOpen;
                return (
                  <>
                    {hasLabel && (
                      <Label
                        className={styled.slot("label", state, [
                          fieldParts.label,
                          typeScale.bodyLarge,
                          isFloated && fieldParts.labelFloated,
                        ])}
                      >
                        {label}
                      </Label>
                    )}
                    <Button
                      className={styled.slot("trigger", state, [
                        fieldParts.container,
                        fieldParts.trigger,
                        state.isDisabled && fieldParts.triggerDisabled,
                      ])}
                    >
                      <AriaSelectValue
                        className={({ isPlaceholder }) =>
                          styled.slot("value", state, [
                            fieldParts.value,
                            typeScale.bodyLarge,
                            isPlaceholder && fieldParts.placeholder,
                            hasLabel && !isFloated && fieldParts.resting,
                          ]) ?? ""
                        }
                      />
                      {indicator !== undefined && (
                        <span aria-hidden data-slot="indicator" className={indicator}>
                          <GlyphIcon glyph="arrowDropDown" />
                        </span>
                      )}
                    </Button>
                    {description != null && !state.isInvalid && (
                      <Text
                        slot="description"
                        className={styled.slot("description", state, [
                          fieldParts.supporting,
                          typeScale.bodySmall,
                        ])}
                      >
                        {description}
                      </Text>
                    )}
                    <FieldError
                      className={styled.slot("fieldError", state, [
                        fieldParts.supporting,
                        typeScale.bodySmall,
                        fieldParts.error,
                      ])}
                    >
                      {errorMessage}
                    </FieldError>
                    <Popover
                      offset={dropdownOffset}
                      className={styled.slot("popover", state, [
                        surface.root,
                        surface.elevated,
                        surface.popover,
                        presence.scale,
                        fieldParts.popover,
                        variants && densities[variants.density],
                      ])}
                    >
                      <ListBox
                        items={items}
                        dependencies={dependencies}
                        className={styled.slot("listbox", state, [
                          listContainer.menu,
                          typeScale.labelLarge,
                        ])}
                      >
                        {children}
                      </ListBox>
                    </Popover>
                  </>
                );
              }}
            </WithSelection>
          );
        }}
      </AriaSelect>
    </UnstyledScope>
  );
}

export interface SelectValueProps<T extends object>
  extends Omit<AriaSelectValueProps<T>, "className">, StyledProps<SelectValueRenderProps<T>> {
  ref?: Ref<HTMLSpanElement>;
}

const selectValueVariants = defineVariants({}, {});

export function SelectValue<T extends object>({
  className,
  classNames,
  unstyled,
  ...props
}: SelectValueProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: selectValueVariants,
      styles: (_, { isPlaceholder }: SelectValueRenderProps<T>) => [
        fieldParts.value,
        typeScale.bodyLarge,
        isPlaceholder && fieldParts.placeholder,
      ],
      reset: [],
    },
  );

  return <AriaSelectValue {...props} className={styled.className} />;
}
