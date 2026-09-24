import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationItem } from "../navigation-item/navigation-item.tsx";
import { NavigationBar } from "./navigation-bar.tsx";

const destinations = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "search", label: "Search", icon: "⌕" },
  { id: "saved", label: "Saved", icon: "♡", badge: "3" },
  { id: "profile", label: "Profile", icon: "☺", badge: true },
];

const meta = {
  title: "Navigation/NavigationBar",
  component: NavigationBar,
  args: { "aria-label": "Main" },
  render: (args) => (
    <NavigationBar {...args}>
      {destinations.map(({ id, label, icon, badge }) => (
        <NavigationItem
          key={id}
          href={`#${id}`}
          icon={icon}
          badge={badge}
          aria-current={id === "home" ? "page" : undefined}
        >
          {label}
        </NavigationItem>
      ))}
    </NavigationBar>
  ),
} satisfies Meta<typeof NavigationBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  args: { className: "vertical" },
};

export const Horizontal: Story = {
  args: { className: "horizontal" },
};

export const Compact: Story = {
  render: (args) => (
    <div style={{ inlineSize: 360 }}>{meta.render({ ...args, className: "vertical" })}</div>
  ),
};

export const Utilities: Story = {
  args: { className: "vertical bg-surface-container-highest rounded-xl" },
};

export const Unstyled: Story = {
  render: (args) => (
    <NavigationBar {...args} unstyled className="flex gap-md">
      {destinations.map(({ id, label }) => (
        <NavigationItem
          key={id}
          href={`#${id}`}
          aria-current={id === "home" ? "page" : undefined}
          className={({ isCurrent }) => (isCurrent ? "text-primary" : "")}
        >
          {label}
        </NavigationItem>
      ))}
    </NavigationBar>
  ),
};
