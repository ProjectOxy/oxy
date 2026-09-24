import type { Ref } from "react";
import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateRangePickerRenderProps,
  type DateValue,
} from "react-aria-components";
import { RangeCalendar } from "../calendar/calendar.tsx";
import type { StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import {
  dateFieldStyles,
  FieldChrome,
  useSegmentFieldStyled,
  type FieldChromeProps,
  type SegmentFieldClassNames,
} from "../date-field/field.tsx";
import { isPickerFocused, PickerParts, type PickerSlot } from "../date-field/picker.tsx";

export type DateRangePickerSlot = PickerSlot | "separator";

export interface DateRangePickerProps<T extends DateValue>
  extends
    Omit<AriaDateRangePickerProps<T>, "className" | "children">,
    Omit<StyledProps<DateRangePickerRenderProps, DateRangePickerSlot>, "classNames">,
    FieldChromeProps {
  classNames?: SegmentFieldClassNames<DateRangePickerSlot, DateRangePickerRenderProps>;
  ref?: Ref<HTMLDivElement>;
}

export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  className,
  classNames,
  unstyled,
  ...props
}: DateRangePickerProps<T>) {
  const { segment, calendar, ...slotClassNames } = classNames ?? {};
  const styled = useSegmentFieldStyled(
    { className, classNames: slotClassNames, unstyled },
    label != null,
    isPickerFocused,
    dateFieldStyles.range,
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaDateRangePicker {...props} className={styled.className}>
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
              inputs={(input) => (
                <>
                  {input("start")}
                  <span
                    aria-hidden
                    data-slot="separator"
                    className={styled.slot("separator", state, [dateFieldStyles.separator])}
                  >
                    –
                  </span>
                  {input("end")}
                </>
              )}
              calendar={(calendarClassName) => <RangeCalendar className={calendarClassName} />}
            />
          </FieldChrome>
        )}
      </AriaDateRangePicker>
    </UnstyledScope>
  );
}
