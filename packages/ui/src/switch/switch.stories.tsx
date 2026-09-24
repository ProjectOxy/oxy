import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldError } from "../field-error/field-error.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { Switch, SwitchButton, SwitchField, switchVariants } from "./switch.tsx";

const { tone: tones, icons } = switchVariants.groups;

const meta = {
  title: "Forms/Switch",
  component: Switch,
  args: { children: "Wi-Fi" },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid gap-sm">
      <Switch>Off</Switch>
      <Switch defaultSelected>On</Switch>
      <Switch isDisabled>Disabled off</Switch>
      <Switch isDisabled defaultSelected>
        Disabled on
      </Switch>
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <div className="grid gap-sm">
      {icons.map((icon) => (
        <div key={icon} className="flex gap-lg">
          <Switch className={icon}>{`${icon} off`}</Switch>
          <Switch className={icon} defaultSelected>
            {`${icon} on`}
          </Switch>
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-lg">
      {tones.map((tone) => (
        <Switch key={tone} className={tone} defaultSelected>
          {tone}
        </Switch>
      ))}
    </div>
  ),
};

export const Field: Story = {
  render: () => (
    <SwitchField isInvalid>
      <SwitchButton>Automatic backups</SwitchButton>
      <Text slot="description">Every night at 02:00</Text>
      <FieldError>Storage is full</FieldError>
    </SwitchField>
  ),
};

export const Unstyled: Story = {
  render: () => (
    <Switch
      unstyled
      className="flex items-center gap-sm"
      classNames={{
        track: ({ isSelected }) =>
          isSelected
            ? "flex justify-end w-2xl p-2xs rounded-full bg-tertiary"
            : "flex w-2xl p-2xs rounded-full bg-outline-variant",
        handle: "size-lg rounded-full bg-surface",
      }}
    >
      Brand from scratch
    </Switch>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <Switch defaultSelected className="icons">
        الوضع الليلي
      </Switch>
    </OxyProvider>
  ),
};
