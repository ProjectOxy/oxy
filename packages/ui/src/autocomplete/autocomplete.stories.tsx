import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, SearchField, useFilter } from "react-aria-components";
import { ListBox, ListBoxItem } from "../list-box/list-box.tsx";
import { Menu, MenuItem } from "../menu/menu.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Autocomplete } from "./autocomplete.tsx";

const commands = ["New file", "Open file", "Save", "Save as", "Close window"];

const meta = {
  title: "Collections/Autocomplete",
  component: Autocomplete,
  args: { children: null },
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

const searchClassName =
  "w-full px-lg py-md rounded-full bg-surface-container-high text-on-surface type-body-large border-0";

function CommandPalette({ defaultInputValue }: { defaultInputValue?: string }) {
  const { contains } = useFilter({ sensitivity: "base" });
  return (
    <div className="grid gap-sm" style={{ inlineSize: 320 }}>
      <Autocomplete filter={contains} defaultInputValue={defaultInputValue}>
        <SearchField aria-label="Commands">
          <Input placeholder="Type a command" className={searchClassName} />
        </SearchField>
        <Menu aria-label="Commands" renderEmptyState={() => "No commands"}>
          {commands.map((command) => (
            <MenuItem key={command} id={command}>
              {command}
            </MenuItem>
          ))}
        </Menu>
      </Autocomplete>
    </div>
  );
}

export const Default: Story = {
  render: () => <CommandPalette />,
};

export const Filtered: Story = {
  render: () => <CommandPalette defaultInputValue="save" />,
};

export const WithListBox: Story = {
  render: () => {
    const { contains } = useFilter({ sensitivity: "base" });
    return (
      <div className="grid gap-sm" style={{ inlineSize: 320 }}>
        <Autocomplete filter={contains}>
          <SearchField aria-label="Fruit">
            <Input placeholder="Search fruit" className={searchClassName} />
          </SearchField>
          <ListBox aria-label="Fruit" selectionMode="single" className="segmented">
            <ListBoxItem id="apple">Apple</ListBoxItem>
            <ListBoxItem id="apricot">Apricot</ListBoxItem>
            <ListBoxItem id="banana">Banana</ListBoxItem>
          </ListBox>
        </Autocomplete>
      </div>
    );
  },
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <CommandPalette />
    </OxyProvider>
  ),
};
