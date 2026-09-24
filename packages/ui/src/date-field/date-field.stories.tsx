import { parseDate, parseDateTime } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateField as AriaDateField, Label } from "react-aria-components";
import { OxyProvider } from "../provider/index.ts";
import { DateInput, DateSegment } from "./date-input.tsx";
import { DateField } from "./date-field.tsx";
import { dateFieldVariants } from "./field.tsx";

const { variant: variants, tone: tones, density: densities } = dateFieldVariants.groups;

const meta = {
  title: "Dates/DateField",
  component: DateField,
  args: { label: "Birthday" },
} satisfies Meta<typeof DateField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: "As on your passport" },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-lg">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-lg">
          <DateField {...args} className={variant} label="Empty" description="Supporting text" />
          <DateField
            {...args}
            className={variant}
            label="Populated"
            defaultValue={parseDate("1990-07-21")}
          />
          <DateField
            {...args}
            className={variant}
            label="Invalid"
            validationBehavior="aria"
            defaultValue={parseDate("2031-01-01")}
            maxValue={parseDate("2025-01-01")}
            errorMessage="Must be in the past"
          />
          <DateField
            {...args}
            className={variant}
            label="Disabled"
            isDisabled
            defaultValue={parseDate("1990-07-21")}
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
        <DateField
          key={tone}
          {...args}
          className={`outlined ${tone}`}
          label={tone}
          autoFocus={tone === "tertiary"}
        />
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      {densities.map((density) => (
        <DateField
          key={density}
          {...args}
          className={density}
          label={density}
          defaultValue={parseDate("1990-07-21")}
        />
      ))}
    </div>
  ),
};

export const Granularity: Story = {
  args: {
    label: "Departure",
    granularity: "minute",
    defaultValue: parseDateTime("2025-02-12T09:45"),
  },
};

export const WithoutLabel: Story = {
  args: { label: undefined, "aria-label": "Birthday" },
};

export const Utilities: Story = {
  args: {
    className: "outlined w-full",
    classNames: {
      field: "rounded-full",
      label: "text-secondary",
      segment: ({ isPlaceholder }) => (isPlaceholder ? "text-outline" : "text-primary"),
    },
    defaultValue: parseDate("1990-07-21"),
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

export const Composition: Story = {
  render: () => (
    <AriaDateField defaultValue={parseDate("1990-07-21")} className="inline-flex flex-col gap-xs">
      <Label className="type-label-large text-on-surface-variant">Standalone input</Label>
      <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
    </AriaDateField>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <div className="flex flex-wrap gap-lg">
        <DateField {...args} label="تاريخ الميلاد" description="كما في جواز السفر" />
        <DateField
          {...args}
          className="outlined"
          label="تاريخ الميلاد"
          defaultValue={parseDate("1990-07-21")}
        />
      </div>
    </OxyProvider>
  ),
};
