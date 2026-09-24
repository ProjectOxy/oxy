import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorThumb } from "../color-thumb/color-thumb.tsx";
import { OxyProvider } from "../provider/index.ts";
import { ColorArea } from "./color-area.tsx";

const meta = {
  title: "Color/ColorArea",
  component: ColorArea,
  args: { defaultValue: "hsl(210, 80%, 45%)", children: <ColorThumb /> },
} satisfies Meta<typeof ColorArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Channels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-lg">
      <ColorArea defaultValue="hsb(210, 70%, 80%)" xChannel="saturation" yChannel="brightness">
        <ColorThumb />
      </ColorArea>
      <ColorArea defaultValue="rgb(120, 40, 200)" xChannel="red" yChannel="blue">
        <ColorThumb />
      </ColorArea>
      <ColorArea defaultValue="hsl(30, 90%, 50%)" xChannel="hue" yChannel="lightness">
        <ColorThumb />
      </ColorArea>
    </div>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const Utilities: Story = {
  args: { className: "rounded-none w-full" },
};

export const Slots: Story = {
  args: {
    classNames: { thumb: ({ isDisabled }) => (isDisabled ? "size-lg" : "size-2xl rounded-md") },
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    style: { inlineSize: 160, blockSize: 160 },
    children: <ColorThumb className="size-md rounded-full border border-outline" />,
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="he-IL">
      <ColorArea {...args} />
    </OxyProvider>
  ),
};
