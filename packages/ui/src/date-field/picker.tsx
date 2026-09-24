import { presence } from "@oxy/motion";
import type { ReactNode } from "react";
import { Button, DateInput as AriaDateInput, Dialog, Group, Popover } from "react-aria-components";
import { GlyphIcon } from "../collection/glyphs.tsx";
import { typeScale } from "../collection/type.ts";
import { joinClassNames, resolveClassName, type ClassNameValue } from "../core/class-names.ts";
import type { Styles } from "../core/parts.ts";
import { dropdownOffset, fieldParts } from "../select/field.ts";
import { DateSegment } from "./date-input.tsx";
import {
  dateFieldStyles,
  triggerStyles,
  type DateFieldVariants,
  type SegmentClassName,
} from "./field.tsx";

export type PickerSlot =
  | "label"
  | "field"
  | "input"
  | "trigger"
  | "description"
  | "fieldError"
  | "popover"
  | "dialog"
  | "calendar";

export interface PickerState {
  isInvalid: boolean;
  isDisabled: boolean;
  isOpen: boolean;
  isFocusWithin: boolean;
}

export const isPickerFocused = (state: PickerState) => state.isFocusWithin || state.isOpen;

interface PickerPartsProps<State extends PickerState> {
  state: State;
  slot: (
    name: "field" | "input" | "trigger" | "popover" | "dialog",
    state: State,
    styles: Styles,
  ) => string | undefined;
  variants: DateFieldVariants | undefined;
  calendarClassName: ClassNameValue<State> | undefined;
  inputs: (input: (slot?: "start" | "end") => ReactNode) => ReactNode;
  segmentClassName: SegmentClassName | undefined;
  calendar: (className: string | undefined) => ReactNode;
}

export function PickerParts<State extends PickerState>({
  state,
  slot,
  variants,
  calendarClassName,
  inputs,
  segmentClassName,
  calendar,
}: PickerPartsProps<State>) {
  const input = (inputSlot?: "start" | "end") => (
    <AriaDateInput
      slot={inputSlot}
      className={slot("input", state, [
        dateFieldStyles.input,
        typeScale.bodyLarge,
        inputSlot === undefined && dateFieldStyles.grow,
      ])}
    >
      {(part) => <DateSegment segment={part} className={segmentClassName} />}
    </AriaDateInput>
  );

  return (
    <>
      <Group className={slot("field", state, [fieldParts.container, dateFieldStyles.field])}>
        {inputs(input)}
        <Button className={slot("trigger", state, triggerStyles(state))}>
          <GlyphIcon glyph="calendar" />
        </Button>
      </Group>
      <Popover
        offset={dropdownOffset}
        placement="bottom start"
        className={slot("popover", state, [dateFieldStyles.popover, presence.scale])}
      >
        <Dialog className={slot("dialog", state, [dateFieldStyles.dialog])}>
          {calendar(
            joinClassNames(
              variants?.tone,
              variants?.density,
              resolveClassName(calendarClassName, state),
            ) || undefined,
          )}
        </Dialog>
      </Popover>
    </>
  );
}
