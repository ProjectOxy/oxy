import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input.tsx";

const meta = {
  title: "Forms/Input",
  component: Input,
  args: { "aria-label": "Standalone input", placeholder: "Outside a field" },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Disabled" },
};

export const Unstyled: Story = {
  args: { unstyled: true, className: "px-md py-sm rounded-full bg-surface-container-high" },
};
