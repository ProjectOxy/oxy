import type { Meta, StoryObj } from "@storybook/react-vite";
import { OxyProvider } from "../provider/index.ts";
import { Button, buttonVariants } from "./button.tsx";

const {
  variant: variants,
  size: sizes,
  tone: tones,
  shape: shapes,
  density: densities,
} = buttonVariants.groups;

const meta = {
  title: "Actions/Button",
  component: Button,
  args: { children: "Save" },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-md">
      {tones.map((tone) => (
        <div key={tone} className="flex flex-wrap items-center gap-md">
          {variants.map((variant) => (
            <Button key={variant} {...args} className={`${variant} ${tone}`}>
              {`${variant} ${tone}`}
            </Button>
          ))}
          <Button {...args} className={tone} isDisabled>
            disabled
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const SizesAndShapes: Story = {
  render: (args) => (
    <div className="grid gap-md">
      {shapes.map((shape) => (
        <div key={shape} className="flex flex-wrap items-center gap-md">
          {sizes.map((size) => (
            <Button key={size} {...args} className={`${shape} ${size}`}>
              {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {densities.map((density) => (
        <Button key={density} {...args} className={`tonal ${density}`}>
          {density}
        </Button>
      ))}
    </div>
  ),
};

export const Utilities: Story = {
  args: {
    className:
      "tonal lg square bg-tertiary-container text-on-tertiary-container rounded-none px-3xl",
    children: "Utilities win",
  },
};

export const ClassNameFunction: Story = {
  args: {
    className: ({ isHovered, isPressed }) =>
      isPressed ? "filled square" : isHovered ? "tonal" : "outlined",
    children: "Hover and press",
  },
};

export const Slots: Story = {
  args: {
    className: "outlined md",
    classNames: {
      stateLayer: ({ isPressed }) => (isPressed ? "bg-tertiary" : "bg-primary"),
    },
    children: "Tinted state layer",
  },
};

export const Unstyled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      <Button {...args} unstyled>
        Behavior only
      </Button>
      <Button
        {...args}
        unstyled
        className="bg-inverse-surface text-inverse-on-surface px-lg py-sm rounded-xs type-label-large hover:bg-primary hover:text-on-primary"
      >
        Brand from scratch
      </Button>
    </div>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <div className="flex flex-wrap items-center gap-md">
        <Button {...args} className="md">
          <span aria-hidden>★</span>
          حفظ
        </Button>
        <Button {...args} className="md tonal square">
          <span aria-hidden>★</span>
          إرسال
        </Button>
      </div>
    </OxyProvider>
  ),
};
