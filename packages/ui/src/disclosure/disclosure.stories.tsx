import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTitle,
  disclosureVariants,
} from "./disclosure.tsx";

const questions = [
  { id: "shipping", title: "Shipping", answer: "Orders ship within two business days." },
  { id: "returns", title: "Returns", answer: "Return any item within 30 days of delivery." },
  { id: "warranty", title: "Warranty", answer: "Every device carries a two-year warranty." },
];

const meta = {
  title: "Structure/Disclosure",
  component: Disclosure,
  args: { defaultExpanded: true },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <Disclosure {...args}>
        <DisclosureTitle>System requirements</DisclosureTitle>
        <DisclosurePanel>Any browser released in the last two years.</DisclosurePanel>
      </Disclosure>
    </div>
  ),
} satisfies Meta<typeof Disclosure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-lg" style={{ inlineSize: 360 }}>
      {disclosureVariants.groups.variant.map((variant) => (
        <Disclosure key={variant} {...args} className={variant}>
          <DisclosureTitle>{variant}</DisclosureTitle>
          <DisclosurePanel>Panel of a {variant} disclosure.</DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-xl" style={{ inlineSize: 360 }}>
      {["segmented", "plain"].map((variant) => (
        <DisclosureGroup key={variant} className={variant} defaultExpandedKeys={["returns"]}>
          {questions.map(({ id, title, answer }) => (
            <Disclosure key={id} id={id}>
              <DisclosureTitle>{title}</DisclosureTitle>
              <DisclosurePanel>{answer}</DisclosurePanel>
            </Disclosure>
          ))}
        </DisclosureGroup>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultExpanded: false, className: "outlined" },
};

export const Slots: Story = {
  args: {
    className: "filled",
    classNames: {
      trigger: "type-title-large",
      indicator: ({ isExpanded }) => (isExpanded ? "text-primary" : ""),
      content: "text-on-surface",
    },
  },
};

export const Utilities: Story = {
  args: { className: "segmented bg-tertiary-container text-on-tertiary-container rounded-xl" },
};

export const Unstyled: Story = {
  render: (args) => (
    <Disclosure {...args} unstyled className="border border-outline rounded-sm p-sm">
      <DisclosureTitle className="m-none type-title-small">Unstyled</DisclosureTitle>
      <DisclosurePanel className="pt-sm">Only behaviour and the given classes.</DisclosurePanel>
    </Disclosure>
  ),
};
