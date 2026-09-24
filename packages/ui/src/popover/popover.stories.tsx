import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../avatar/avatar.tsx";
import { Button } from "../button/button.tsx";
import { Dialog, DialogActions, DialogTrigger } from "../dialog/dialog.tsx";
import { Heading } from "../heading/heading.tsx";
import { Link } from "../link/link.tsx";
import { OverlayArrow } from "../overlay-arrow/overlay-arrow.tsx";
import { PreviewTrigger } from "../preview-trigger/preview-trigger.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { Popover } from "./popover.tsx";

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  args: { placement: "bottom" },
  render: (args) => (
    <div className="flex justify-center p-3xl">
      <DialogTrigger defaultOpen>
        <Button className="tonal">Storage</Button>
        <Popover {...args}>
          <OverlayArrow />
          <Dialog style={{ inlineSize: 280 }}>
            <Heading slot="title">Storage almost full</Heading>
            <Text>You have used 14.2 GB of your 15 GB plan.</Text>
            <DialogActions>
              <Button slot="close" className="text">
                Later
              </Button>
              <Button slot="close" className="text">
                Upgrade
              </Button>
            </DialogActions>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </div>
  ),
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placements: Story = {
  args: { placement: "end" },
};

export const Utilities: Story = {
  args: { className: "bg-primary-container text-on-primary-container rounded-sm" },
};

export const Preview: Story = {
  render: () => (
    <div className="p-3xl">
      <PreviewTrigger defaultOpen>
        <Link href="#ada">Ada Lovelace</Link>
        <Popover placement="bottom start">
          <Dialog aria-label="Ada Lovelace" className="flex-row items-center gap-md">
            <Avatar>AL</Avatar>
            <div className="flex flex-col">
              <span className="type-title-small text-on-surface">Ada Lovelace</span>
              <span>Mathematician</span>
            </div>
            <Button className="tonal xs">Follow</Button>
          </Dialog>
        </Popover>
      </PreviewTrigger>
    </div>
  ),
};

export const RTL: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <div className="flex justify-center p-3xl">
        <DialogTrigger defaultOpen>
          <Button className="tonal">التخزين</Button>
          <Popover {...args} placement="end">
            <OverlayArrow />
            <Dialog style={{ inlineSize: 240 }}>
              <Heading slot="title">المساحة ممتلئة تقريبًا</Heading>
              <Text>استخدمت ١٤٫٢ غيغابايت من ١٥.</Text>
            </Dialog>
          </Popover>
        </DialogTrigger>
      </div>
    </OxyProvider>
  ),
};
