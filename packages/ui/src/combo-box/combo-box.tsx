import { presence } from "@oxy/motion";
import * as stylex from "@stylexjs/stylex";
import { use, useState, type ReactNode, type Ref } from "react";
import {
  Button,
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  type ComboBoxRenderProps,
  ComboBoxStateContext,
  ComboBoxValue as AriaComboBoxValue,
  type ComboBoxValueProps as AriaComboBoxValueProps,
  type ComboBoxValueRenderProps,
  FieldError,
  Group,
  Input,
  Label,
  ListBox,
  Popover,
  Text,
  type ValidationResult,
} from "react-aria-components";
import { GlyphIcon } from "../collection/glyphs.tsx";
import { listContainer, surface } from "../collection/list.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import {
  dropdownOffset,
  fieldParts,
  fieldStyles,
  fieldVariantDefaults,
  fieldVariantGroups,
} from "../select/field.ts";
import { densities } from "../styles/density.ts";
import { typeScale } from "../collection/type.ts";

export const comboBoxVariants = defineVariants(fieldVariantGroups, fieldVariantDefaults);

export type ComboBoxVariants = VariantSelection<typeof comboBoxVariants.groups>;

export type ComboBoxSlot =
  | "label"
  | "field"
  | "value"
  | "input"
  | "indicator"
  | "description"
  | "fieldError"
  | "popover"
  | "listbox";

type SelectionMode = "single" | "multiple";

export interface ComboBoxProps<T extends object, M extends SelectionMode = "single">
  extends
    Omit<AriaComboBoxProps<T, M>, "className" | "children">,
    StyledProps<ComboBoxRenderProps, ComboBoxSlot> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  placeholder?: string;
  dependencies?: readonly unknown[];
  children: ReactNode | ((item: T) => ReactNode);
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  field: {
    cursor: "text",
  },
  value: {
    flexGrow: 0,
    flexShrink: 1,
    maxInlineSize: "50%",
  },
});

function WithInput({ children }: { children: (hasValue: boolean) => ReactNode }) {
  const state = use(ComboBoxStateContext);
  return children(!!state && (state.inputValue !== "" || state.selectedItems.length > 0));
}

export function ComboBox<T extends object, M extends SelectionMode = "single">({
  label,
  description,
  errorMessage,
  placeholder,
  dependencies,
  children,
  className,
  classNames,
  unstyled,
  onFocusChange,
  ...props
}: ComboBoxProps<T, M>) {
  const [isFocused, setFocused] = useState(false);
  const hasLabel = label != null;
  const isMultiple = props.selectionMode === "multiple";
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: comboBoxVariants,
      styles: (variants, state: ComboBoxRenderProps) =>
        fieldStyles(variants, {
          hasLabel,
          isFocused: isFocused || state.isOpen,
          isInvalid: state.isInvalid,
          isDisabled: state.isDisabled,
        }),
      reset: [],
    },
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaComboBox
        {...props}
        onFocusChange={(focused) => {
          setFocused(focused);
          onFocusChange?.(focused);
        }}
        className={styled.className}
      >
        {(state) => {
          const variants = styled.variants(state);
          const indicator = styled.slot("indicator", state, [
            fieldParts.indicator,
            state.isOpen && fieldParts.indicatorOpen,
            state.isInvalid && fieldParts.indicatorInvalid,
            state.isDisabled && fieldParts.indicatorDisabled,
          ]);
          return (
            <WithInput>
              {(hasValue) => {
                const isFloated = hasValue || isFocused || state.isOpen;
                const isResting = hasLabel && !isFloated;
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
                    <Group
                      className={styled.slot("field", state, [fieldParts.container, styles.field])}
                    >
                      {isMultiple && (
                        <AriaComboBoxValue
                          className={({ isPlaceholder }) =>
                            styled.slot("value", state, [
                              fieldParts.value,
                              typeScale.bodyLarge,
                              styles.value,
                              isPlaceholder && fieldParts.placeholder,
                            ]) ?? ""
                          }
                        />
                      )}
                      <Input
                        placeholder={placeholder}
                        className={styled.slot("input", state, [
                          fieldParts.input,
                          typeScale.bodyLarge,
                          isResting && fieldParts.inputResting,
                        ])}
                      />
                      {indicator !== undefined && (
                        <Button className={indicator}>
                          <GlyphIcon glyph="arrowDropDown" />
                        </Button>
                      )}
                    </Group>
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
            </WithInput>
          );
        }}
      </AriaComboBox>
    </UnstyledScope>
  );
}

export interface ComboBoxValueProps<T extends object>
  extends Omit<AriaComboBoxValueProps<T>, "className">, StyledProps<ComboBoxValueRenderProps<T>> {
  ref?: Ref<HTMLDivElement>;
}

const comboBoxValueVariants = defineVariants({}, {});

export function ComboBoxValue<T extends object>({
  className,
  classNames,
  unstyled,
  ...props
}: ComboBoxValueProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: comboBoxValueVariants,
      styles: (_, { isPlaceholder }: ComboBoxValueRenderProps<T>) => [
        fieldParts.value,
        typeScale.bodyLarge,
        isPlaceholder && fieldParts.placeholder,
      ],
      reset: [],
    },
  );

  return <AriaComboBoxValue {...props} className={styled.className} />;
}
