import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator, separatorVariants } from "./separator.tsx";

const meta = {
  title: "Structure/Separator",
  component: Separator,
  render: (args) => (
    <div className="flex flex-col gap-md type-body-medium" style={{ inlineSize: 320 }}>
      {separatorVariants.groups.inset.map((inset) => (
        <div key={inset} className="flex flex-col gap-xs">
          <span className="px-lg">{inset}</span>
          <Separator {...args} className={inset} />
        </div>
      ))}
    </div>
  ),
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  render: (args) => (
    <div className="flex gap-lg type-body-medium" style={{ blockSize: 96 }}>
      {separatorVariants.groups.inset.map((inset) => (
        <div key={inset} className="flex gap-lg">
          <Separator {...args} orientation="vertical" className={inset} />
          <span>{inset}</span>
        </div>
      ))}
    </div>
  ),
};

export const Utilities: Story = {
  render: (args) => (
    <div style={{ inlineSize: 320 }}>
      <Separator {...args} className="border-primary my-lg" />
    </div>
  ),
};
