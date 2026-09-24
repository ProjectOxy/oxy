import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../checkbox/checkbox.tsx";
import { FieldError } from "../field-error/field-error.tsx";
import { Label } from "../label/label.tsx";
import { Text } from "../text/text.tsx";
import { CheckboxGroup } from "./checkbox-group.tsx";

const meta = {
  title: "Forms/CheckboxGroup",
  component: CheckboxGroup,
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CheckboxGroup defaultValue={["email"]}>
      <Label>Notify me by</Label>
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
      <Checkbox value="push">Push</Checkbox>
      <Text slot="description">You can change this later</Text>
    </CheckboxGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <CheckboxGroup isInvalid classNames={{ label: "text-error" }}>
      <Label>Pick at least one</Label>
      <Checkbox value="a">Tea</Checkbox>
      <Checkbox value="b">Coffee</Checkbox>
      <FieldError>Choose a drink</FieldError>
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <CheckboxGroup className="flex-row flex-wrap items-center gap-x-lg" defaultValue={["b"]}>
      <Label className="w-full">Sizes</Label>
      <Checkbox value="a">S</Checkbox>
      <Checkbox value="b">M</Checkbox>
      <Checkbox value="c">L</Checkbox>
    </CheckboxGroup>
  ),
};
