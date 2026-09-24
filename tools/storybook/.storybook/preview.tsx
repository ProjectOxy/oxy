import type { Decorator, Preview } from "@storybook/react-vite";
import type { Scheme } from "@oxy/ui";
import { seeds } from "../src/seed-theme.ts";
import { StoryFrame, type Direction } from "../src/story-frame.tsx";

const withOxyProviders: Decorator = (Story, { globals }) => (
  <StoryFrame
    locale={globals.locale as string}
    scheme={globals.theme as Scheme}
    direction={globals.direction as Direction}
    seed={globals.seed as string}
  >
    <Story />
  </StoryFrame>
);

const preview: Preview = {
  decorators: [withOxyProviders],
  globalTypes: {
    theme: {
      description: "Color scheme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Text direction",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR", right: "→" },
          { value: "rtl", title: "RTL", right: "←" },
        ],
        dynamicTitle: true,
      },
    },
    seed: {
      description: "Seed color of the Material theme",
      toolbar: {
        title: "Seed",
        icon: "paintbrush",
        items: seeds.map(({ name, value }) => ({ value, title: name, right: value })),
        dynamicTitle: true,
      },
    },
    locale: {
      description: "Locale for React Aria I18nProvider",
      toolbar: {
        title: "Locale",
        icon: "globe",
        items: [
          { value: "en-US", title: "English (US)" },
          { value: "de-DE", title: "Deutsch" },
          { value: "ru-RU", title: "Русский" },
          { value: "ja-JP", title: "日本語" },
          { value: "ar-EG", title: "العربية", right: "rtl" },
          { value: "he-IL", title: "עברית", right: "rtl" },
          { value: "fa-IR", title: "فارسی", right: "rtl" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
    direction: "ltr",
    seed: seeds[0].value,
    locale: "en-US",
  },
  parameters: {
    layout: "fullscreen",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
};

export default preview;
