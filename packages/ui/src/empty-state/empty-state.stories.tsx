import { Icon, add, inbox, refresh, searchOff } from "@oxy/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { Card } from "../card/card.tsx";
import { OxyProvider } from "../provider/index.ts";
import { EmptyState, emptyStateVariants } from "./empty-state.tsx";

const meta = {
  title: "Display/EmptyState",
  component: EmptyState,
  args: {
    icon: <Icon icon={inbox} />,
    headline: "No messages yet",
    description: "Messages you receive from your team will show up here.",
    children: (
      <>
        <Button className="tonal">
          <Icon icon={refresh} />
          Refresh
        </Button>
        <Button>
          <Icon icon={add} />
          New message
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-md">
      {emptyStateVariants.groups.tone.map((tone) => (
        <Card key={tone} className="filled p-none" style={{ inlineSize: 220 }}>
          <EmptyState {...args} className={tone} description={undefined}>
            {undefined}
          </EmptyState>
        </Card>
      ))}
    </div>
  ),
};

export const AlignStart: Story = {
  args: { className: "start", icon: <Icon icon={searchOff} />, headline: "Nothing found" },
};

export const Minimal: Story = {
  args: { icon: undefined, children: undefined },
};

export const Utilities: Story = {
  args: { className: "tertiary bg-surface-container rounded-xl gap-lg" },
};

export const Slots: Story = {
  args: {
    classNames: {
      icon: "rounded-lg bg-secondary text-on-secondary",
      headline: "type-display-small",
      actions: "flex-col",
    },
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: "flex flex-col items-start gap-sm p-lg",
    classNames: { headline: "type-title-medium m-none", description: "m-none" },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <EmptyState
        {...args}
        className="start"
        headline="لا توجد رسائل"
        description="ستظهر هنا الرسائل التي تتلقاها من فريقك."
      />
    </OxyProvider>
  ),
};
