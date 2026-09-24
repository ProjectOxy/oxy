import { parseDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { dateFieldVariants } from "../date-field/field.tsx";
import { OxyProvider } from "../provider/index.ts";
import { DateRangePicker } from "./date-range-picker.tsx";

const { variant: variants } = dateFieldVariants.groups;

const trip = { start: parseDate("2025-02-10"), end: parseDate("2025-02-19") };

const meta = {
  title: "Dates/DateRangePicker",
  component: DateRangePicker,
  args: { label: "Trip", placeholderValue: parseDate("2025-02-01") },
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: "Check-in – check-out" },
};

export const Open: Story = {
  args: { defaultOpen: true, defaultValue: trip },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-lg">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-lg">
          <DateRangePicker {...args} className={variant} label="Empty" />
          <DateRangePicker {...args} className={variant} label="Populated" defaultValue={trip} />
          <DateRangePicker
            {...args}
            className={variant}
            label="Invalid"
            validationBehavior="aria"
            defaultValue={trip}
            maxValue={parseDate("2025-02-15")}
            errorMessage="Return before the 15th"
          />
          <DateRangePicker
            {...args}
            className={variant}
            label="Disabled"
            isDisabled
            defaultValue={trip}
          />
        </div>
      ))}
    </div>
  ),
};

export const Utilities: Story = {
  args: {
    className: "outlined secondary",
    defaultValue: trip,
    classNames: { separator: "text-secondary", field: "rounded-lg" },
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    defaultValue: trip,
    className: "inline-flex flex-col gap-xs",
    classNames: {
      label: "type-label-medium text-on-surface-variant",
      field:
        "flex items-center gap-sm px-md py-sm rounded-full bg-surface-container-high text-on-surface",
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <DateRangePicker {...args} label="الرحلة" defaultOpen defaultValue={trip} />
    </OxyProvider>
  ),
};
