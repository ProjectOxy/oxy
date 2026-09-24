import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldError } from "../field-error/field-error.tsx";
import { Label } from "../label/label.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { Radio, RadioButton, RadioField, RadioGroup, radioVariants } from "./radio-group.tsx";

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <Label>Delivery</Label>
      <Radio value="standard">Standard</Radio>
      <Radio value="express">Express</Radio>
      <Radio value="pickup" isDisabled>
        Pickup
      </Radio>
      <Text slot="description">Express arrives the next day</Text>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup orientation="horizontal" defaultValue="m" isInvalid>
      <Label>Size</Label>
      <Radio value="s">S</Radio>
      <Radio value="m">M</Radio>
      <Radio value="l">L</Radio>
      <FieldError>This size is out of stock</FieldError>
    </RadioGroup>
  ),
};

export const Tones: Story = {
  render: () => (
    <RadioGroup aria-label="Tones" orientation="horizontal" defaultValue="primary">
      {radioVariants.groups.tone.map((tone) => (
        <Radio key={tone} value={tone} className={tone}>
          {tone}
        </Radio>
      ))}
    </RadioGroup>
  ),
};

export const Fields: Story = {
  render: () => (
    <RadioGroup aria-label="Plan" defaultValue="pro">
      <RadioField value="free">
        <RadioButton>Free</RadioButton>
        <Text slot="description">Up to three projects</Text>
      </RadioField>
      <RadioField value="pro">
        <RadioButton className="tertiary">Pro</RadioButton>
        <Text slot="description">Unlimited projects</Text>
      </RadioField>
    </RadioGroup>
  ),
};

export const Unstyled: Story = {
  render: () => (
    <RadioGroup unstyled aria-label="Answer" defaultValue="yes" className="flex gap-md">
      <Radio
        value="yes"
        className={({ isSelected }) =>
          isSelected
            ? "px-md py-xs rounded-full bg-primary text-on-primary"
            : "px-md py-xs rounded-full border border-outline"
        }
      >
        Yes
      </Radio>
      <Radio
        value="no"
        className={({ isSelected }) =>
          isSelected
            ? "px-md py-xs rounded-full bg-primary text-on-primary"
            : "px-md py-xs rounded-full border border-outline"
        }
      >
        No
      </Radio>
    </RadioGroup>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <RadioGroup defaultValue="a">
        <Label>التوصيل</Label>
        <Radio value="a">عادي</Radio>
        <Radio value="b">سريع</Radio>
      </RadioGroup>
    </OxyProvider>
  ),
};
