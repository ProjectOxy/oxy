import type { Ref } from "react";
import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DatePickerRenderProps,
  type DateValue,
} from "react-aria-components";
import { Calendar } from "../calendar/calendar.tsx";
import type { StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import {
  FieldChrome,
  useSegmentFieldStyled,
  type FieldChromeProps,
  type SegmentFieldClassNames,
} from "../date-field/field.tsx";
import { isPickerFocused, PickerParts, type PickerSlot } from "../date-field/picker.tsx";

export type DatePickerSlot = PickerSlot;

export interface DatePickerProps<T extends DateValue>
  extends
    Omit<AriaDatePickerProps<T>, "className" | "children">,
    Omit<StyledProps<DatePickerRenderProps, DatePickerSlot>, "classNames">,
    FieldChromeProps {
  classNames?: SegmentFieldClassNames<DatePickerSlot, DatePickerRenderProps>;
  ref?: Ref<HTMLDivElement>;
}

export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  className,
  classNames,
  unstyled,
  ...props
}: DatePickerProps<T>) {
  const { segment, calendar, ...slotClassNames } = classNames ?? {};
  const styled = useSegmentFieldStyled(
    { className, classNames: slotClassNames, unstyled },
    label != null,
    isPickerFocused,
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaDatePicker {...props} className={styled.className}>
        {(state) => (
          <FieldChrome
            slot={styled.slot}
            state={state}
            label={label}
            description={description}
            errorMessage={errorMessage}
          >
            <PickerParts
              state={state}
              slot={styled.slot}
              variants={styled.variants(state)}
              calendarClassName={calendar}
              segmentClassName={segment}
              inputs={(input) => input()}
              calendar={(calendarClassName) => <Calendar className={calendarClassName} />}
            />
          </FieldChrome>
        )}
      </AriaDatePicker>
    </UnstyledScope>
  );
}
