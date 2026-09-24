import type { Theme } from "@oxy/tokens";
import { expect, test } from "vite-plus/test";
import { createMaterialTheme, neutralTheme } from "../src/index.ts";

function themed(tag: string, theme: Theme, ...children: HTMLElement[]) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(theme.vars)) element.style.setProperty(name, value);
  element.append(...children);
  return element;
}

const readVar = (element: Element, name: string) =>
  getComputedStyle(element).getPropertyValue(name).trim();

test("a seeded Material subtree inside a neutral page restores the full M3 Expressive look", () => {
  const brand = createMaterialTheme({ seed: "#0061a4", scheme: "dark" });
  const neutralButton = document.createElement("button");
  const materialButton = document.createElement("button");
  const page = themed(
    "main",
    neutralTheme,
    neutralButton,
    themed("section", brand, materialButton),
  );
  document.body.append(page);

  for (const name of [
    "--oxy-color-primary",
    "--oxy-radius-xl",
    "--oxy-typography-family-brand",
    "--oxy-elevation-level2",
    "--oxy-motion-spring-spatial-default-easing",
  ]) {
    expect(readVar(neutralButton, name)).toBe(neutralTheme.vars[name as keyof Theme["vars"]]);
    expect(readVar(materialButton, name)).toBe(brand.vars[name as keyof Theme["vars"]]);
    expect(readVar(materialButton, name)).not.toBe(readVar(neutralButton, name));
  }

  page.remove();
});
