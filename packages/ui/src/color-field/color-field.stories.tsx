import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldError } from "../field-error/field-error.tsx";
import { Input } from "../input/input.tsx";
import { Label } from "../label/label.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { ColorField, colorFieldVariants, type ColorFieldProps } from "./color-field.tsx";

const { variant: variants, tone: tones } = colorFieldVariants.groups;

const meta = {
  title: "Color/ColorField",
  component: ColorField,
} satisfies Meta<typeof ColorField>;

export default meta;

type Story = StoryObj<typeof meta>;

const Field = ({
  label,
  description,
  ...props
}: ColorFieldProps & { label: string; description?: string }) => (
  <ColorField {...props}>
    <Label>{label}</Label>
    <Input />
    {description && <Text slot="description">{description}</Text>}
    <FieldError />
  </ColorField>
);

export const Default: Story = {
  render: () => <Field label="Color" defaultValue="#6750a4" description="Hex value" />,
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-lg">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-lg">
          <Field className={variant} label="Empty" />
          <Field className={variant} label="Populated" defaultValue="#006a60" />
        </div>
      ))}
    </div>
  ),
};

export const Channels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-md">
      <Field label="Hue" channel="hue" colorSpace="hsl" defaultValue="hsl(210, 80%, 45%)" />
      <Field label="Saturation" channel="saturation" defaultValue="hsl(210, 80%, 45%)" />
      <Field label="Lightness" channel="lightness" defaultValue="hsl(210, 80%, 45%)" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid gap-md">
      {tones.map((tone) => (
        <Field key={tone} className={`outlined ${tone}`} label={tone} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid gap-md">
      <Field label="Invalid" defaultValue="#6750a4" isInvalid description="Not a brand color" />
      <Field label="Disabled" defaultValue="#6750a4" isDisabled />
      <Field label="Read only" defaultValue="#6750a4" isReadOnly />
    </div>
  ),
};

export const Unstyled: Story = {
  render: () => (
    <ColorField unstyled defaultValue="#b3261e" className="grid gap-xs">
      <Label className="type-label-medium">Plain</Label>
      <Input className="p-sm border border-outline rounded-xs" />
    </ColorField>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <Field label="اللون" defaultValue="#00639b" />
    </OxyProvider>
  ),
};
