import { defineConfig } from "vite-plus";
import { stylexCompilePlugin } from "../../stylex.config.ts";

export default defineConfig({
  plugins: [stylexCompilePlugin()],
  test: {
    name: "@oxy/storybook",
    environment: "jsdom",
    testTimeout: 15_000,
    include: ["tests/**/*.test.{ts,tsx}"],
    server: { deps: { inline: ["@material/material-color-utilities"] } },
  },
});
