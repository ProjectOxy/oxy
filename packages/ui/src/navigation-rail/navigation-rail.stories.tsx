import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { Fab } from "../fab/fab.tsx";
import { NavigationItem } from "../navigation-item/navigation-item.tsx";
import { NavigationRail } from "./navigation-rail.tsx";

const destinations = [
  { id: "inbox", label: "Inbox", icon: "✉", badge: "12" },
  { id: "chat", label: "Chat", icon: "☏", badge: true },
  { id: "rooms", label: "Rooms", icon: "▦" },
  { id: "meet", label: "Meet", icon: "▶" },
];

const meta = {
  title: "Navigation/NavigationRail",
  component: NavigationRail,
  args: { "aria-label": "Mail" },
  render: (args) => (
    <div style={{ blockSize: 480 }}>
      <NavigationRail {...args}>
        <Button className="text" aria-label="Menu">
          ≡
        </Button>
        <Fab className="tonal mb-lg" aria-label="Compose">
          ✎
        </Fab>
        {destinations.map(({ id, label, icon, badge }) => (
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
      </NavigationRail>
    </div>
  ),
} satisfies Meta<typeof NavigationRail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Expanded: Story = {
  args: { className: "expanded" },
};

export const Utilities: Story = {
  args: { className: "bg-surface-container rounded-e-xl" },
};
