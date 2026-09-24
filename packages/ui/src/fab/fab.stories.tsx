import type { Meta, StoryObj } from "@storybook/react-vite";
import { OxyProvider } from "../provider/index.ts";
import { ExtendedFab } from "./extended-fab.tsx";
import { FabMenu, FabMenuItem, FabMenuList } from "./fab-menu.tsx";
import { Fab, fabVariants } from "./fab.tsx";

const { variant: variants, size: sizes, tone: tones } = fabVariants.groups;

const meta = {
  title: "Actions/Fab",
  component: Fab,
  args: { "aria-label": "Compose", children: "✎" },
} satisfies Meta<typeof Fab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-end gap-lg">
      {sizes.map((size) => (
        <Fab key={size} {...args} className={size} />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="grid gap-md">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-wrap gap-lg">
          {tones.map((tone) => (
            <Fab key={tone} {...args} className={`${variant} ${tone}`} />
          ))}
          <Fab {...args} className={variant} isDisabled />
        </div>
      ))}
    </div>
  ),
};

export const Extended: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-lg">
      {sizes.map((size) => (
        <ExtendedFab key={size} className={size} icon="✎">
          Compose
        </ExtendedFab>
      ))}
      <ExtendedFab className="filled tertiary">No icon</ExtendedFab>
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-lg">
      {sizes.map((size) => (
        <ExtendedFab key={size} className={`${size} collapsed`} icon="✎">
          Compose
        </ExtendedFab>
      ))}
    </div>
  ),
};

export const Menu: Story = {
  render: (args) => (
    <div className="flex justify-end items-end h-full" style={{ minBlockSize: "400px" }}>
      <FabMenu defaultOpen>
        <Fab {...args} aria-label="Create" className="md">
          ✕
        </Fab>
        <FabMenuList aria-label="Create">
          <FabMenuItem id="message" icon="✉">
            Message
          </FabMenuItem>
          <FabMenuItem id="event" icon="◷">
            Event
          </FabMenuItem>
          <FabMenuItem id="note" icon="✎">
            Note
          </FabMenuItem>
        </FabMenuList>
      </FabMenu>
    </div>
  ),
};

export const MenuTones: Story = {
  render: (args) => (
    <div className="flex justify-between items-end" style={{ minBlockSize: "400px" }}>
      {tones.map((tone) => (
        <FabMenu key={tone} defaultOpen={tone === "tertiary"}>
          <Fab {...args} aria-label={tone} className={tone}>
            {tone === "tertiary" ? "✕" : "+"}
          </Fab>
          <FabMenuList aria-label={tone} className={tone}>
            <FabMenuItem id="message" icon="✉">
              Message
            </FabMenuItem>
            <FabMenuItem id="event" icon="◷" isDisabled>
              Event
            </FabMenuItem>
          </FabMenuList>
        </FabMenu>
      ))}
    </div>
  ),
};

export const Utilities: Story = {
  render: (args) => (
    <div className="flex gap-lg">
      <Fab {...args} className="lg bg-tertiary text-on-tertiary rounded-full" />
      <ExtendedFab icon="✎" className="shadow-level1 rounded-sm px-3xl">
        Utilities win
      </ExtendedFab>
    </div>
  ),
};

export const Slots: Story = {
  render: () => (
    <ExtendedFab
      icon="✎"
      className="md"
      classNames={{ icon: "text-tertiary", label: "type-title-large-emphasized" }}
    >
      Compose
    </ExtendedFab>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <div className="flex items-center gap-lg">
      <Fab {...args} unstyled />
      <ExtendedFab
        unstyled
        icon="✎"
        className="inline-flex items-center gap-sm px-lg py-md rounded-md bg-inverse-surface text-inverse-on-surface"
      >
        Brand from scratch
      </ExtendedFab>
    </div>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <div className="flex gap-lg">
        <ExtendedFab icon="✎" className="md">
          إنشاء
        </ExtendedFab>
        <ExtendedFab icon="✎" className="md collapsed">
          إنشاء
        </ExtendedFab>
      </div>
    </OxyProvider>
  ),
};
