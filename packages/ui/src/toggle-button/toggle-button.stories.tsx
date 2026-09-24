import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleButton, toggleButtonVariants } from "./toggle-button.tsx";

const {
  variant: variants,
  size: sizes,
  tone: tones,
  shape: shapes,
  density: densities,
} = toggleButtonVariants.groups;

const meta = {
  title: "Actions/ToggleButton",
  component: ToggleButton,
  args: { children: "Pin" },
} satisfies Meta<typeof ToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { defaultSelected: true },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-md">
      {tones.map((tone) => (
        <div key={tone} className="flex flex-wrap items-center gap-md">
          {variants.map((variant) => (
            <div key={variant} className="flex gap-xs">
              <ToggleButton {...args} className={`${variant} ${tone}`}>
                {variant}
              </ToggleButton>
              <ToggleButton {...args} className={`${variant} ${tone}`} defaultSelected>
                {`${variant} on`}
              </ToggleButton>
            </div>
          ))}
          <ToggleButton {...args} className={tone} isDisabled defaultSelected>
            disabled
          </ToggleButton>
        </div>
      ))}
    </div>
  ),
};

export const SizesAndShapes: Story = {
  render: (args) => (
    <div className="grid gap-md">
      {shapes.map((shape) =>
        [false, true].map((isSelected) => (
          <div key={`${shape}-${isSelected}`} className="flex flex-wrap items-center gap-md">
            {sizes.map((size) => (
              <ToggleButton
                key={size}
                {...args}
                className={`${shape} ${size}`}
                defaultSelected={isSelected}
              >
                {size}
              </ToggleButton>
            ))}
          </div>
        )),
      )}
    </div>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {densities.map((density) => (
        <ToggleButton key={density} {...args} className={`tonal ${density}`}>
          {density}
        </ToggleButton>
      ))}
    </div>
  ),
};

export const Utilities: Story = {
  args: {
    defaultSelected: true,
    className: "outlined md selected:bg-tertiary selected:text-on-tertiary rounded-xs",
    children: "Utilities win",
  },
};

export const ClassNameFunction: Story = {
  args: {
    className: ({ isSelected }) => (isSelected ? "filled square" : "outlined"),
    children: "Toggle me",
  },
};

export const Slots: Story = {
  args: {
    defaultSelected: true,
    className: "tonal md",
    classNames: {
      stateLayer: ({ isSelected }) => (isSelected ? "bg-tertiary" : "bg-primary"),
    },
    children: "Tinted state layer",
  },
};

export const Unstyled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      <ToggleButton {...args} unstyled>
        Behavior only
      </ToggleButton>
      <ToggleButton
        {...args}
        unstyled
        defaultSelected
        className="border border-outline px-lg py-sm rounded-full type-label-large selected:bg-inverse-surface selected:text-inverse-on-surface"
      >
        Brand from scratch
      </ToggleButton>
    </div>
  ),
};
