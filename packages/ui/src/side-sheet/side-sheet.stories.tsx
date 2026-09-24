import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { Checkbox } from "../checkbox/checkbox.tsx";
import { DialogActions, DialogTrigger } from "../dialog/dialog.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Text } from "../text/text.tsx";
import { SideSheet } from "./side-sheet.tsx";

const filters = ["Unread", "Starred", "Has attachments", "From contacts"];

const meta = {
  title: "Overlays/SideSheet",
  component: SideSheet,
  args: { headline: "Filters" },
  render: (args) => (
    <SideSheet {...args} defaultOpen>
      <Text>Narrow the inbox down to the messages you need.</Text>
      {filters.map((filter) => (
        <Checkbox key={filter}>{filter}</Checkbox>
      ))}
      <DialogActions className="justify-start">
        <Button slot="close">Apply</Button>
        <Button slot="close" className="outlined">
          Cancel
        </Button>
      </DialogActions>
    </SideSheet>
  ),
} satisfies Meta<typeof SideSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Trigger: Story = {
  render: (args) => (
    <DialogTrigger>
      <Button className="tonal">Filters</Button>
      <SideSheet {...args}>
        <Text>Opened from a DialogTrigger.</Text>
      </SideSheet>
    </DialogTrigger>
  ),
};

export const WithoutHeadline: Story = {
  args: { headline: undefined, "aria-label": "Details" },
  render: (args) => (
    <SideSheet {...args} defaultOpen>
      <Text>A sheet without a header only renders its content.</Text>
    </SideSheet>
  ),
};

export const Utilities: Story = {
  args: {
    className: "bg-surface rounded-none w-full",
    classNames: { header: "bg-primary-container", content: "gap-sm" },
  },
};

export const RTL: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <SideSheet {...args} headline="عوامل التصفية" defaultOpen>
        <Text>يظهر اللوح من جهة نهاية السطر.</Text>
        <Checkbox>غير مقروءة</Checkbox>
        <Checkbox>مميزة بنجمة</Checkbox>
      </SideSheet>
    </OxyProvider>
  ),
};
