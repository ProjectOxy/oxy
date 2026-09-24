import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../input/input.tsx";
import { TextField } from "../text-field/text-field.tsx";
import { Label } from "./label.tsx";

const meta = {
  title: "Forms/Label",
  component: Label,
  args: { children: "Label" },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InAField: Story = {
  render: () => (
    <div className="flex flex-wrap gap-lg">
      <TextField>
        <Label>Floats inside the field</Label>
        <Input />
      </TextField>
      <TextField unstyled className="grid gap-xs">
        <Label className="type-title-small text-primary">Sits above the field</Label>
        <Input className="px-md py-sm border border-outline rounded-xs" />
      </TextField>
    </div>
  ),
};
