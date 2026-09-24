import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label/label.tsx";
import { Meter, meterVariants } from "./meter.tsx";

const meta = {
  title: "Forms/Meter",
  component: Meter,
} satisfies Meta<typeof Meter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Meter value={72}>
      {({ valueText }) => (
        <>
          <Label>Storage</Label>
          <span className="type-label-large">{valueText}</span>
        </>
      )}
    </Meter>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid gap-lg">
      {meterVariants.groups.tone.map((tone) => (
        <div key={tone} className="flex items-center gap-lg">
          <Meter value={64} className={`circular ${tone}`} aria-label={`${tone} circular`} />
          <Meter value={64} className={`${tone} flex-1`} aria-label={`${tone} linear`} />
        </div>
      ))}
    </div>
  ),
};
