import { describe, expect, test } from "vite-plus/test";
import { createTheme, defaultTheme, resolveTokens, type Theme } from "../src/index.ts";

function applyTheme(element: HTMLElement, theme: Theme) {
  for (const [name, value] of Object.entries(theme.vars)) element.style.setProperty(name, value);
  return element;
}

const readVar = (element: Element, name: string) =>
  getComputedStyle(element).getPropertyValue(name).trim();

describe("createTheme", () => {
  test("emits overridden tokens and every token aliasing them", () => {
    const theme = createTheme({ color: { primary: "#006a60" } });

    expect(theme.vars).toEqual({
      "--oxy-color-primary": "#006a60",
      "--oxy-color-surface-tint": "var(--oxy-color-primary)",
    });
    expect(theme.tokens.color.primary).toBe("#006a60");
    expect(theme.tokens.color.secondary).toBe(defaultTheme.tokens.color.secondary);
  });

  test("follows aliases transitively and accepts references as values", () => {
    const theme = createTheme({ space: { lg: "{space.xl}" } });

    expect(theme.vars).toEqual({
      "--oxy-space-lg": "var(--oxy-space-xl)",
      "--oxy-button-sm-padding-inline": "var(--oxy-space-lg)",
      "--oxy-button-xl-gap": "var(--oxy-space-lg)",
      "--oxy-fab-sm-padding-inline": "var(--oxy-space-lg)",
      "--oxy-fab-lg-gap": "var(--oxy-space-lg)",
      "--oxy-card-padding": "var(--oxy-space-lg)",
    });
    expect(resolveTokens(theme.tokens).get("card.padding")).toBe("24px");
  });

  test("overrides component tokens without touching semantic ones", () => {
    const theme = createTheme({ button: { md: { "square-radius": "{radius.sm}" } } });
    expect(theme.vars).toEqual({ "--oxy-button-md-square-radius": "var(--oxy-radius-sm)" });
  });

  test("extends a base theme and keeps its declarations", () => {
    const brand = createTheme({ radius: { full: "16px" } });
    const accent = createTheme({ color: { secondary: "#8b5000" } }, brand);

    expect(accent.tokens.radius.full).toBe("16px");
    expect(accent.vars).toMatchObject({
      "--oxy-radius-full": "16px",
      "--oxy-color-secondary": "#8b5000",
      "--oxy-focus-ring-color": "var(--oxy-color-secondary)",
    });
  });

  test("rejects unknown tokens and broken references", () => {
    expect(() => createTheme({ color: { brand: "#000" } } as never)).toThrow(
      "Unknown token color.brand",
    );
    expect(() => createTheme({ radius: "4px" } as never)).toThrow("Token radius must be a object");
    expect(() => createTheme({ radius: { md: "{radius.huge}" } })).toThrow(
      "Unknown token reference {radius.huge} in radius.md",
    );
    expect(() => createTheme({ radius: { sm: "{radius.md}", md: "{radius.sm}" } })).toThrow(
      "Circular token reference",
    );
  });
});

test("two nested themes on one page give their subtrees different variable values", () => {
  const brand = createTheme({ color: { primary: "#006a60" }, radius: { full: "12px" } });
  const promo = createTheme({ color: { primary: "#b3261e" } }, brand);

  const outer = applyTheme(document.createElement("section"), brand);
  const inner = applyTheme(document.createElement("div"), promo);
  const outerButton = document.createElement("button");
  const innerButton = document.createElement("button");
  outer.append(outerButton, inner);
  inner.append(innerButton);
  document.body.append(outer);

  expect(readVar(outerButton, "--oxy-color-primary")).toBe("#006a60");
  expect(readVar(innerButton, "--oxy-color-primary")).toBe("#b3261e");
  expect(readVar(innerButton, "--oxy-radius-full")).toBe("12px");
  expect(readVar(document.body, "--oxy-color-primary")).toBe("");

  outer.remove();
});
