import { parseTime } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { dateFieldVariants } from "../date-field/field.tsx";
import { OxyProvider } from "../provider/index.ts";
import { TimeField } from "./time-field.tsx";

const { variant: variants } = dateFieldVariants.groups;

const meta = {
  title: "Dates/TimeField",
  component: TimeField,
  args: { label: "Alarm" },
} satisfies Meta<typeof TimeField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: "Rings every weekday" },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-lg">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-lg">
          <TimeField {...args} className={variant} label="Empty" />
          <TimeField
            {...args}
            className={variant}
            label="Populated"
            defaultValue={parseTime("07:30")}
          />
          <TimeField
            {...args}
            className={variant}
            label="Invalid"
            validationBehavior="aria"
            defaultValue={parseTime("23:15")}
            maxValue={parseTime("20:00")}
            errorMessage="Too late"
          />
          <TimeField
            {...args}
            className={variant}
            label="Disabled"
            isDisabled
            defaultValue={parseTime("07:30")}
          />
        </div>
      ))}
    </div>
  ),
};

export const Seconds: Story = {
  args: { granularity: "second", hourCycle: 24, defaultValue: parseTime("18:05:30") },
};

export const Utilities: Story = {
  args: {
    className: "outlined secondary compact",
    classNames: { field: "rounded-lg", segment: "type-title-medium" },
    defaultValue: parseTime("07:30"),
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: "inline-flex flex-col gap-xs",
    classNames: {
      label: "type-label-medium text-on-surface-variant",
      field:
        "flex px-md py-sm rounded-full bg-surface-container-high text-on-surface type-body-large",
    },
  },
};

export const Locales: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-lg">
      {["en-US", "de-DE", "ja-JP", "ar-EG"].map((locale) => (
        <OxyProvider key={locale} locale={locale}>
          <TimeField {...args} label={locale} defaultValue={parseTime("19:45")} />
        </OxyProvider>
      ))}
    </div>
  ),
};
