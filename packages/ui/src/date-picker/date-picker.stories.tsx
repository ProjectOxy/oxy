import { parseDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { dateFieldVariants } from "../date-field/field.tsx";
import { OxyProvider } from "../provider/index.ts";
import { DatePicker } from "./date-picker.tsx";

const { variant: variants, tone: tones } = dateFieldVariants.groups;

const meta = {
  title: "Dates/DatePicker",
  component: DatePicker,
  args: { label: "Date", placeholderValue: parseDate("2025-02-01") },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: "MM/DD/YYYY" },
};

export const Open: Story = {
  args: { defaultOpen: true, defaultValue: parseDate("2025-02-12") },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-lg">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-lg">
          <DatePicker {...args} className={variant} label="Empty" description="Supporting text" />
          <DatePicker
            {...args}
            className={variant}
            label="Populated"
            defaultValue={parseDate("2025-02-12")}
          />
          <DatePicker
            {...args}
            className={variant}
            label="Invalid"
            defaultValue={parseDate("2025-02-12")}
            isInvalid
            errorMessage="Pick a date in March"
          />
          <DatePicker
            {...args}
            className={variant}
            label="Disabled"
            isDisabled
            defaultValue={parseDate("2025-02-12")}
          />
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-lg">
      {tones.map((tone) => (
        <DatePicker
          key={tone}
          {...args}
          className={`outlined ${tone}`}
          label={tone}
          defaultValue={parseDate("2025-02-12")}
        />
      ))}
    </div>
  ),
};

export const OpenTertiary: Story = {
  args: {
    defaultOpen: true,
    className: "outlined tertiary compact",
    defaultValue: parseDate("2025-02-12"),
  },
};

export const Utilities: Story = {
  args: {
    defaultOpen: true,
    defaultValue: parseDate("2025-02-12"),
    className: "w-full",
    classNames: {
      field: "rounded-full",
      popover: "rounded-xl",
      calendar: "secondary",
      trigger: ({ isOpen }) => (isOpen ? "text-tertiary" : ""),
    },
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: "inline-flex flex-col gap-xs",
    classNames: {
      label: "type-label-medium text-on-surface-variant",
      field:
        "flex items-center gap-sm px-md py-sm rounded-full bg-surface-container-high text-on-surface",
    },
    defaultValue: parseDate("2025-02-12"),
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="fa-IR">
      <DatePicker {...args} label="تاریخ" defaultOpen defaultValue={parseDate("2025-02-12")} />
    </OxyProvider>
  ),
};
