import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "./tabs.tsx";

const destinations = [
  { id: "flights", label: "Flights", icon: "✈" },
  { id: "trips", label: "Trips", icon: "⌂" },
  { id: "explore", label: "Explore", icon: "✦" },
];

const meta = {
  title: "Navigation/Tabs",
  component: TabList,
  args: { "aria-label": "Travel" },
  render: ({ className, ...args }) => (
    <Tabs className="max-w-full" style={{ inlineSize: 480 }}>
      <TabList {...args} className={className}>
        {destinations.map(({ id, label }) => (
          <Tab key={id} id={id}>
            {label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {destinations.map(({ id, label }) => (
          <TabPanel key={id} id={id} className="p-lg type-body-medium">
            {label} content
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  ),
} satisfies Meta<typeof TabList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { className: "secondary" },
};

export const Icons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-xl" style={{ inlineSize: 480 }}>
      {["primary", "secondary"].map((variant) => (
        <Tabs key={variant}>
          <TabList {...args} aria-label={variant} className={variant}>
            {destinations.map(({ id, label, icon }) => (
              <Tab key={id} id={id} icon={icon}>
                {label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      ))}
    </div>
  ),
};

export const Scrollable: Story = {
  render: (args) => (
    <Tabs style={{ inlineSize: 360 }}>
      <TabList {...args} className="scrollable">
        {["Overview", "Specifications", "Reviews", "Related", "Support"].map((name) => (
          <Tab key={name} id={name}>
            {name}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Tabs style={{ inlineSize: 480 }} disabledKeys={["trips"]}>
      <TabList {...args}>
        {destinations.map(({ id, label }) => (
          <Tab key={id} id={id}>
            {label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <Tabs orientation="vertical" defaultSelectedKey="trips">
      <TabList {...args}>
        {destinations.map(({ id, label }) => (
          <Tab key={id} id={id}>
            {label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {destinations.map(({ id, label }) => (
          <TabPanel key={id} id={id} className="px-lg type-body-medium">
            {label} content
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  ),
};

export const Slots: Story = {
  render: (args) => (
    <Tabs style={{ inlineSize: 480 }}>
      <TabList {...args}>
        {destinations.map(({ id, label, icon }) => (
          <Tab
            key={id}
            id={id}
            icon={icon}
            classNames={{
              icon: ({ isSelected }) => (isSelected ? "text-tertiary" : ""),
              indicator: "bg-tertiary",
            }}
          >
            {label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  ),
};

export const Utilities: Story = {
  args: { className: "secondary bg-surface-container-high rounded-lg border-0" },
};

export const Unstyled: Story = {
  render: (args) => (
    <Tabs unstyled>
      <TabList {...args} className="flex gap-sm">
        {destinations.map(({ id, label }) => (
          <Tab
            key={id}
            id={id}
            className={({ isSelected }) =>
              `px-md py-xs rounded-full ${isSelected ? "bg-primary text-on-primary" : "border border-outline"}`
            }
          >
            {label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  ),
};
