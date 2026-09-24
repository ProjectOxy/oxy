import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "react-aria-components";
import { Card } from "../card/card.tsx";
import { ColorArea } from "../color-area/color-area.tsx";
import { ColorField } from "../color-field/color-field.tsx";
import { ColorSlider } from "../color-slider/color-slider.tsx";
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "../color-swatch-picker/color-swatch-picker.tsx";
import { ColorSwatch } from "../color-swatch/color-swatch.tsx";
import { ColorThumb } from "../color-thumb/color-thumb.tsx";
import { ColorWheel, ColorWheelTrack } from "../color-wheel/color-wheel.tsx";
import { Input } from "../input/input.tsx";
import { Label } from "../label/label.tsx";
import { OxyProvider } from "../provider/index.ts";
import { SliderOutput, SliderTrack } from "../slider/slider.tsx";

const meta = {
  title: "Color/ColorPicker",
  component: ColorPicker,
  args: { defaultValue: "#6750a4", children: null },
} satisfies Meta<typeof ColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

const palette = ["#6750a4", "#b3261e", "#006a60", "#00639b", "#8b5000"];

const HexField = () => (
  <div className="flex items-center gap-md">
    <ColorSwatch className="md" />
    <ColorField className="outlined dense grow">
      <Label>Hex</Label>
      <Input />
    </ColorField>
  </div>
);

const Presets = () => (
  <ColorSwatchPicker>
    {palette.map((color) => (
      <ColorSwatchPickerItem key={color} color={color}>
        <ColorSwatch />
      </ColorSwatchPickerItem>
    ))}
  </ColorSwatchPicker>
);

const Panel = () => (
  <Card className="grid gap-lg w-fit">
    <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness">
      <ColorThumb />
    </ColorArea>
    <ColorSlider colorSpace="hsb" channel="hue">
      <Label />
      <SliderOutput />
      <SliderTrack>
        <ColorThumb />
      </SliderTrack>
    </ColorSlider>
    <ColorSlider channel="alpha">
      <Label />
      <SliderOutput />
      <SliderTrack>
        <ColorThumb />
      </SliderTrack>
    </ColorSlider>
    <HexField />
    <Presets />
  </Card>
);

export const Default: Story = {
  render: (args) => (
    <ColorPicker {...args}>
      <Panel />
    </ColorPicker>
  ),
};

export const Wheel: Story = {
  render: (args) => (
    <ColorPicker {...args}>
      <Card className="grid gap-lg w-fit">
        <ColorWheel>
          <ColorWheelTrack />
          <ColorThumb />
        </ColorWheel>
        <ColorSlider colorSpace="hsl" channel="lightness">
          <Label />
          <SliderOutput />
          <SliderTrack>
            <ColorThumb />
          </SliderTrack>
        </ColorSlider>
        <HexField />
      </Card>
    </ColorPicker>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <ColorPicker {...args}>
        <Panel />
      </ColorPicker>
    </OxyProvider>
  ),
};
