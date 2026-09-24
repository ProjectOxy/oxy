import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { ToggleButton } from "../toggle-button/toggle-button.tsx";
import { Toolbar } from "./toolbar.tsx";

const actions = ["↶", "↷", "✂", "⧉", "⌫"];

const meta = {
  title: "Actions/Toolbar",
  component: Toolbar,
  args: { "aria-label": "Editing" },
  render: (args) => (
    <Toolbar {...args}>
      {actions.map((action) => (
        <Button key={action} className="text" aria-label={action}>
          {action}
        </Button>
      ))}
      <ToggleButton className="text" aria-label="Bold" defaultSelected>
        B
      </ToggleButton>
    </Toolbar>
  ),
} satisfies Meta<typeof Toolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Docked: Story = {};

export const Floating: Story = {
  args: { className: "floating" },
};

export const Vibrant: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-md">
      <Toolbar {...args} className="vibrant">
        {actions.map((action) => (
          <Button key={action} className="text" aria-label={action}>
            {action}
          </Button>
        ))}
      </Toolbar>
      <Toolbar {...args} className="floating vibrant">
        {actions.map((action) => (
          <Button key={action} className="tonal" aria-label={action}>
            {action}
          </Button>
        ))}
      </Toolbar>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical", className: "floating" },
};

export const Utilities: Story = {
  args: { className: "floating rounded-lg bg-surface-container-highest gap-md" },
};

export const Unstyled: Story = {
  args: { unstyled: true, className: "inline-flex gap-sm p-sm border border-outline rounded-sm" },
};
