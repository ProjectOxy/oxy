import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationItem } from "../navigation-item/navigation-item.tsx";
import { Separator } from "../separator/separator.tsx";
import {
  ModalNavigationDrawer,
  NavigationDrawer,
  NavigationSection,
} from "./navigation-drawer.tsx";

const folders = [
  { id: "inbox", label: "Inbox", icon: "✉", badge: "24" },
  { id: "outbox", label: "Outbox", icon: "➤" },
  { id: "favorites", label: "Favorites", icon: "♡" },
  { id: "trash", label: "Trash", icon: "✕" },
];

const labels = ["Family", "School", "Work"];

const content = (
  <>
    <NavigationSection title="Mail">
      {folders.map(({ id, label, icon, badge }) => (
        <NavigationItem
          key={id}
          href={`#${id}`}
          icon={icon}
          badge={badge}
          aria-current={id === "inbox" ? "page" : undefined}
        >
          {label}
        </NavigationItem>
      ))}
    </NavigationSection>
    <Separator className="inset my-sm" />
    <NavigationSection title="Labels">
      {labels.map((label) => (
        <NavigationItem key={label} href={`#${label}`} icon="◆">
          {label}
        </NavigationItem>
      ))}
    </NavigationSection>
  </>
);

const meta = {
  title: "Navigation/NavigationDrawer",
  component: NavigationDrawer,
  args: { "aria-label": "Mail" },
  render: (args) => (
    <div style={{ blockSize: 560 }}>
      <NavigationDrawer {...args}>{content}</NavigationDrawer>
    </div>
  ),
} satisfies Meta<typeof NavigationDrawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Modal: Story = {
  render: (args) => (
    <ModalNavigationDrawer aria-label={args["aria-label"]} defaultOpen>
      {content}
    </ModalNavigationDrawer>
  ),
};

export const Utilities: Story = {
  args: { className: "bg-surface rounded-e-lg shadow-level1" },
};
