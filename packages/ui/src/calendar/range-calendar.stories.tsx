import { parseDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OxyProvider } from "../provider/index.ts";
import { RangeCalendar, calendarVariants } from "./calendar.tsx";

const { tone: tones } = calendarVariants.groups;

const trip = { start: parseDate("2025-02-10"), end: parseDate("2025-02-19") };

const meta = {
  title: "Dates/RangeCalendar",
  component: RangeCalendar,
  args: { "aria-label": "Trip dates", defaultValue: trip },
} satisfies Meta<typeof RangeCalendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-lg">
      {tones.map((tone) => (
        <RangeCalendar key={tone} {...args} className={tone} />
      ))}
    </div>
  ),
};

export const SingleDay: Story = {
  args: { defaultValue: { start: parseDate("2025-02-12"), end: parseDate("2025-02-12") } },
};

export const TwoMonths: Story = {
  args: {
    visibleDuration: { months: 2 },
    defaultValue: { start: parseDate("2025-02-24"), end: parseDate("2025-03-06") },
  },
};

export const Invalid: Story = {
  args: { isInvalid: true, errorMessage: "Trips last at most a week" },
};

export const Utilities: Story = {
  args: {
    className: "secondary compact",
    classNames: {
      cell: ({ isSelectionStart }) => (isSelectionStart ? "type-body-large-emphasized" : ""),
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="he-IL">
      <RangeCalendar {...args} />
    </OxyProvider>
  ),
};
