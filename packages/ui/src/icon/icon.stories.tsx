import { arrowBack, arrowForward, edit, favorite, home, Icon, search, settings } from "@oxy/icons";
import { createTheme } from "@oxy/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../avatar/avatar.tsx";
import { Button } from "../button/button.tsx";
import { buttonVariants } from "../button/styles.ts";
import { Fab } from "../fab/fab.tsx";
import { NavigationBar } from "../navigation-bar/navigation-bar.tsx";
import { NavigationItem } from "../navigation-item/navigation-item.tsx";
import { OxyProvider } from "../provider/index.ts";

const filled = createTheme({ icon: { fill: "1", weight: "600" } });

const meta = {
  title: "Display/Icon",
  component: Icon,
  args: { icon: favorite },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InComponents: Story = {
  render: (args) => (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-wrap items-center gap-md">
        {buttonVariants.groups.size.map((size) => (
          <Button key={size} className={`tonal ${size}`}>
            <Icon {...args} />
            {size}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-md">
        <Fab aria-label="Edit">
          <Icon icon={edit} />
        </Fab>
        <Avatar className="lg">
          <Icon {...args} />
        </Avatar>
      </div>
      <NavigationBar aria-label="Main" className="horizontal">
        <NavigationItem href="#home" icon={<Icon icon={home} />} aria-current="page">
          Home
        </NavigationItem>
        <NavigationItem href="#search" icon={<Icon icon={search} />}>
          Search
        </NavigationItem>
        <NavigationItem href="#settings" icon={<Icon icon={settings} />}>
          Settings
        </NavigationItem>
      </NavigationBar>
    </div>
  ),
};

export const Tokens: Story = {
  render: (args) => (
    <div className="flex items-center gap-lg">
      <Icon {...args} />
      <OxyProvider theme={filled}>
        <Icon {...args} />
        <Button className="md">
          <Icon {...args} />
          Filled
        </Button>
      </OxyProvider>
    </div>
  ),
};

export const MirrorInRtl: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      {["en-US", "ar-EG"].map((locale) => (
        <OxyProvider key={locale} locale={locale}>
          <div className="flex items-center gap-md">
            <Icon icon={arrowBack} />
            <Icon icon={arrowForward} />
            <Icon icon={arrowForward} mirrorInRtl={false} />
            <Button className="text">
              <Icon icon={arrowBack} />
              {locale}
            </Button>
          </div>
        </OxyProvider>
      ))}
    </div>
  ),
};
