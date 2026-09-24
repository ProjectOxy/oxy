import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../card/card.tsx";
import { Divider } from "./index.ts";

const meta = {
  title: "Display/Divider",
  component: Divider,
  render: (args) => (
    <Card className="outlined p-none type-body-large" style={{ inlineSize: 280 }}>
      <span className="px-lg py-md">Inbox</span>
      <Divider {...args} />
      <span className="px-lg py-md">Sent</span>
      <Divider {...args} className="inset" />
      <span className="px-lg py-md">Archive</span>
    </Card>
  ),
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
