import stylex from "@stylexjs/unplugin";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite-plus";
import { stylexOptions } from "../../../stylex.config.ts";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(ts|tsx)",
    "../../../packages/*/src/**/*.mdx",
    "../../../packages/*/src/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  core: { disableTelemetry: true },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [stylex.vite(stylexOptions)],
    }),
};

export default config;
