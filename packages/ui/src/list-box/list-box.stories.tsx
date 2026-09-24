import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "../header/header.tsx";
import { OxyProvider } from "../provider/index.ts";
import { ListBox, ListBoxItem, ListBoxSection, listBoxVariants } from "./list-box.tsx";

const { variant: variants, density: densities } = listBoxVariants.groups;

const meta = {
  title: "Collections/ListBox",
  component: ListBox,
  args: { "aria-label": "Inbox", selectionMode: "single", defaultSelectedKeys: ["drafts"] },
  render: (args) => (
    <ListBox {...args} style={{ inlineSize: 280 }}>
      <ListBoxItem id="inbox" icon="✉" trailing="24">
        Inbox
      </ListBoxItem>
      <ListBoxItem id="drafts" icon="✎">
        Drafts
      </ListBoxItem>
      <ListBoxItem id="starred" icon="★" description="Pinned to the top">
        Starred
      </ListBoxItem>
      <ListBoxItem id="spam" icon="⚠" isDisabled>
        Spam
      </ListBoxItem>
    </ListBox>
  ),
} satisfies Meta<typeof ListBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-lg items-start">
      {variants.map((variant) => (
        <ListBox
          key={variant}
          {...args}
          aria-label={variant}
          selectionMode="multiple"
          defaultSelectedKeys={["morning", "evening"]}
          className={variant}
        >
          <ListBoxItem id="morning" description="06:00 – 12:00">
            Morning
          </ListBoxItem>
          <ListBoxItem id="afternoon" description="12:00 – 18:00">
            Afternoon
          </ListBoxItem>
          <ListBoxItem id="evening" description="18:00 – 24:00">
            Evening
          </ListBoxItem>
        </ListBox>
      ))}
    </div>
  ),
};

export const Sections: Story = {
  render: (args) => (
    <ListBox {...args} style={{ inlineSize: 280 }}>
      <ListBoxSection>
        <Header>Fruit</Header>
        <ListBoxItem id="apple">Apple</ListBoxItem>
        <ListBoxItem id="pear">Pear</ListBoxItem>
      </ListBoxSection>
      <ListBoxSection>
        <Header>Vegetables</Header>
        <ListBoxItem id="drafts">Carrot</ListBoxItem>
        <ListBoxItem id="leek">Leek</ListBoxItem>
      </ListBoxSection>
    </ListBox>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      {densities.map((density) => (
        <ListBox key={density} {...args} aria-label={density} className={`segmented ${density}`}>
          <ListBoxItem id="drafts">{density}</ListBoxItem>
          <ListBoxItem id="other">Other</ListBoxItem>
        </ListBox>
      ))}
    </div>
  ),
};

export const Grid: Story = {
  args: { layout: "grid", selectionMode: "multiple", defaultSelectedKeys: ["drafts", "starred"] },
};

export const Utilities: Story = {
  args: { className: "segmented bg-tertiary-container rounded-xl p-sm gap-sm" },
};

export const Slots: Story = {
  render: (args) => (
    <ListBox {...args} style={{ inlineSize: 280 }}>
      <ListBoxItem
        id="drafts"
        icon="✎"
        description="Slot classes follow the item state"
        classNames={{
          icon: ({ isSelected }) => (isSelected ? "text-primary" : ""),
          description: "type-label-medium",
          indicator: "text-tertiary",
        }}
        className={({ isSelected }) => (isSelected ? "bg-tertiary-container" : "")}
      >
        Drafts
      </ListBoxItem>
      <ListBoxItem id="sent" icon="✉">
        Sent
      </ListBoxItem>
    </ListBox>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <ListBox {...args} unstyled className="flex flex-col gap-xs" style={{ inlineSize: 280 }}>
      <ListBoxItem
        id="inbox"
        className="px-md py-sm rounded-full selected:bg-primary selected:text-on-primary"
      >
        Inbox
      </ListBoxItem>
      <ListBoxItem
        id="drafts"
        className="px-md py-sm rounded-full selected:bg-primary selected:text-on-primary"
      >
        Drafts
      </ListBoxItem>
    </ListBox>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <ListBox {...args} aria-label="البريد" style={{ inlineSize: 280 }}>
        <ListBoxItem id="inbox" icon="✉" trailing="٢٤">
          الوارد
        </ListBoxItem>
        <ListBoxItem id="drafts" icon="✎" description="رسائل غير مرسلة">
          المسودات
        </ListBoxItem>
      </ListBox>
    </OxyProvider>
  ),
};
