import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu, MenuItem } from "../menu/menu.tsx";
import { Keyboard, keyboardVariants } from "./keyboard.tsx";

const meta = {
  title: "Display/Keyboard",
  component: Keyboard,
  args: { children: "⌘K" },
} satisfies Meta<typeof Keyboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Appearances: Story = {
  render: (args) => (
    <div className="flex flex-col gap-md type-body-medium">
      {keyboardVariants.groups.appearance.map((appearance) => (
        <p key={appearance} className="flex items-center gap-xs m-none">
          Press <Keyboard {...args} className={appearance} /> to search
        </p>
      ))}
    </div>
  ),
};

export const Combination: Story = {
  render: (args) => (
    <p className="flex items-center gap-2xs m-none type-body-medium">
      <Keyboard {...args}>Ctrl</Keyboard>+<Keyboard {...args}>Shift</Keyboard>+
      <Keyboard {...args}>P</Keyboard>
    </p>
  ),
};

export const InMenu: Story = {
  render: () => (
    <Menu aria-label="Edit" className="max-w-fit">
      <MenuItem id="cut" trailing={<Keyboard className="plain">Ctrl+X</Keyboard>}>
        Cut
      </MenuItem>
      <MenuItem id="copy" trailing={<Keyboard className="plain">Ctrl+C</Keyboard>}>
        Copy
      </MenuItem>
      <MenuItem id="paste" trailing={<Keyboard>Ctrl+V</Keyboard>}>
        Paste
      </MenuItem>
    </Menu>
  ),
};

export const Utilities: Story = {
  args: { className: "bg-primary-container text-on-primary-container rounded-full px-sm" },
};

export const Unstyled: Story = {
  args: { unstyled: true },
};
