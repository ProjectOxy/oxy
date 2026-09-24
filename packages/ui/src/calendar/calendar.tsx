import { duration, easing } from "@oxy/motion/motion.stylex";
import { calendar } from "@oxy/tokens/component.stylex";
import { color, space, state as stateToken } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { CalendarDate } from "@internationalized/date";
import { use, type ReactNode, type Ref } from "react";
import {
  Button,
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  type CalendarCellProps as AriaCalendarCellProps,
  type CalendarCellRenderProps,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  type CalendarGridBodyProps as AriaCalendarGridBodyProps,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
  type CalendarGridProps as AriaCalendarGridProps,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
  CalendarHeading as AriaCalendarHeading,
  type CalendarHeadingProps as AriaCalendarHeadingProps,
  CalendarMonthPicker as AriaCalendarMonthPicker,
  type CalendarMonthPickerProps as AriaCalendarMonthPickerProps,
  type CalendarProps as AriaCalendarProps,
  type CalendarRenderProps,
  CalendarYearPicker as AriaCalendarYearPicker,
  type CalendarYearPickerProps as AriaCalendarYearPickerProps,
  type DateValue,
  Heading,
  type Key,
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps,
  type RangeCalendarRenderProps,
  RangeCalendarStateContext,
  Text,
  composeRenderProps,
} from "react-aria-components";
import { GlyphIcon } from "../collection/glyphs.tsx";
import { useStaticClassName, type StaticStyledProps } from "../collection/static.ts";
import { typeScale } from "../collection/type.ts";
import type { ClassNameValue, SlotClassNames } from "../core/class-names.ts";
import type { Styles } from "../core/parts.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { ListBoxItem } from "../list-box/list-box.tsx";
import { Select, type SelectProps } from "../select/select.tsx";
import { densities } from "../styles/density.ts";
import { focusRing, stateLayerStyles } from "../styles/interaction.ts";
import { tones } from "../styles/tone.ts";
import { density, tone } from "../styles/vars.stylex.ts";

type CalendarSelectionMode = "single" | "multiple";

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${stateToken["--oxy-state-disabled-content"]} * 100%), transparent)`;
const cellHeight = `calc(${calendar["--oxy-calendar-cell-height"]} - ${density.offset})`;
const daySize = `calc(${calendar["--oxy-calendar-day-size"]} - ${density.offset})`;
const dayLayer = (opacity: string) =>
  `linear-gradient(color-mix(in srgb, currentColor calc(${opacity} * 100%), transparent), color-mix(in srgb, currentColor calc(${opacity} * 100%), transparent))`;

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "inline-flex",
    flexDirection: "column",
    maxInlineSize: "100%",
    padding: calendar["--oxy-calendar-padding"],
    color: color["--oxy-color-on-surface"],
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: space["--oxy-space-xs"],
    minBlockSize: `calc(${calendar["--oxy-calendar-header-height"]} - ${density.offset})`,
  },
  heading: {
    flexGrow: 1,
    minInlineSize: 0,
    margin: 0,
    paddingInline: space["--oxy-space-md"],
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: color["--oxy-color-on-surface-variant"],
  },
  nav: {
    appearance: "none",
    position: "relative",
    boxSizing: "border-box",
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    inlineSize: calendar["--oxy-calendar-nav-size"],
    blockSize: calendar["--oxy-calendar-nav-size"],
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: calendar["--oxy-calendar-day-radius"],
    backgroundColor: "transparent",
    color: color["--oxy-color-on-surface-variant"],
    cursor: "pointer",
    "--oxy-icon-size": calendar["--oxy-calendar-icon-size"],
    WebkitTapHighlightColor: "transparent",
  },
  navDisabled: {
    color: disabledContent,
    cursor: "default",
  },
  months: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: calendar["--oxy-calendar-month-gap"],
    maxInlineSize: "100%",
  },
  grid: {
    inlineSize: `calc(7 * ${calendar["--oxy-calendar-cell-width"]})`,
    maxInlineSize: "100%",
    tableLayout: "fixed",
    borderCollapse: "collapse",
    borderSpacing: 0,
  },
  headerCell: {
    blockSize: cellHeight,
    padding: 0,
    color: color["--oxy-color-on-surface"],
    textAlign: "center",
    fontWeight: "inherit",
  },
  errorMessage: {
    paddingInline: space["--oxy-space-md"],
    paddingBlockStart: space["--oxy-space-xs"],
    color: color["--oxy-color-error"],
  },
});

const cell = stylex.create({
  root: {
    position: "relative",
    isolation: "isolate",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    blockSize: cellHeight,
    outlineStyle: "none",
    color: color["--oxy-color-on-surface"],
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    "::before": {
      content: "''",
      position: "absolute",
      zIndex: -1,
      insetInline: 0,
      insetBlockStart: "50%",
      blockSize: daySize,
      translate: "0 -50%",
      backgroundColor: "transparent",
      transitionProperty: "background-color",
      transitionDuration: duration.effectsFast,
      transitionTimingFunction: easing.effectsFast,
    },
  },
  hidden: {
    display: "none",
  },
  inRange: {
    color: tone.onContainer,
    "::before": { backgroundColor: tone.container },
  },
  rangeStart: {
    "::before": { insetInlineStart: "50%" },
  },
  rangeEnd: {
    "::before": { insetInlineEnd: "50%" },
  },
  invalid: {
    [tone.color]: color["--oxy-color-error"],
    [tone.onColor]: color["--oxy-color-on-error"],
    [tone.container]: color["--oxy-color-error-container"],
    [tone.onContainer]: color["--oxy-color-on-error-container"],
  },
  disabled: {
    color: disabledContent,
    cursor: "default",
  },
  unavailable: {
    color: disabledContent,
    textDecorationLine: "line-through",
    cursor: "default",
  },
});

const day = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    inlineSize: `min(${daySize}, 100%)`,
    blockSize: daySize,
    borderRadius: calendar["--oxy-calendar-day-radius"],
    backgroundColor: "transparent",
    backgroundImage: "none",
    transitionProperty: "background-color, color, box-shadow",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  hovered: { backgroundImage: dayLayer(stateToken["--oxy-state-hover"]) },
  focused: { backgroundImage: dayLayer(stateToken["--oxy-state-focus"]) },
  pressed: { backgroundImage: dayLayer(stateToken["--oxy-state-pressed"]) },
  today: {
    color: tone.color,
    boxShadow: `inset 0 0 0 ${calendar["--oxy-calendar-today-outline-width"]} ${tone.color}`,
  },
  selected: {
    backgroundColor: tone.color,
    color: tone.onColor,
    boxShadow: "none",
  },
  disabledToday: {
    color: "inherit",
    boxShadow: `inset 0 0 0 ${calendar["--oxy-calendar-today-outline-width"]} currentColor`,
  },
});

const focusVisibleRing = stylex.create({
  root: {
    outlineStyle: "solid",
  },
});

const noVariants = defineVariants({}, {});

export const calendarVariants = defineVariants(
  {
    tone: ["primary", "secondary", "tertiary", "error"],
    density: ["comfortable", "compact", "dense"],
  },
  { tone: "primary", density: "comfortable" },
);

export type CalendarVariants = VariantSelection<typeof calendarVariants.groups>;

export type CalendarSlot =
  | "header"
  | "heading"
  | "previous"
  | "next"
  | "months"
  | "grid"
  | "errorMessage";

type CellClassName = ClassNameValue<
  CalendarCellRenderProps & { defaultClassName: string | undefined }
>;

type CalendarClassNames<State> = SlotClassNames<CalendarSlot, State> & { cell?: CellClassName };

interface CalendarContentProps<State> {
  state: State & { isInvalid: boolean };
  visibleMonths: number;
  errorMessage: ReactNode;
  cellClassName: CellClassName | undefined;
  slot: (name: CalendarSlot, state: State, styles: Styles) => string | undefined;
}

function CalendarContent<State>({
  state,
  visibleMonths,
  errorMessage,
  cellClassName,
  slot,
}: CalendarContentProps<State>) {
  const grids = Array.from({ length: visibleMonths }, (_, index) => (
    <CalendarGrid key={index} offset={{ months: index }} className={slot("grid", state, [])}>
      {(date) => <CalendarCell date={date} className={cellClassName} />}
    </CalendarGrid>
  ));

  return (
    <>
      <header data-slot="header" className={slot("header", state, [styles.header])}>
        <Heading className={slot("heading", state, [styles.heading, typeScale.titleSmall])} />
        <NavButton
          slot="previous"
          glyph="chevronBackward"
          className={(navState) => slot("previous", state, navStyles(navState))}
        />
        <NavButton
          slot="next"
          glyph="chevronForward"
          className={(navState) => slot("next", state, navStyles(navState))}
        />
      </header>
      {visibleMonths > 1 ? (
        <div data-slot="months" className={slot("months", state, [styles.months])}>
          {grids}
        </div>
      ) : (
        grids
      )}
      {state.isInvalid && errorMessage != null && (
        <Text
          slot="errorMessage"
          className={slot("errorMessage", state, [styles.errorMessage, typeScale.bodySmall])}
        >
          {errorMessage}
        </Text>
      )}
    </>
  );
}

interface NavState {
  isHovered: boolean;
  isPressed: boolean;
  isFocusVisible: boolean;
  isDisabled: boolean;
}

const navStyles = (navState: NavState) => [
  styles.nav,
  focusRing.root,
  navState.isDisabled && styles.navDisabled,
];

function NavButton({
  slot,
  glyph,
  className,
}: {
  slot: "previous" | "next";
  glyph: "chevronBackward" | "chevronForward";
  className: (state: NavState) => string | undefined;
}) {
  return (
    <Button slot={slot} className={(state) => className(state) ?? ""}>
      {(state) => {
        const isStyled = className(state) !== undefined;
        return (
          <>
            {isStyled && (
              <span
                aria-hidden
                data-slot="state-layer"
                {...stylex.props(stateLayerStyles(state))}
              />
            )}
            <GlyphIcon glyph={glyph} />
          </>
        );
      }}
    </Button>
  );
}

const rootStyles = ({ tone: toneName, density: densityName }: CalendarVariants) => [
  styles.root,
  tones[toneName],
  densities[densityName],
];

const visibleMonthsOf = (visibleDuration: { months?: number } | undefined) =>
  Math.max(1, visibleDuration?.months ?? 1);

export interface CalendarProps<T extends DateValue, M extends CalendarSelectionMode = "single">
  extends
    Omit<AriaCalendarProps<T, M>, "className" | "children">,
    Omit<StyledProps<CalendarRenderProps<M>, CalendarSlot>, "classNames"> {
  classNames?: CalendarClassNames<CalendarRenderProps<M>>;
  errorMessage?: ReactNode;
  children?: AriaCalendarProps<T, M>["children"];
  ref?: Ref<HTMLDivElement>;
}

export function Calendar<T extends DateValue, M extends CalendarSelectionMode = "single">({
  className,
  classNames,
  unstyled,
  errorMessage,
  children,
  ...props
}: CalendarProps<T, M>) {
  const { cell: cellClassName, ...slotClassNames } = classNames ?? {};
  const styled = useStyled(
    { className, classNames: slotClassNames, unstyled },
    { variants: calendarVariants, styles: rootStyles, reset: [] },
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaCalendar {...props} className={styled.className}>
        {children ??
          ((state) => (
            <CalendarContent
              state={state}
              visibleMonths={visibleMonthsOf(props.visibleDuration)}
              errorMessage={errorMessage}
              cellClassName={cellClassName}
              slot={styled.slot}
            />
          ))}
      </AriaCalendar>
    </UnstyledScope>
  );
}

export interface RangeCalendarProps<T extends DateValue>
  extends
    Omit<AriaRangeCalendarProps<T>, "className" | "children">,
    Omit<StyledProps<RangeCalendarRenderProps, CalendarSlot>, "classNames"> {
  classNames?: CalendarClassNames<RangeCalendarRenderProps>;
  errorMessage?: ReactNode;
  children?: AriaRangeCalendarProps<T>["children"];
  ref?: Ref<HTMLDivElement>;
}

export function RangeCalendar<T extends DateValue>({
  className,
  classNames,
  unstyled,
  errorMessage,
  children,
  ...props
}: RangeCalendarProps<T>) {
  const { cell: cellClassName, ...slotClassNames } = classNames ?? {};
  const styled = useStyled(
    { className, classNames: slotClassNames, unstyled },
    { variants: calendarVariants, styles: rootStyles, reset: [] },
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaRangeCalendar {...props} className={styled.className}>
        {children ??
          ((state) => (
            <CalendarContent
              state={state}
              visibleMonths={visibleMonthsOf(props.visibleDuration)}
              errorMessage={errorMessage}
              cellClassName={cellClassName}
              slot={styled.slot}
            />
          ))}
      </AriaRangeCalendar>
    </UnstyledScope>
  );
}

export interface CalendarGridProps
  extends Omit<AriaCalendarGridProps, "className" | "children">, StaticStyledProps {
  children?: AriaCalendarGridProps["children"];
  ref?: Ref<HTMLTableElement>;
}

const defaultCell = (date: CalendarDate) => <CalendarCell date={date} />;

export function CalendarGrid({
  className,
  unstyled,
  children = defaultCell,
  ...props
}: CalendarGridProps) {
  return (
    <AriaCalendarGrid
      {...props}
      className={useStaticClassName({ className, unstyled }, [styles.grid, typeScale.bodyLarge])}
    >
      {typeof children === "function" ? (
        <>
          <CalendarGridHeader unstyled={unstyled}>
            {(weekday) => <CalendarHeaderCell unstyled={unstyled}>{weekday}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGridBody unstyled={unstyled}>{children}</CalendarGridBody>
        </>
      ) : (
        children
      )}
    </AriaCalendarGrid>
  );
}

export interface CalendarGridHeaderProps
  extends Omit<AriaCalendarGridHeaderProps, "className">, StaticStyledProps {
  ref?: Ref<HTMLTableSectionElement>;
}

export function CalendarGridHeader({ className, unstyled, ...props }: CalendarGridHeaderProps) {
  return (
    <AriaCalendarGridHeader
      {...props}
      className={useStaticClassName({ className, unstyled }, [])}
    />
  );
}

export interface CalendarHeaderCellProps
  extends Omit<AriaCalendarHeaderCellProps, "className">, StaticStyledProps {
  ref?: Ref<HTMLTableCellElement>;
}

export function CalendarHeaderCell({ className, unstyled, ...props }: CalendarHeaderCellProps) {
  return (
    <AriaCalendarHeaderCell
      {...props}
      className={useStaticClassName({ className, unstyled }, [styles.headerCell])}
    />
  );
}

export interface CalendarGridBodyProps
  extends Omit<AriaCalendarGridBodyProps, "className">, StaticStyledProps {
  ref?: Ref<HTMLTableSectionElement>;
}

export function CalendarGridBody({ className, unstyled, ...props }: CalendarGridBodyProps) {
  return (
    <AriaCalendarGridBody {...props} className={useStaticClassName({ className, unstyled }, [])} />
  );
}

export type CalendarCellSlot = "day";

export interface CalendarCellProps
  extends
    Omit<AriaCalendarCellProps, "className">,
    StyledProps<CalendarCellRenderProps, CalendarCellSlot> {
  ref?: Ref<HTMLTableCellElement>;
}

interface CellShape {
  isRange: boolean;
  isFilled: boolean;
}

const cellShape = (state: CalendarCellRenderProps, isRange: boolean): CellShape => ({
  isRange,
  isFilled: state.isSelected && (!isRange || state.isSelectionStart || state.isSelectionEnd),
});

const isInert = (state: CalendarCellRenderProps) => state.isDisabled || state.isUnavailable;

const cellStyles = (state: CalendarCellRenderProps, { isRange }: CellShape) => {
  const isBand = isRange && state.isSelected && !(state.isSelectionStart && state.isSelectionEnd);
  return [
    cell.root,
    state.isInvalid && cell.invalid,
    isBand && cell.inRange,
    isBand && state.isSelectionStart && cell.rangeStart,
    isBand && state.isSelectionEnd && cell.rangeEnd,
    state.isDisabled && cell.disabled,
    state.isUnavailable && cell.unavailable,
    state.isOutsideMonth && cell.hidden,
  ];
};

const dayStyles = (state: CalendarCellRenderProps, { isFilled }: CellShape) => [
  day.root,
  focusRing.root,
  state.isFocusVisible && focusVisibleRing.root,
  !isInert(state) &&
    ((state.isPressed && day.pressed) ||
      (state.isFocusVisible && day.focused) ||
      (state.isHovered && day.hovered)),
  state.isToday && day.today,
  state.isToday && isInert(state) && day.disabledToday,
  isFilled && day.selected,
];

export function CalendarCell({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: CalendarCellProps) {
  const isRange = use(RangeCalendarStateContext) !== null;
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: noVariants,
      styles: (_, state: CalendarCellRenderProps) => cellStyles(state, cellShape(state, isRange)),
      reset: [],
    },
  );

  return (
    <AriaCalendarCell {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const content = children ?? state.formattedDate;
        const dayClassName = styled.slot("day", state, dayStyles(state, cellShape(state, isRange)));
        return dayClassName === undefined ? (
          content
        ) : (
          <span data-slot="day" className={dayClassName}>
            {content}
          </span>
        );
      })}
    </AriaCalendarCell>
  );
}

export interface CalendarHeadingProps
  extends Omit<AriaCalendarHeadingProps, "className">, StaticStyledProps {
  ref?: Ref<HTMLHeadingElement>;
}

export function CalendarHeading({ className, unstyled, ...props }: CalendarHeadingProps) {
  return (
    <AriaCalendarHeading
      {...props}
      className={useStaticClassName({ className, unstyled }, [
        styles.heading,
        typeScale.titleSmall,
      ])}
    />
  );
}

type PickerSelectProps = Pick<
  SelectProps<object>,
  "className" | "classNames" | "unstyled" | "label" | "isDisabled"
>;

export interface CalendarMonthPickerProps
  extends Omit<AriaCalendarMonthPickerProps, "children">, PickerSelectProps {
  children?: AriaCalendarMonthPickerProps["children"];
}

export function CalendarMonthPicker({ format, children, ...select }: CalendarMonthPickerProps) {
  return (
    <AriaCalendarMonthPicker format={format}>
      {children ?? ((picker) => <PickerSelect {...picker} {...select} />)}
    </AriaCalendarMonthPicker>
  );
}

export interface CalendarYearPickerProps
  extends Omit<AriaCalendarYearPickerProps, "children">, PickerSelectProps {
  children?: AriaCalendarYearPickerProps["children"];
}

export function CalendarYearPicker({
  format,
  visibleYears,
  children,
  ...select
}: CalendarYearPickerProps) {
  return (
    <AriaCalendarYearPicker format={format} visibleYears={visibleYears}>
      {children ?? ((picker) => <PickerSelect {...picker} {...select} />)}
    </AriaCalendarYearPicker>
  );
}

interface PickerItem {
  id: number;
  formatted: string;
}

function PickerSelect({
  items,
  value,
  onChange,
  "aria-label": ariaLabel,
  ...select
}: PickerSelectProps & {
  items: PickerItem[];
  value: Key;
  onChange: (key: Key | null) => void;
  "aria-label": string;
}) {
  return (
    <Select
      {...select}
      aria-label={select.label == null ? ariaLabel : undefined}
      items={items}
      value={value}
      onChange={onChange}
    >
      {(item) => <ListBoxItem id={item.id}>{item.formatted}</ListBoxItem>}
    </Select>
  );
}
