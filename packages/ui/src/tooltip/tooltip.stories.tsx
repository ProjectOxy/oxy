import { Icon, info, save } from "@oxy/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { Heading } from "../heading/heading.tsx";
import { OverlayArrow } from "../overlay-arrow/overlay-arrow.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { Tooltip, TooltipTrigger } from "./tooltip.tsx";

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  render: (args) => (
    <div className="flex justify-center p-3xl">
      <TooltipTrigger isOpen>
        <Button aria-label="Save" className="tonal">
          <Icon icon={save} />
        </Button>
        <Tooltip {...args}>Save to drive</Tooltip>
      </TooltipTrigger>
    </div>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Plain: Story = {};

export const Placements: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-3xl p-3xl">
      {(["top", "bottom", "start", "end"] as const).map((placement) => (
        <TooltipTrigger key={placement} isOpen>
          <Button className="outlined">{placement}</Button>
          <Tooltip {...args} placement={placement}>
            <OverlayArrow />
            {`Tooltip at ${placement}`}
          </Tooltip>
        </TooltipTrigger>
      ))}
    </div>
  ),
};

export const Rich: Story = {
  render: (args) => (
    <div className="flex justify-center p-3xl">
      <TooltipTrigger isOpen>
        <Button aria-label="About sync" className="text">
          <Icon icon={info} />
        </Button>
        <Tooltip {...args} className="rich" placement="bottom">
          <Heading>Sync is paused</Heading>
          <Text>Changes stay on this device until you reconnect to the internet.</Text>
        </Tooltip>
      </TooltipTrigger>
    </div>
  ),
};

export const Utilities: Story = {
  args: { className: "bg-tertiary text-on-tertiary rounded-full px-md" },
};

export const RTL: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <div className="flex justify-center p-3xl">
        <TooltipTrigger isOpen>
          <Button className="tonal">حفظ</Button>
          <Tooltip {...args} placement="end">
            <OverlayArrow />
            احفظ في المساحة
          </Tooltip>
        </TooltipTrigger>
      </div>
    </OxyProvider>
  ),
};
