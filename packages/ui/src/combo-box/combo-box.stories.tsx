import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBoxItem } from "../list-box/list-box.tsx";
import { OxyProvider } from "../provider/index.ts";
import { ComboBox, comboBoxVariants } from "./combo-box.tsx";

const { variant: variants, density: densities } = comboBoxVariants.groups;

const cities = [
  { id: "amsterdam", name: "Amsterdam" },
  { id: "athens", name: "Athens" },
  { id: "berlin", name: "Berlin" },
  { id: "lisbon", name: "Lisbon" },
  { id: "madrid", name: "Madrid" },
];

const meta = {
  title: "Collections/ComboBox",
  component: ComboBox,
  args: {
    label: "City",
    defaultItems: cities,
    children: (city: object) => {
      const { id, name } = city as (typeof cities)[number];
      return <ListBoxItem id={id}>{name}</ListBoxItem>;
    },
  },
} satisfies Meta<typeof ComboBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: "Where the trip starts", placeholder: "Search cities" },
};

export const Open: Story = {
  args: { defaultInputValue: "a", allowsCustomValue: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /suggestions/i }));
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 medium:grid-cols-2 gap-lg">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-lg">
          <ComboBox {...args} className={variant} label="Empty" description="Supporting text" />
          <ComboBox {...args} className={variant} label="Populated" defaultSelectedKey="lisbon" />
          <ComboBox
            {...args}
            className={variant}
            label="Invalid"
            isInvalid
            errorMessage="Choose a city"
          />
          <ComboBox
            {...args}
            className={variant}
            label="Disabled"
            isDisabled
            defaultSelectedKey="berlin"
          />
        </div>
      ))}
    </div>
  ),
};

export const Density: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-lg">
      {densities.map((density) => (
        <ComboBox
          key={density}
          {...args}
          className={`outlined ${density}`}
          label={density}
          defaultSelectedKey="athens"
        />
      ))}
    </div>
  ),
};

export const MultipleSelection: Story = {
  args: {
    label: "Cities",
    selectionMode: "multiple",
    defaultValue: ["athens", "madrid"],
  },
};

export const Slots: Story = {
  args: {
    className: "outlined",
    classNames: {
      field: ({ isOpen }) => (isOpen ? "rounded-none" : "rounded-lg"),
      label: "text-tertiary",
      indicator: "text-tertiary",
    },
  },
};

export const Unstyled: Story = {
  args: {
    unstyled: true,
    className: "inline-flex flex-col gap-xs",
    classNames: {
      label: "type-label-medium text-on-surface-variant",
      input: "px-md py-sm rounded-full bg-surface-container-high text-on-surface type-body-large",
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="ar-EG">
      <div className="flex flex-wrap gap-lg">
        <ComboBox {...args} label="المدينة" description="نقطة الانطلاق" />
        <ComboBox {...args} className="outlined" label="المدينة" defaultSelectedKey="athens" />
      </div>
    </OxyProvider>
  ),
};
