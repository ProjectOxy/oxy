import { createMaterialTheme } from "@oxy/material-theme";
import { createTheme, defaultTheme } from "@oxy/tokens";
import { describe, expect, test } from "vite-plus/test";
import {
  defaultPlaygroundOptions,
  exportTheme,
  nestTokens,
  playgroundTheme,
  themeOverrides,
} from "../src/playground/theme.ts";

const options = {
  seed: "#0061a4",
  scheme: "dark" as const,
  contrast: "medium" as const,
  tokens: {
    "color.primary": "#ff0000",
    "radius.md": "3px",
    "button.sm.height": "{space.3xl}",
    "motion.spring.spatial.default.stiffness": "900",
  },
};

describe("nestTokens", () => {
  test("turns dotted token paths into a theme overrides tree", () => {
    expect(nestTokens(options.tokens)).toEqual({
      color: { primary: "#ff0000" },
      radius: { md: "3px" },
      button: { sm: { height: "{space.3xl}" } },
      motion: { spring: { spatial: { default: { stiffness: "900" } } } },
    });
  });
});

describe("playgroundTheme", () => {
  test("applies token edits over the seeded Material theme", () => {
    const theme = playgroundTheme(options);

    expect(theme.vars["--oxy-color-primary"]).toBe("#ff0000");
    expect(theme.vars["--oxy-color-secondary"]).toBe(
      createMaterialTheme({ seed: "#0061a4", scheme: "dark", contrast: "medium" }).vars[
        "--oxy-color-secondary"
      ],
    );
    expect(theme.vars["--oxy-button-sm-height"]).toBe("var(--oxy-space-3xl)");
  });

  test("rejects a reference to a token that does not exist", () => {
    expect(() =>
      playgroundTheme({ ...defaultPlaygroundOptions, tokens: { "radius.md": "{radius.huge}" } }),
    ).toThrow("Unknown token reference {radius.huge}");
  });
});

describe("exportTheme", () => {
  const theme = playgroundTheme(options);

  test("createMaterialTheme export rebuilds the same theme", () => {
    const exported = JSON.parse(exportTheme("createMaterialTheme", { options, theme }));

    expect(createMaterialTheme(exported)).toEqual(theme);
  });

  test("createTheme export rebuilds the same tokens", () => {
    const exported = JSON.parse(exportTheme("createTheme", { options, theme }));

    expect(createTheme(exported).tokens).toEqual(theme.tokens);
  });

  test("createTheme export of the default theme is empty", () => {
    expect(themeOverrides(defaultTheme)).toEqual({});
  });
});
