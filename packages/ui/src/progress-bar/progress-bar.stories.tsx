import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "../label/label.tsx";
import { OxyProvider } from "../provider/index.ts";
import { ProgressBar, progressBarVariants } from "./progress-bar.tsx";

const meta = {
  title: "Forms/ProgressBar",
  component: ProgressBar,
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ProgressBar value={40}>
      {({ valueText }) => (
        <>
          <Label>Uploading</Label>
          <span className="type-label-large">{valueText}</span>
        </>
      )}
    </ProgressBar>
  ),
};

export const Linear: Story = {
  render: () => (
    <div className="grid gap-lg">
      {[0, 25, 60, 100].map((value) => (
        <ProgressBar key={value} value={value} aria-label={`Flat ${value}`} />
      ))}
      {[25, 60].map((value) => (
        <ProgressBar key={value} value={value} className="wavy" aria-label={`Wavy ${value}`} />
      ))}
      <ProgressBar isIndeterminate aria-label="Indeterminate" />
      <ProgressBar isIndeterminate className="wavy" aria-label="Wavy indeterminate" />
    </div>
  ),
};

export const Circular: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-lg">
      {[10, 45, 80].map((value) => (
        <ProgressBar
          key={value}
          value={value}
          className="circular"
          aria-label={`Circular ${value}`}
        />
      ))}
      <ProgressBar value={65} className="circular wavy" aria-label="Wavy" />
      <ProgressBar isIndeterminate className="circular" aria-label="Indeterminate" />
      <ProgressBar value={30} className="circular size-3xl" aria-label="Utility size" />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex items-center gap-lg">
      <ProgressBar isIndeterminate className="loading" aria-label="Loading" />
      <ProgressBar isIndeterminate className="loading contained" aria-label="Contained" />
      <ProgressBar isIndeterminate className="loading contained tertiary" aria-label="Tertiary" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid gap-md">
      {progressBarVariants.groups.tone.map((tone) => (
        <ProgressBar key={tone} value={55} className={tone} aria-label={tone} />
      ))}
    </div>
  ),
};

export const Slots: Story = {
  render: () => (
    <ProgressBar
      value={70}
      aria-label="Slots"
      classNames={{ activeIndicator: "bg-tertiary h-sm", track: "bg-tertiary-container h-sm" }}
    />
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <OxyProvider locale="ar-EG">
      <ProgressBar value={35} className="wavy">
        <Label>جارٍ التحميل</Label>
      </ProgressBar>
    </OxyProvider>
  ),
};
