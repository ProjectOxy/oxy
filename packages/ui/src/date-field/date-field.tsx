import type { Ref } from "react";
import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  type DateFieldRenderProps,
  DateInput as AriaDateInput,
  type DateValue,
} from "react-aria-components";
import { typeScale } from "../collection/type.ts";
import type { StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { fieldParts } from "../select/field.ts";
import { DateSegment } from "./date-input.tsx";
import {
  dateFieldStyles,
  FieldChrome,
  useFocusWithin,
  useSegmentFieldStyled,
  type FieldChromeProps,
  type SegmentFieldClassNames,
} from "./field.tsx";

export type DateFieldSlot = "label" | "field" | "description" | "fieldError";

export interface DateFieldProps<T extends DateValue>
  extends
    Omit<AriaDateFieldProps<T>, "className" | "children">,
    Omit<StyledProps<DateFieldRenderProps, DateFieldSlot>, "classNames">,
    FieldChromeProps {
  classNames?: SegmentFieldClassNames<DateFieldSlot, DateFieldRenderProps>;
  ref?: Ref<HTMLDivElement>;
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  className,
  classNames,
  unstyled,
  onFocusChange,
  ...props
}: DateFieldProps<T>) {
  const [isFocused, setFocused] = useFocusWithin(onFocusChange);
  const { segment, ...slotClassNames } = classNames ?? {};
  const styled = useSegmentFieldStyled(
    { className, classNames: slotClassNames, unstyled },
    label != null,
    () => isFocused,
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaDateField {...props} onFocusChange={setFocused} className={styled.className}>
        {(state) => (
          <FieldChrome
            slot={styled.slot}
            state={state}
            label={label}
            description={description}
            errorMessage={errorMessage}
          >
            <AriaDateInput
              className={styled.slot("field", state, [
                fieldParts.container,
                dateFieldStyles.field,
                dateFieldStyles.input,
                typeScale.bodyLarge,
              ])}
            >
              {(part) => <DateSegment segment={part} className={segment} />}
            </AriaDateInput>
          </FieldChrome>
        )}
      </AriaDateField>
    </UnstyledScope>
  );
}
