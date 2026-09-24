import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorThumb } from "../color-thumb/color-thumb.tsx";
import { OxyProvider } from "../provider/index.ts";
import { ColorWheel, ColorWheelTrack } from "./color-wheel.tsx";

const meta = {
  title: "Color/ColorWheel",
  component: ColorWheel,
  args: {
    defaultValue: "hsl(30, 100%, 50%)",
    children: (
      <>
        <ColorWheelTrack />
        <ColorThumb />
      </>
    ),
  },
} satisfies Meta<typeof ColorWheel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Radii: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-lg">
      <ColorWheel {...args} outerRadius={64} innerRadius={40} />
      <ColorWheel {...args} />
      <ColorWheel {...args} outerRadius={120} innerRadius={104} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const Slots: Story = {
  args: {
    classNames: {
      track: "shadow-level2 rounded-full",
      thumb: ({ isDisabled }) => (isDisabled ? "" : "size-2xl"),
    },
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    children: (
      <>
        <ColorWheelTrack />
        <ColorThumb className="size-lg rounded-full border border-outline" />
      </>
    ),
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="fa-IR">
      <ColorWheel {...args} />
    </OxyProvider>
  ),
};
