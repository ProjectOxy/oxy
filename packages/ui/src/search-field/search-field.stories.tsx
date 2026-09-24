import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { Group } from "../group/group.tsx";
import { Input } from "../input/input.tsx";
import { Label } from "../label/label.tsx";
import { OxyProvider } from "../provider/index.ts";
import { SearchField, searchFieldVariants, type SearchFieldProps } from "./search-field.tsx";

const meta = {
  title: "Forms/SearchField",
  component: SearchField,
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

const Search = (props: SearchFieldProps) => (
  <SearchField aria-label="Search" {...props}>
    {({ isEmpty }) => (
      <Group>
        <span aria-hidden>🔍</span>
        <Input placeholder="Search" />
        {!isEmpty && (
          <Button className="text xs" aria-label="Clear search">
            ✕
          </Button>
        )}
      </Group>
    )}
  </SearchField>
);

export const Default: Story = {
  render: () => <Search />,
};

export const Variants: Story = {
  render: () => (
    <div className="grid gap-lg">
      {searchFieldVariants.groups.variant.map((variant) => (
        <Search key={variant} className={variant} defaultValue={variant} />
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <SearchField className="outlined">
      <Label>Find a colleague</Label>
      <Input />
    </SearchField>
  ),
};

export const Unstyled: Story = {
  render: () => (
    <SearchField unstyled aria-label="Search" className="flex gap-xs">
      <Input className="px-md py-sm rounded-full border border-outline" placeholder="Search" />
      <Button>Clear</Button>
    </SearchField>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="he-IL">
      <Search defaultValue="חיפוש" />
    </OxyProvider>
  ),
};
