import { createTheme } from "@oxy/tokens";
import { generateUtilities } from "@oxy/utilities";
import { render, type RenderResult } from "@testing-library/react";
import type { ReactNode } from "react";
import { OxyProvider } from "../src/index.ts";

export const stylexCss = await fetch("/stylex.css").then((response) => response.text());
export const utilitiesCss = generateUtilities();
const still = createTheme({ motion: { enabled: "0" } });

export function loadCss(...sheets: string[]) {
  for (const style of document.head.querySelectorAll("style[data-test]")) style.remove();
  for (const css of sheets) {
    const style = document.createElement("style");
    style.dataset.test = "";
    style.textContent = css;
    document.head.append(style);
  }
}

export const renderStill = (children: ReactNode, locale?: string): RenderResult =>
  render(
    <OxyProvider theme={still} locale={locale}>
      {children}
    </OxyProvider>,
  );

export function tokenValue(property: string, value: string) {
  const probe = document.createElement("div");
  probe.style.setProperty(property, value);
  document.body.append(probe);
  const computed = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return computed;
}

export const colorOf = (role: string) => tokenValue("color", `var(--oxy-color-${role})`);

export const mixedOnSurface = (percent: number) =>
  tokenValue("color", `color-mix(in srgb, var(--oxy-color-on-surface) ${percent}%, transparent)`);

export const styleOf = (element: Element) => getComputedStyle(element);

export const rectOf = (element: Element) => element.getBoundingClientRect();

export const slotOf = (element: Element, slot: string) =>
  element.querySelector(`[data-slot="${slot}"]`) as HTMLElement;

export const corners = (element: Element) => {
  const style = getComputedStyle(element);
  return [
    style.borderStartStartRadius,
    style.borderStartEndRadius,
    style.borderEndStartRadius,
    style.borderEndEndRadius,
  ];
};
