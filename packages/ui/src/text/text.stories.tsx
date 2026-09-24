import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../input/input.tsx";
import { Label } from "../label/label.tsx";
import { TextField } from "../text-field/text-field.tsx";
import { Text } from "./text.tsx";

const meta = {
  title: "Forms/Text",
  component: Text,
  args: { children: "Body text in the on-surface-variant role" },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Description: Story = {
  render: () => (
    <TextField>
      <Label>Username</Label>
      <Input />
      <Text slot="description">Letters, digits and underscores</Text>
    </TextField>
  ),
};
