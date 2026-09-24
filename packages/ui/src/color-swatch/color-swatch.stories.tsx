import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatch, colorSwatchVariants } from "./color-swatch.tsx";

const { size: sizes, shape: shapes } = colorSwatchVariants.groups;

const meta = {
  title: "Color/ColorSwatch",
  component: ColorSwatch,
  args: { color: "#6750a4" },
} satisfies Meta<typeof ColorSwatch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SizesAndShapes: Story = {
  render: (args) => (
    <div className="grid gap-md">
      {shapes.map((shape) => (
        <div key={shape} className="flex items-center gap-md">
          {sizes.map((size) => (
            <ColorSwatch key={size} {...args} className={`${size} ${shape}`} />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Transparency: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      {["#e8def8", "hsla(20, 90%, 50%, 0.7)", "rgba(0, 99, 155, 0.35)", "#0000"].map((color) => (
        <ColorSwatch key={color} color={color} className="lg" />
      ))}
    </div>
  ),
};

export const Utilities: Story = {
  args: { className: "xl square rounded-xl shadow-level2" },
};

export const ClassNameFunction: Story = {
  args: {
    color: "#b3261e",
    className: ({ color }) => (color.getChannelValue("red") > 128 ? "lg square" : "xs"),
  },
};

export const Unstyled: Story = {
  args: { unstyled: true, className: "size-2xl rounded-xs" },
};
