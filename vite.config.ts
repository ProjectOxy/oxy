import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    projects: [
      "packages/*",
      "packages/*/vite.browser.config.ts",
      "tools/checks",
      "tools/storybook/vitest.config.ts",
    ],
  },
  run: {
    cache: true,
  },
});
