import { Icon, favorite } from "@oxy/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { OxyProvider } from "../provider/index.ts";
import { Card, cardVariants } from "./card.tsx";

const meta = {
  title: "Display/Card",
  component: Card,
  render: (args) => (
    <Card {...args} className={`gap-sm ${args.className ?? ""}`} style={{ inlineSize: 280 }}>
      <h3 className="type-title-large m-none">Glacier hike</h3>
      <p className="type-body-medium text-on-surface-variant m-none">
        A guided four-hour walk across the ice with crampons and a picnic.
      </p>
      <div className="flex justify-end gap-sm">
        <Button className="text">Details</Button>
        <Button>Book</Button>
      </div>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-lg">
      {cardVariants.groups.variant.map((variant) => (
        <Card key={variant} {...args} className={`${variant} gap-xs`} style={{ inlineSize: 180 }}>
          <span className="type-title-medium">{variant}</span>
          <span className="type-body-medium text-on-surface-variant">Supporting text</span>
        </Card>
      ))}
    </div>
  ),
};

export const Media: Story = {
  render: (args) => (
    <Card {...args} className="outlined p-none" style={{ inlineSize: 280 }}>
      <div
        className="bg-tertiary-container text-on-tertiary-container grid items-center justify-center"
        style={{ blockSize: 120 }}
      >
        <Icon icon={favorite} />
      </div>
      <div className="flex flex-col gap-xs p-lg">
        <span className="type-title-medium">Full-bleed media</span>
        <span className="type-body-medium text-on-surface-variant">
          Utilities drop the padding for edge-to-edge content.
        </span>
      </div>
    </Card>
  ),
};

export const Utilities: Story = {
  args: { className: "filled bg-secondary-container text-on-secondary-container rounded-xl" },
};

export const Unstyled: Story = {
  args: { unstyled: true, className: "flex flex-col gap-sm p-md border border-outline" },
};

export const RightToLeft: Story = {
  render: (args) => (
    <OxyProvider locale="he-IL">
      <Card {...args} className="gap-sm" style={{ inlineSize: 280 }}>
        <h3 className="type-title-large m-none">טיול קרחון</h3>
        <p className="type-body-medium text-on-surface-variant m-none">הליכה מודרכת על הקרח.</p>
        <div className="flex justify-end gap-sm">
          <Button className="text">פרטים</Button>
          <Button>הזמנה</Button>
        </div>
      </Card>
    </OxyProvider>
  ),
};
