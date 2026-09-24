import type { Ref } from "react";
import {
  DateInput as AriaDateInput,
  type DateFieldRenderProps,
  TimeField as AriaTimeField,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue,
} from "react-aria-components";
import { typeScale } from "../collection/type.ts";
import type { StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { DateSegment } from "../date-field/date-input.tsx";
import {
  dateFieldStyles,
  FieldChrome,
  useFocusWithin,
  useSegmentFieldStyled,
  type FieldChromeProps,
  type SegmentFieldClassNames,
} from "../date-field/field.tsx";
import { fieldParts } from "../select/field.ts";

export type TimeFieldSlot = "label" | "field" | "description" | "fieldError";

export interface TimeFieldProps<T extends TimeValue>
  extends
    Omit<AriaTimeFieldProps<T>, "className" | "children">,
    Omit<StyledProps<DateFieldRenderProps, TimeFieldSlot>, "classNames">,
    FieldChromeProps {
  classNames?: SegmentFieldClassNames<TimeFieldSlot, DateFieldRenderProps>;
  ref?: Ref<HTMLDivElement>;
}

export function TimeField<T extends TimeValue>({
  label,
  description,
  errorMessage,
  className,
  classNames,
  unstyled,
  onFocusChange,
  ...props
}: TimeFieldProps<T>) {
  const [isFocused, setFocused] = useFocusWithin(onFocusChange);
  const { segment, ...slotClassNames } = classNames ?? {};
  const styled = useSegmentFieldStyled(
    { className, classNames: slotClassNames, unstyled },
    label != null,
    () => isFocused,
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaTimeField {...props} onFocusChange={setFocused} className={styled.className}>
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
      </AriaTimeField>
    </UnstyledScope>
  );
}
