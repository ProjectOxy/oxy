import type { ColorScheme } from "@oxy/material-theme";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LibraryGallery } from "../src/playground/library-gallery.tsx";
import { defaultPlaygroundOptions } from "../src/playground/theme.ts";
import { TokenPlayground } from "../src/playground/token-playground.tsx";

const meta: Meta = {
  title: "Foundations/Token playground",
  tags: ["!autodocs", "no-visual"],
  render: (_, { globals }) => (
    <TokenPlayground
      key={`${globals.seed}:${globals.theme}`}
      defaultOptions={{
        ...defaultPlaygroundOptions,
        seed: globals.seed as string,
        scheme: globals.theme as ColorScheme,
      }}
    >
      <LibraryGallery />
    </TokenPlayground>
  ),
};

export default meta;

export const Library: StoryObj = {};
