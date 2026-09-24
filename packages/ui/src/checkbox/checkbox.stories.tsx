import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldError } from "../field-error/field-error.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { Checkbox, CheckboxButton, CheckboxField, checkboxVariants } from "./checkbox.tsx";

const { tone: tones, density: densities } = checkboxVariants.groups;

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  args: { children: "Remember me" },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid">
      <Checkbox>Unselected</Checkbox>
      <Checkbox defaultSelected>Selected</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isInvalid>Invalid</Checkbox>
      <Checkbox isInvalid defaultSelected>
        Invalid selected
      </Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isDisabled defaultSelected>
        Disabled selected
      </Checkbox>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap">
      {tones.map((tone) => (
        <Checkbox key={tone} className={tone} defaultSelected>
          {tone}
        </Checkbox>
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: () => (
    <div className="grid">
      {densities.map((density) => (
        <Checkbox key={density} className={density} defaultSelected>
          {density}
        </Checkbox>
      ))}
    </div>
  ),
};

export const Field: Story = {
  render: () => (
    <CheckboxField isRequired isInvalid>
      <CheckboxButton>I accept the terms</CheckboxButton>
      <Text slot="description">You can read them at any time</Text>
      <FieldError>Accept the terms to continue</FieldError>
    </CheckboxField>
  ),
};

export const Slots: Story = {
  args: {
    defaultSelected: true,
    classNames: {
      box: ({ isSelected }) => (isSelected ? "rounded-full bg-tertiary" : "rounded-full"),
      stateLayer: "bg-tertiary",
    },
    children: "Round tertiary box",
  },
};

export const Unstyled: Story = {
  render: () => (
    <div className="grid gap-sm">
      <Checkbox unstyled>Behavior only</Checkbox>
      <Checkbox
        unstyled
        className="flex items-center gap-sm type-body-large"
        classNames={{
          control: ({ isSelected }) =>
            isSelected
              ? "size-lg rounded-xs bg-primary"
              : "size-lg rounded-xs border border-outline",
        }}
      >
        Brand from scratch
      </Checkbox>
    </div>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <Checkbox defaultSelected>تذكرني</Checkbox>
    </OxyProvider>
  ),
};
