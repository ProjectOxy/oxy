import type { Meta, StoryObj } from "@storybook/react-vite";
import { OxyProvider } from "../provider/index.ts";
import { ToggleButton } from "../toggle-button/toggle-button.tsx";
import { ToggleButtonGroup, toggleButtonGroupVariants } from "./toggle-button-group.tsx";

const { size: sizes } = toggleButtonGroupVariants.groups;

const views = ["Day", "Week", "Month", "Year"];

const meta = {
  title: "Actions/ToggleButtonGroup",
  component: ToggleButtonGroup,
  args: { "aria-label": "View", defaultSelectedKeys: ["Week"], disallowEmptySelection: true },
  render: ({ className, ...args }) => (
    <ToggleButtonGroup {...args} className={className}>
      {views.map((view) => (
        <ToggleButton key={view} id={view}>
          {view}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  ),
} satisfies Meta<typeof ToggleButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-md justify-start">
      {sizes.map((size) => (
        <ToggleButtonGroup key={size} {...args} className={size}>
          {views.map((view) => (
            <ToggleButton key={view} id={view} className={`tonal ${size}`}>
              {view}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      ))}
    </div>
  ),
};

export const Standard: Story = {
  render: (args) => (
    <div className="grid gap-md justify-start">
      {sizes.map((size) => (
        <ToggleButtonGroup key={size} {...args} className={`standard ${size}`}>
          {views.map((view) => (
            <ToggleButton key={view} id={view} className={`outlined ${size}`}>
              {view}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

export const MultipleSelection: Story = {
  args: { selectionMode: "multiple", defaultSelectedKeys: ["Day", "Month"] },
};

export const Utilities: Story = {
  args: { className: "w-full" },
  render: ({ className, ...args }) => (
    <ToggleButtonGroup {...args} className={className}>
      {views.map((view) => (
        <ToggleButton key={view} id={view} className="flex-1 selected:bg-tertiary">
          {view}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <ToggleButtonGroup {...args} unstyled className="inline-flex gap-2xs">
      {views.map((view) => (
        <ToggleButton
          key={view}
          id={view}
          unstyled
          className="px-md py-xs rounded-xs bg-surface-container-high selected:bg-inverse-surface selected:text-inverse-on-surface"
        >
          {view}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  ),
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="he-IL">
      <ToggleButtonGroup {...args} aria-label="תצוגה">
        {["יום", "שבוע", "חודש", "שנה"].map((view, index) => (
          <ToggleButton key={view} id={views[index]} className="md">
            {view}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </OxyProvider>
  ),
};
