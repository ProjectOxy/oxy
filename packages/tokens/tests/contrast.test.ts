import { expect, test } from "vite-plus/test";
import { assertContrast, checkContrast, contrastRatio, createTheme } from "../src/index.ts";

test("computes the WCAG contrast ratio", () => {
  expect(contrastRatio("#000", "#ffffff")).toBeCloseTo(21);
  expect(contrastRatio("rgb(255, 255, 255)", "#777777")).toBeCloseTo(4.48, 2);
  expect(contrastRatio("#fff", "#fff")).toBe(1);
});

test("default theme passes WCAG AA for every on-X / X pair", () => {
  const results = checkContrast();

  expect(results.map(({ foreground, background }) => `${foreground}/${background}`)).toEqual(
    expect.arrayContaining([
      "color.on-primary/color.primary",
      "color.on-primary-container/color.primary-container",
      "color.on-surface-variant/color.surface-variant",
      "color.inverse-on-surface/color.inverse-surface",
      "color.on-error-container/color.error-container",
    ]),
  );
  expect(results.every(({ passes }) => passes)).toBe(true);
  expect(() => assertContrast()).not.toThrow();
});

test("fails when an overridden pair drops below AA, following aliases", () => {
  const theme = createTheme({
    color: { primary: "#9a82db", "on-primary": "{color.primary-container}" },
  });

  expect(checkContrast(theme).filter(({ passes }) => !passes)).toEqual([
    expect.objectContaining({ foreground: "color.on-primary", background: "color.primary" }),
  ]);
  expect(() => assertContrast(theme)).toThrow(/color\.on-primary \/ color\.primary: \d\.\d{2}:1/);
});

test("fails when a pair cannot be verified", () => {
  const theme = createTheme({ color: { surface: "color-mix(in srgb, white, black)" } });
  expect(() => assertContrast(theme)).toThrow(
    "color.on-surface / color.surface: colors cannot be parsed",
  );
});
