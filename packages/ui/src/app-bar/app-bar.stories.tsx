import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { AppBar } from "./app-bar.tsx";

const actions = (
  <>
    <Button className="text" aria-label="Attach">
      ⎘
    </Button>
    <Button className="text" aria-label="More">
      ⋮
    </Button>
  </>
);

const meta = {
  title: "Navigation/AppBar",
  component: AppBar,
  args: {
    title: "Inbox",
    leading: (
      <Button className="text" aria-label="Back">
        ←
      </Button>
    ),
    trailing: actions,
  },
} satisfies Meta<typeof AppBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Centered: Story = {
  args: { className: "center", subtitle: "24 unread" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-lg">
      {["small", "medium", "large"].map((size) => (
        <AppBar key={size} {...args} className={size} title={`${size} title`} subtitle="Subtitle" />
      ))}
    </div>
  ),
};

export const Scrolled: Story = {
  args: { className: "scrolled" },
};

export const Slots: Story = {
  args: {
    className: "medium",
    classNames: { title: "text-primary", subtitle: "text-tertiary", trailing: "gap-xs" },
    subtitle: "Slots",
  },
};

export const Utilities: Story = {
  args: { className: "bg-primary-container text-on-primary-container rounded-xl" },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: "flex items-center gap-md p-sm border border-outline",
    classNames: { title: "m-none type-title-medium" },
  },
};
