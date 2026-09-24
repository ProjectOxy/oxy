import { createTheme, type Theme, tokenEntries, tokens } from "@oxy/tokens";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { springTransition } from "../src/gestures.ts";
import { motionAllowed } from "../src/generate.ts";
import { motionAllowedVar, reducedMotionQuery, springVars } from "../src/index.ts";
import { duration } from "../src/motion.stylex.ts";

function applyVars(element: HTMLElement, vars: Record<string, string>) {
  for (const [name, value] of Object.entries(vars)) element.style.setProperty(name, value);
  return element;
}

function resolvedMs(element: Element, expression: string): number {
  const style = getComputedStyle(element);
  const resolved = expression.replace(/var\((--[\w-]+)\)/g, (_, name: string) =>
    String(resolvedMs(element, style.getPropertyValue(name).trim())),
  );
  const factors = resolved.replace(/^calc\((.*)\)$/, "$1").split("*");
  return factors.reduce((product, factor) => product * Number.parseFloat(factor), 1);
}

let root: HTMLElement;
let themed: HTMLElement;

function mount(theme?: Theme) {
  root = applyVars(document.createElement("div"), {
    ...Object.fromEntries(tokenEntries(tokens).map(({ cssVar, value }) => [cssVar, value])),
    ...springVars(),
    [motionAllowedVar]: motionAllowed.default,
  });
  themed = applyVars(document.createElement("div"), theme?.vars ?? {});
  root.append(themed);
  document.body.append(root);
}

afterEach(() => {
  root.remove();
  vi.unstubAllGlobals();
});

describe("CSS durations", () => {
  test("follow the tokens while motion is on", () => {
    mount();
    expect(resolvedMs(themed, duration.medium2)).toBe(300);
    expect(resolvedMs(themed, duration.extraLong4)).toBe(1000);
    expect(resolvedMs(themed, duration.spatialDefault)).toBe(325);
  });

  test("drop to zero inside a subtree themed with motion.enabled = 0", () => {
    mount(createTheme({ motion: { enabled: "0" } }));
    expect(resolvedMs(root, duration.medium2)).toBe(300);
    for (const value of Object.values(duration)) expect(resolvedMs(themed, value)).toBe(0);
  });

  test("drop to zero when the user prefers reduced motion", () => {
    mount();
    root.style.setProperty(motionAllowedVar, motionAllowed.reduced);
    for (const value of Object.values(duration)) expect(resolvedMs(themed, value)).toBe(0);
  });
});

describe("Motion spring transitions", () => {
  const prefersReducedMotion = (matches: boolean) =>
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: matches && query === reducedMotionQuery,
    }));

  beforeEach(() => prefersReducedMotion(false));

  test("come from the spring tokens while motion is on", () => {
    mount(createTheme({ motion: { spring: { spatial: { fast: { stiffness: "1600" } } } } }));
    expect(springTransition(themed)).toEqual({
      type: "spring",
      stiffness: 700,
      damping: 0.9 * 2 * Math.sqrt(700),
      mass: 1,
    });
    expect(springTransition(themed, "spatial", "fast")).toMatchObject({ stiffness: 1600 });
  });

  test("become instant inside a subtree themed with motion.enabled = 0", () => {
    mount(createTheme({ motion: { enabled: "0" } }));
    expect(springTransition(themed)).toEqual({ duration: 0 });
    expect(springTransition(root)).toMatchObject({ type: "spring" });
  });

  test("become instant when the user prefers reduced motion", () => {
    mount();
    prefersReducedMotion(true);
    expect(springTransition(themed, "effects", "slow")).toEqual({ duration: 0 });
  });
});
