import { Icon, person } from "@oxy/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OxyProvider } from "../provider/index.ts";
import { Avatar, avatarVariants } from "./avatar.tsx";

const { size: sizes, tone: tones, shape: shapes } = avatarVariants.groups;

const portrait = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#7d5260"/><circle cx="20" cy="16" r="7" fill="#ffd8e4"/><path d="M6 40a14 12 0 0 1 28 0z" fill="#ffd8e4"/></svg>',
)}`;

const meta = {
  title: "Display/Avatar",
  component: Avatar,
  args: { children: "AK" },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Image: Story = {
  args: { src: portrait, alt: "Anna Karenina" },
};

export const Fallbacks: Story = {
  render: (args) => (
    <div className="flex items-center gap-md">
      <Avatar {...args} alt="Anna Karenina" />
      <Avatar {...args} alt="Unknown user">
        <Icon icon={person} />
      </Avatar>
      <Avatar {...args} src="data:image/png;base64,broken" alt="Broken image" />
    </div>
  ),
};

export const SizesAndShapes: Story = {
  render: (args) => (
    <div className="grid gap-md">
      {shapes.map((shape) => (
        <div key={shape} className="flex items-center gap-md">
          {sizes.map((size) => (
            <Avatar key={size} {...args} className={`${size} ${shape}`} />
          ))}
          <Avatar {...args} className={`lg ${shape}`} src={portrait} alt="Portrait" />
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex items-center gap-md">
      {tones.map((tone) => (
        <Avatar key={tone} {...args} className={tone} />
      ))}
    </div>
  ),
};

export const Utilities: Story = {
  args: { className: "lg square bg-inverse-surface text-inverse-on-surface rounded-xs" },
};

export const Slots: Story = {
  args: {
    className: "xl",
    classNames: {
      fallback: ({ status }) => (status === "error" ? "text-error" : "type-body-large"),
    },
    src: "data:image/png;base64,broken",
    children: "?",
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: "size-2xl rounded-full bg-tertiary text-on-tertiary type-label-large",
    classNames: { fallback: "flex items-center justify-center size-full" },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <div className="flex items-center gap-md">
        <Avatar {...args}>عم</Avatar>
        <Avatar {...args} className="square secondary">
          ر
        </Avatar>
        <Avatar {...args} src={portrait} alt="صورة" />
      </div>
    </OxyProvider>
  ),
};
