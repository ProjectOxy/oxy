import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.tsx";
import { buttonVariants } from "../button/styles.ts";
import { SplitButton } from "./split-button.tsx";

const { variant: variants, size: sizes } = buttonVariants.groups;

const meta = {
  title: "Actions/SplitButton",
  component: SplitButton,
  args: { "aria-label": "Send" },
  render: (args) => (
    <SplitButton {...args}>
      <Button>Send</Button>
      <Button aria-label="More send options">▾</Button>
    </SplitButton>
  ),
} satisfies Meta<typeof SplitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  render: (args) => (
    <SplitButton {...args}>
      <Button className="tonal">Send</Button>
      <Button className="tonal" aria-label="More send options" aria-expanded>
        ▴
      </Button>
    </SplitButton>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-md">
      {variants
        .filter((variant) => variant !== "text")
        .map((variant) => (
          <SplitButton key={variant} {...args}>
            <Button className={variant}>{variant}</Button>
            <Button className={variant} aria-label="More">
              ▾
            </Button>
          </SplitButton>
        ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-md justify-start">
      {sizes.map((size) => (
        <SplitButton key={size} {...args}>
          <Button className={size}>{size}</Button>
          <Button className={size} aria-label="More">
            ▾
          </Button>
        </SplitButton>
      ))}
    </div>
  ),
};

export const Unstyled: Story = {
  render: (args) => (
    <SplitButton {...args} unstyled className="inline-flex gap-2xs">
      <Button unstyled className="bg-primary text-on-primary px-lg py-sm rounded-s-full">
        Send
      </Button>
      <Button
        unstyled
        aria-label="More"
        className="bg-primary text-on-primary px-sm py-sm rounded-e-full"
      >
        ▾
      </Button>
    </SplitButton>
  ),
};
