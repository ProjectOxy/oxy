import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { Input } from "../input/input.tsx";
import { TextField } from "../text-field/text-field.tsx";
import { Group } from "./group.tsx";

const meta = {
  title: "Forms/Group",
  component: Group,
} satisfies Meta<typeof Group>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Group aria-label="Formatting">
      <Button className="tonal xs">Bold</Button>
      <Button className="tonal xs">Italic</Button>
    </Group>
  ),
};

export const FieldContainer: Story = {
  render: () => (
    <TextField aria-label="Amount" className="outlined" defaultValue="42">
      <Group>
        <span aria-hidden>€</span>
        <Input />
        <Button className="text xs">Max</Button>
      </Group>
    </TextField>
  ),
};
