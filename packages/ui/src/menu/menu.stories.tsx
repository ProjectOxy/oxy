import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { Header } from "../header/header.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Menu, MenuItem, MenuSection, MenuTrigger, SubmenuTrigger, menuVariants } from "./menu.tsx";

const { color: colors, density: densities } = menuVariants.groups;

const meta = {
  title: "Collections/Menu",
  component: Menu,
  args: { "aria-label": "Edit" },
  render: (args) => (
    <MenuTrigger defaultOpen>
      <Button className="tonal">Edit</Button>
      <Menu {...args}>
        <MenuItem id="cut" icon="✂" trailing="Ctrl+X">
          Cut
        </MenuItem>
        <MenuItem id="copy" icon="❐" trailing="Ctrl+C">
          Copy
        </MenuItem>
        <MenuItem id="paste" icon="✎" trailing="Ctrl+V" isDisabled>
          Paste
        </MenuItem>
        <SubmenuTrigger>
          <MenuItem id="share" icon="↗">
            Share
          </MenuItem>
          <Menu aria-label="Share">
            <MenuItem id="mail">Mail</MenuItem>
            <MenuItem id="link">Copy link</MenuItem>
          </Menu>
        </SubmenuTrigger>
      </Menu>
    </MenuTrigger>
  ),
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selection: Story = {
  render: (args) => (
    <MenuTrigger defaultOpen>
      <Button className="tonal">View</Button>
      <Menu {...args} aria-label="View">
        <MenuSection selectionMode="single" defaultSelectedKeys={["list"]}>
          <Header>Layout</Header>
          <MenuItem id="grid">Grid</MenuItem>
          <MenuItem id="list">List</MenuItem>
        </MenuSection>
        <MenuSection selectionMode="multiple" defaultSelectedKeys={["hidden"]}>
          <Header>Show</Header>
          <MenuItem id="hidden" description="Files starting with a dot">
            Hidden files
          </MenuItem>
          <MenuItem id="extensions">Extensions</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  ),
};

export const Inline: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      {colors.flatMap((color) =>
        densities.map((density) => (
          <Menu
            key={`${color}-${density}`}
            {...args}
            aria-label={`${color} ${density}`}
            className={`${color} ${density}`}
            selectionMode="single"
            defaultSelectedKeys={["two"]}
          >
            <MenuItem id="one">{color}</MenuItem>
            <MenuItem id="two">{density}</MenuItem>
            <MenuItem id="three" isDisabled>
              Disabled
            </MenuItem>
          </Menu>
        )),
      )}
    </div>
  ),
};

export const Vibrant: Story = {
  args: { className: "vibrant" },
};

export const Utilities: Story = {
  args: { className: "bg-inverse-surface text-inverse-on-surface rounded-sm p-none" },
};

export const Slots: Story = {
  render: (args) => (
    <MenuTrigger defaultOpen>
      <Button className="tonal">Slots</Button>
      <Menu {...args}>
        <MenuItem
          id="copy"
          icon="❐"
          trailing="Ctrl+C"
          classNames={{ icon: "text-tertiary", trailing: "text-primary" }}
          className={({ isFocused }) => (isFocused ? "bg-tertiary-container" : "")}
        >
          Copy
        </MenuItem>
        <MenuItem id="paste">Paste</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <Menu
      {...args}
      unstyled
      className="flex flex-col gap-2xs p-xs rounded-md bg-surface-container-high"
    >
      <MenuItem id="cut" className="px-md py-sm rounded-sm hover:bg-primary hover:text-on-primary">
        Cut
      </MenuItem>
      <MenuItem id="copy" className="px-md py-sm rounded-sm hover:bg-primary hover:text-on-primary">
        Copy
      </MenuItem>
    </Menu>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <MenuTrigger defaultOpen>
        <Button className="tonal">تعديل</Button>
        <Menu {...args} aria-label="تعديل">
          <MenuItem id="cut" icon="✂" trailing="Ctrl+X">
            قص
          </MenuItem>
          <SubmenuTrigger>
            <MenuItem id="share" icon="↗">
              مشاركة
            </MenuItem>
            <Menu aria-label="مشاركة">
              <MenuItem id="mail">البريد</MenuItem>
            </Menu>
          </SubmenuTrigger>
        </Menu>
      </MenuTrigger>
    </OxyProvider>
  ),
};
