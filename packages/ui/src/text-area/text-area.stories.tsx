import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./text-area.tsx";

const meta = {
  title: "Forms/TextArea",
  component: TextArea,
  args: { "aria-label": "Standalone text area", placeholder: "Outside a field" },
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  args: { defaultValue: "Several lines\nof text\nmake it grow" },
};
