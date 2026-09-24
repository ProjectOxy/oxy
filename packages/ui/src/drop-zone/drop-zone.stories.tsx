import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../text/text.tsx";
import { DropZone } from "./drop-zone.tsx";

const meta = {
  title: "Forms/DropZone",
  component: DropZone,
  args: { children: <Text slot="label">Drop files here</Text> },
} satisfies Meta<typeof DropZone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { className: "filled secondary" },
};

export const DropTarget: Story = {
  args: {
    className: "tertiary",
    children: ({ isDropTarget }) => (
      <Text slot="label">{isDropTarget ? "Release to upload" : "Drag a photo here"}</Text>
    ),
  },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const Utilities: Story = {
  args: { className: "filled rounded-2xl p-3xl bg-tertiary-container text-on-tertiary-container" },
};
