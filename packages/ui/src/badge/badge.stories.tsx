import { Icon, mail, notifications } from "@oxy/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Badge, badgeVariants } from "./badge.tsx";

const meta = {
  title: "Display/Badge",
  component: Badge,
  args: { value: 3 },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-md">
      <Badge {...args} value={undefined} aria-label="New" />
      <Badge {...args} value={8} />
      <Badge {...args} value={42} />
      <Badge {...args} value={1200} />
      <Badge {...args} value={1200} max={99} />
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex items-center gap-md">
      {badgeVariants.groups.tone.map((tone) => (
        <Badge key={tone} {...args} className={tone} />
      ))}
    </div>
  ),
};

export const OnIcons: Story = {
  render: (args) => (
    <div className="flex items-center gap-xl">
      <Badge {...args} aria-label="3 unread messages">
        <Icon icon={mail} />
      </Badge>
      <Badge {...args} value={undefined} aria-label="New notifications">
        <Icon icon={notifications} />
      </Badge>
      <Badge {...args} value={1000}>
        <Icon icon={mail} />
      </Badge>
      <Button className="text" aria-label="Inbox, 12 unread">
        <Badge value={12}>
          <Icon icon={mail} />
        </Badge>
      </Button>
    </div>
  ),
};

export const Utilities: Story = {
  args: { value: 5, className: "tertiary rounded-xs px-sm" },
};

export const Slots: Story = {
  args: {
    value: 7,
    classNames: { anchor: "p-xs rounded-full bg-surface-container-high" },
    children: <Icon icon={notifications} />,
  },
};

export const Unstyled: Story = {
  args: {
    value: 5,
    unstyled: true,
    className: "px-xs rounded-sm bg-inverse-surface text-inverse-on-surface",
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <div className="flex items-center gap-xl">
        <Badge {...args} value={1200}>
          <Icon icon={mail} />
        </Badge>
        <Badge {...args} value={undefined}>
          <Icon icon={notifications} />
        </Badge>
        <Badge {...args} value={42} />
      </div>
    </OxyProvider>
  ),
};
