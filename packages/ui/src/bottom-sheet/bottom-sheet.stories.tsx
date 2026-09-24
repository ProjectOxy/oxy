import { Icon, contentCopy, download, link, mail, share } from "@oxy/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Button } from "../button/button.tsx";
import { DialogTrigger } from "../dialog/dialog.tsx";
import { Heading } from "../heading/heading.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { BottomSheet } from "./bottom-sheet.tsx";

const actions = [
  { icon: link, label: "Copy link" },
  { icon: mail, label: "Email" },
  { icon: share, label: "Share" },
  { icon: download, label: "Download" },
  { icon: contentCopy, label: "Duplicate" },
];

function Content({ title, description }: { title: ReactNode; description: ReactNode }) {
  return (
    <>
      <Heading slot="title">{title}</Heading>
      <Text>{description}</Text>
      <div className="grid grid-cols-5 gap-sm">
        {actions.map(({ icon, label }) => (
          <Button key={label} aria-label={label} className="tonal md">
            <Icon icon={icon} />
          </Button>
        ))}
      </div>
    </>
  );
}

const meta = {
  title: "Overlays/BottomSheet",
  component: BottomSheet,
  render: (args) => (
    <BottomSheet {...args} defaultOpen>
      <Content title="Share album" description="Drag the handle down or tap the scrim to close." />
    </BottomSheet>
  ),
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Trigger: Story = {
  render: (args) => (
    <DialogTrigger>
      <Button className="tonal">Share</Button>
      <BottomSheet {...args}>
        <Content title="Share album" description="Opened from a DialogTrigger." />
      </BottomSheet>
    </DialogTrigger>
  ),
};

export const Utilities: Story = {
  args: {
    className: "bg-surface-container-high rounded-none",
    classNames: { dialog: "gap-sm px-lg" },
  },
};

export const RTL: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <BottomSheet {...args} defaultOpen>
        <Content title="مشاركة الألبوم" description="اسحب المقبض لأسفل للإغلاق." />
      </BottomSheet>
    </OxyProvider>
  ),
};
