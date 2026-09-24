import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "../link/link.tsx";
import { Breadcrumb, Breadcrumbs } from "./breadcrumbs.tsx";

const trail = [
  { id: "home", label: "Home" },
  { id: "components", label: "Components" },
  { id: "navigation", label: "Navigation" },
  { id: "breadcrumbs", label: "Breadcrumbs" },
];

const meta = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  args: { items: trail },
  render: (args) => (
    <Breadcrumbs {...args}>
      {(item: (typeof trail)[number]) => (
        <Breadcrumb>
          <Link href={`#${item.id}`}>{item.label}</Link>
        </Breadcrumb>
      )}
    </Breadcrumbs>
  ),
} satisfies Meta<typeof Breadcrumbs<(typeof trail)[number]>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const Wrapping: Story = {
  render: (args) => (
    <div style={{ inlineSize: 240 }}>
      <Breadcrumbs {...args}>
        {(item: (typeof trail)[number]) => (
          <Breadcrumb>
            <Link href={`#${item.id}`}>{item.label}</Link>
          </Breadcrumb>
        )}
      </Breadcrumbs>
    </div>
  ),
};

export const Slots: Story = {
  render: (args) => (
    <Breadcrumbs {...args} className="type-title-medium">
      {(item: (typeof trail)[number]) => (
        <Breadcrumb classNames={{ link: "text-primary", separator: "text-tertiary" }}>
          <Link href={`#${item.id}`}>{item.label}</Link>
        </Breadcrumb>
      )}
    </Breadcrumbs>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <Breadcrumbs {...args} unstyled className="flex gap-md">
      {(item: (typeof trail)[number]) => (
        <Breadcrumb className="type-label-large">
          <Link href={`#${item.id}`}>{item.label}</Link>
        </Breadcrumb>
      )}
    </Breadcrumbs>
  ),
};
