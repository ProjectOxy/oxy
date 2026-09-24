import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { Group } from "../group/group.tsx";
import { Input } from "../input/input.tsx";
import { Label } from "../label/label.tsx";
import { Text } from "../text/text.tsx";
import { NumberField, numberFieldVariants, type NumberFieldProps } from "./number-field.tsx";

const meta = {
  title: "Forms/NumberField",
  component: NumberField,
} satisfies Meta<typeof NumberField>;

export default meta;

type Story = StoryObj<typeof meta>;

const Stepper = ({ label, ...props }: NumberFieldProps & { label: string }) => (
  <NumberField {...props}>
    <Label>{label}</Label>
    <Group>
      <Button slot="decrement" className="text xs">
        −
      </Button>
      <Input />
      <Button slot="increment" className="text xs">
        +
      </Button>
    </Group>
    <Text slot="description">Between 1 and 10</Text>
  </NumberField>
);

export const Default: Story = {
  render: () => <Stepper label="Guests" defaultValue={2} minValue={1} maxValue={10} />,
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-lg">
      {numberFieldVariants.groups.variant.map((variant) => (
        <Stepper key={variant} className={variant} label={variant} defaultValue={3} />
      ))}
      <Stepper className="outlined" label="Disabled" defaultValue={3} isDisabled />
    </div>
  ),
};

export const Currency: Story = {
  render: () => (
    <NumberField
      className="outlined"
      defaultValue={1250.5}
      formatOptions={{ style: "currency", currency: "EUR" }}
    >
      <Label>Price</Label>
      <Input />
    </NumberField>
  ),
};

export const Unstyled: Story = {
  render: () => (
    <NumberField unstyled defaultValue={4} className="grid gap-xs">
      <Label>Behavior only</Label>
      <Group className="flex gap-xs">
        <Button slot="decrement">−</Button>
        <Input className="px-sm" />
        <Button slot="increment">+</Button>
      </Group>
    </NumberField>
  ),
};
