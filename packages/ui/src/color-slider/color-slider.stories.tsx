import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorThumb } from "../color-thumb/color-thumb.tsx";
import { Label } from "../label/label.tsx";
import { OxyProvider } from "../provider/index.ts";
import { SliderOutput, SliderTrack } from "../slider/slider.tsx";
import { ColorSlider, type ColorSliderProps } from "./color-slider.tsx";

const meta = {
  title: "Color/ColorSlider",
  component: ColorSlider,
  args: { channel: "hue", defaultValue: "hsl(210, 80%, 45%)" },
} satisfies Meta<typeof ColorSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

const Example = (props: ColorSliderProps) => (
  <ColorSlider {...props}>
    <Label />
    <SliderOutput />
    <SliderTrack>
      <ColorThumb />
    </SliderTrack>
  </ColorSlider>
);

export const Default: Story = {
  render: (args) => <Example {...args} />,
};

export const Channels: Story = {
  render: () => (
    <div className="grid gap-lg">
      <Example channel="red" defaultValue="rgb(200, 80, 40)" />
      <Example channel="green" defaultValue="rgb(200, 80, 40)" />
      <Example channel="blue" defaultValue="rgb(200, 80, 40)" />
      <Example channel="saturation" defaultValue="hsl(150, 60%, 40%)" />
      <Example channel="lightness" defaultValue="hsl(150, 60%, 40%)" />
      <Example channel="alpha" defaultValue="hsla(280, 70%, 50%, 0.6)" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-2xl">
      <Example orientation="vertical" channel="hue" defaultValue="hsl(40, 90%, 50%)" />
      <Example orientation="vertical" channel="alpha" defaultValue="hsla(200, 90%, 40%, 0.4)" />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => <Example {...args} isDisabled />,
};

export const Slots: Story = {
  render: (args) => (
    <Example
      {...args}
      classNames={{
        label: "type-title-medium",
        output: "text-primary",
        track: "rounded-xs",
        thumb: ({ isDisabled }) => (isDisabled ? "" : "rounded-sm"),
      }}
    />
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <ColorSlider {...args} unstyled className="grid gap-xs">
      <Label className="type-label-medium" />
      <SliderTrack className="h-lg rounded-xs" style={{ inlineSize: 240 }}>
        <ColorThumb className="size-lg rounded-xs border" style={{ top: "50%" }} />
      </SliderTrack>
    </ColorSlider>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <Example channel="saturation" defaultValue="hsl(0, 70%, 50%)" />
    </OxyProvider>
  ),
};
