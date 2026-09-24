import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link, linkVariants } from "./link.tsx";

const { tone: tones, decoration: decorations } = linkVariants.groups;

const meta = {
  title: "Actions/Link",
  component: Link,
  args: { href: "#", children: "Read the guidelines" },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-md">
      {decorations.map((decoration) => (
        <div key={decoration} className="flex flex-wrap gap-lg">
          {tones.map((tone) => (
            <Link key={tone} {...args} className={`${decoration} ${tone}`}>
              {`${decoration} ${tone}`}
            </Link>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <p className="flex gap-lg type-body-large">
      <Link {...args}>Default</Link>
      <Link {...args} aria-current="page">
        Current page
      </Link>
      <Link {...args} isDisabled>
        Disabled
      </Link>
    </p>
  ),
};

export const InText: Story = {
  render: (args) => (
    <p className="type-body-large max-w-full">
      Links inherit the surrounding type scale: <Link {...args}>open the release notes</Link> or
      read the{" "}
      <Link {...args} className="plain">
        changelog
      </Link>
      .
    </p>
  ),
};

export const Utilities: Story = {
  args: { className: "plain text-tertiary type-title-large hover:text-primary" },
};

export const ClassNameFunction: Story = {
  args: {
    className: ({ isHovered }) => (isHovered ? "underlined secondary" : "plain"),
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: "text-on-surface type-label-large hover:text-primary",
  },
};
