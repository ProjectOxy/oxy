import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../avatar/avatar.tsx";
import { Button } from "../button/button.tsx";
import { Card } from "../card/card.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Skeleton, skeletonVariants } from "./skeleton.tsx";

const meta = {
  title: "Display/Skeleton",
  component: Skeleton,
  render: (args) => (
    <div className="type-body-large" style={{ inlineSize: 280 }}>
      <Skeleton {...args} />
    </div>
  ),
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shapes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md type-body-large" style={{ inlineSize: 280 }}>
      {skeletonVariants.groups.shape.map((shape) => (
        <Skeleton key={shape} {...args} className={shape} />
      ))}
    </div>
  ),
};

export const Animations: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md type-body-large" style={{ inlineSize: 280 }}>
      {skeletonVariants.groups.animation.map((animation) => (
        <Skeleton key={animation} {...args} className={`rect ${animation}`} />
      ))}
    </div>
  ),
};

export const CardPlaceholder: Story = {
  render: (args) => (
    <Card className="flex-row gap-lg items-center" style={{ inlineSize: 320 }}>
      <Skeleton {...args} className="circle" />
      <div className="flex flex-col grow type-body-large">
        <Skeleton {...args} />
        <Skeleton {...args} className="type-body-medium" style={{ inlineSize: "60%" }} />
      </div>
    </Card>
  ),
};

export const SizedByContent: Story = {
  render: (args) => (
    <div className="flex items-center gap-md">
      <Skeleton {...args} className="circle">
        <Avatar className="lg">AK</Avatar>
      </Skeleton>
      <Skeleton {...args} className="rect rounded-full">
        <Button>Continue</Button>
      </Skeleton>
    </div>
  ),
};

export const Utilities: Story = {
  args: { className: "rect bg-primary-container rounded-xl h-3xl" },
};

export const Unstyled: Story = {
  args: { unstyled: true, className: "bg-surface-container-high rounded-sm h-xl" },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <div className="flex flex-col gap-sm type-body-large" style={{ inlineSize: 280 }}>
        <Skeleton {...args} className="wave" />
        <Skeleton {...args} className="wave" style={{ inlineSize: "60%" }} />
      </div>
    </OxyProvider>
  ),
};
