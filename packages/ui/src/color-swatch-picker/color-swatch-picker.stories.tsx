import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatch } from "../color-swatch/color-swatch.tsx";
import { OxyProvider } from "../provider/index.ts";
import {
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  colorSwatchPickerVariants,
  type ColorSwatchPickerProps,
} from "./color-swatch-picker.tsx";

const { size: sizes } = colorSwatchPickerVariants.groups;

const palette = ["#6750a4", "#b3261e", "#7d5260", "#006a60", "#00639b", "#8b5000", "#ffffff"];

const meta = {
  title: "Color/ColorSwatchPicker",
  component: ColorSwatchPicker,
  args: { defaultValue: "#006a60" },
} satisfies Meta<typeof ColorSwatchPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

const Example = (props: ColorSwatchPickerProps) => (
  <ColorSwatchPicker {...props}>
    {palette.map((color) => (
      <ColorSwatchPickerItem key={color} color={color}>
        <ColorSwatch />
      </ColorSwatchPickerItem>
    ))}
  </ColorSwatchPicker>
);

export const Default: Story = {
  render: (args) => <Example {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-lg">
      {sizes.map((size) => (
        <Example key={size} {...args} className={size} />
      ))}
    </div>
  ),
};

export const Square: Story = {
  render: (args) => <Example {...args} className="square md" />,
};

export const Stack: Story = {
  render: (args) => <Example {...args} layout="stack" />,
};

export const Disabled: Story = {
  render: (args) => (
    <ColorSwatchPicker {...args}>
      {palette.slice(0, 4).map((color, index) => (
        <ColorSwatchPickerItem key={color} color={color} isDisabled={index === 1}>
          <ColorSwatch />
        </ColorSwatchPickerItem>
      ))}
    </ColorSwatchPicker>
  ),
};

export const Slots: Story = {
  render: (args) => (
    <Example
      {...args}
      className="lg gap-md"
      classNames={{
        item: ({ isSelected }) => (isSelected ? "shadow-level3" : ""),
        swatch: ({ isSelected }) => (isSelected ? "rounded-md" : ""),
      }}
    />
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <ColorSwatchPicker {...args} unstyled className="flex gap-xs">
      {palette.map((color) => (
        <ColorSwatchPickerItem
          key={color}
          color={color}
          className={({ isSelected }) => (isSelected ? "border border-on-surface p-2xs" : "p-2xs")}
        >
          <ColorSwatch className="size-xl" />
        </ColorSwatchPickerItem>
      ))}
    </ColorSwatchPicker>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <Example {...args} />
    </OxyProvider>
  ),
};
