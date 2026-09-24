import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBoxItem } from "../list-box/list-box.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Select, selectVariants } from "./select.tsx";

const { variant: variants, tone: tones, density: densities } = selectVariants.groups;

const fruits = [
  { id: "apple", name: "Apple" },
  { id: "banana", name: "Banana" },
  { id: "cherry", name: "Cherry" },
  { id: "kiwi", name: "Kiwi" },
];

const meta = {
  title: "Collections/Select",
  component: Select,
  args: {
    label: "Fruit",
    items: fruits,
    children: (fruit: object) => {
      const { id, name } = fruit as (typeof fruits)[number];
      return <ListBoxItem id={id}>{name}</ListBoxItem>;
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: "Pick one for the smoothie" },
};

export const Open: Story = {
  args: { defaultOpen: true, defaultValue: "banana" },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-lg">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-lg">
          <Select {...args} className={variant} label="Empty" description="Supporting text" />
          <Select {...args} className={variant} label="Populated" defaultValue="cherry" />
          <Select
            {...args}
            className={variant}
            label="Invalid"
            isInvalid
            errorMessage="Choose a fruit"
          />
          <Select {...args} className={variant} label="Disabled" isDisabled defaultValue="kiwi" />
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-lg">
      {tones.map((tone) => (
        <Select
          key={tone}
          {...args}
          className={`outlined ${tone}`}
          label={tone}
          autoFocus={tone === "tertiary"}
        />
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      {densities.map((density) => (
        <Select key={density} {...args} className={density} label={density} defaultValue="apple" />
      ))}
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: { label: undefined, "aria-label": "Fruit", placeholder: "Choose a fruit" },
};

export const Utilities: Story = {
  args: {
    className: "outlined w-full",
    classNames: { trigger: "rounded-full bg-secondary-container", label: "text-secondary" },
    defaultValue: "apple",
  },
};

export const Slots: Story = {
  args: {
    defaultOpen: true,
    classNames: {
      value: ({ isOpen }) => (isOpen ? "text-primary" : ""),
      popover: "rounded-xs",
      listbox: "gap-2xs",
    },
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: "inline-flex flex-col gap-xs",
    classNames: {
      label: "type-label-medium text-on-surface-variant",
      trigger: "px-md py-sm rounded-full bg-surface-container-high text-on-surface type-body-large",
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <div className="flex flex-wrap gap-lg">
        <Select {...args} label="الفاكهة" description="اختر واحدة" />
        <Select {...args} className="outlined" label="الفاكهة" defaultValue="cherry" />
      </div>
    </OxyProvider>
  ),
};
