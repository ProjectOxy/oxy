import { color, space } from "@oxy/tokens/semantic.stylex";
import { composeStories } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ComponentType } from "react";

type StoriesModule = Parameters<typeof composeStories>[0];

const modules = import.meta.glob<StoriesModule>("../../../../packages/ui/src/*/*.stories.tsx", {
  eager: true,
});

const featuredStories = ["Trigger", "Inline", "Variants", "Default"];
const overlaysOpenOnMount = new Set(["Overlays/Popover", "Overlays/Toast", "Overlays/Tooltip"]);

export const libraryStories = Object.values(modules)
  .filter((module) => !overlaysOpenOnMount.has(module.default.title ?? ""))
  .map((module) => {
    const stories: Record<string, ComponentType> = composeStories(module);
    const name = featuredStories.find((story) => story in stories) ?? Object.keys(stories)[0];
    return { title: module.default.title ?? "", Story: stories[name as string] as ComponentType };
  })
  .toSorted((a, b) => a.title.localeCompare(b.title));

const styles = stylex.create({
  gallery: {
    display: "grid",
    gap: space["--oxy-space-xl"],
  },
  entry: {
    minInlineSize: 0,
    paddingBlockEnd: space["--oxy-space-xl"],
    borderBlockEndWidth: 1,
    borderBlockEndStyle: "solid",
    borderBlockEndColor: color["--oxy-color-outline-variant"],
  },
});

export function LibraryGallery() {
  return (
    <div {...stylex.props(styles.gallery)}>
      {libraryStories.map(({ title, Story }) => (
        <section key={title} {...stylex.props(styles.entry)}>
          <h2 className="m-none mbe-md type-title-small text-on-surface-variant">{title}</h2>
          <Story />
        </section>
      ))}
    </div>
  );
}
