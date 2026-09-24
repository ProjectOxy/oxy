import { CalendarDate, isWeekend, parseDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLocale } from "react-aria-components";
import { OxyProvider } from "../provider/index.ts";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarMonthPicker,
  CalendarYearPicker,
  calendarVariants,
} from "./calendar.tsx";

const { tone: tones, density: densities } = calendarVariants.groups;

const meta = {
  title: "Dates/Calendar",
  component: Calendar,
  args: { "aria-label": "Event date", defaultValue: parseDate("2025-02-12") },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-lg">
      {tones.map((tone) => (
        <Calendar key={tone} {...args} className={tone} />
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      {densities.map((density) => (
        <Calendar key={density} {...args} className={density} />
      ))}
    </div>
  ),
};

export const MultipleSelection: Story = {
  render: () => (
    <Calendar
      aria-label="Shifts"
      selectionMode="multiple"
      defaultValue={["2025-02-04", "2025-02-05", "2025-02-19"].map((date) => parseDate(date))}
    />
  ),
};

function WorkdaysOnly() {
  const { locale } = useLocale();
  return (
    <Calendar
      aria-label="Appointment"
      defaultFocusedValue={parseDate("2025-02-12")}
      minValue={parseDate("2025-02-06")}
      maxValue={parseDate("2025-02-25")}
      isDateUnavailable={(date) => isWeekend(date, locale)}
    />
  );
}

export const Unavailable: Story = {
  render: () => <WorkdaysOnly />,
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      <Calendar {...args} isInvalid errorMessage="Pick a weekday" />
      <Calendar {...args} isDisabled />
      <Calendar {...args} isReadOnly />
    </div>
  ),
};

export const TwoMonths: Story = {
  args: { visibleDuration: { months: 2 } },
};

export const MonthAndYearPickers: Story = {
  render: (args) => (
    <Calendar {...args}>
      <div className="flex gap-sm px-sm">
        <CalendarMonthPicker className="outlined dense w-auto flex-1" />
        <CalendarYearPicker className="outlined dense w-auto flex-1" />
      </div>
      <CalendarGrid />
    </Calendar>
  ),
};

export const Utilities: Story = {
  args: {
    className: "tertiary bg-surface-container-low rounded-xl",
    classNames: {
      heading: "type-title-large text-on-surface",
      cell: ({ isSelected }) => (isSelected ? "" : "text-secondary"),
    },
  },
};

export const CustomCells: Story = {
  render: (args) => (
    <Calendar {...args}>
      <CalendarGrid weekdayStyle="short">
        {(date) => (
          <CalendarCell
            date={date}
            classNames={{ day: ({ isSelected }) => (isSelected ? "rounded-sm" : "rounded-full") }}
          />
        )}
      </CalendarGrid>
    </Calendar>
  ),
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: "inline-flex flex-col gap-sm p-md bg-surface-container rounded-lg text-on-surface",
    classNames: {
      header: "flex items-center gap-sm",
      heading: "flex-1 type-title-medium",
      cell: ({ isSelected }) =>
        `flex justify-center p-xs rounded-sm ${isSelected ? "bg-primary text-on-primary" : ""}`,
    },
  },
};

export const Calendars: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-lg">
      {[
        ["fa-IR-u-ca-persian", "Persian"],
        ["ar-SA-u-ca-islamic-umalqura", "Hijri"],
        ["th-TH-u-ca-buddhist", "Buddhist"],
        ["ja-JP-u-ca-japanese", "Japanese"],
      ].map(([locale, name]) => (
        <OxyProvider key={locale} locale={locale}>
          <Calendar aria-label={name} defaultValue={new CalendarDate(2025, 2, 12)} />
        </OxyProvider>
      ))}
    </div>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <Calendar {...args} />
    </OxyProvider>
  ),
};
