import { forwardRef, memo } from "react";
import * as rac from "react-aria-components";
import { expect, test } from "vite-plus/test";
import config from "../rac-coverage.config.ts";
import { componentNames, coverageReport, isComponentExport } from "../src/rac-coverage.ts";

const Forwarded = forwardRef(() => null);
const Memoized = memo(() => null);
class Layout {
  layout() {}
}

test("recognises function, forwardRef and memo exports as components", () => {
  expect(isComponentExport("Button", () => null)).toBe(true);
  expect(isComponentExport("Button", Forwarded)).toBe(true);
  expect(isComponentExport("Button", Memoized)).toBe(true);
});

test("skips contexts, classes, hooks and helpers", () => {
  expect(isComponentExport("ButtonContext", { $$typeof: Symbol.for("react.context") })).toBe(false);
  expect(isComponentExport("ListLayout", Layout)).toBe(false);
  expect(isComponentExport("useFilter", () => null)).toBe(false);
  expect(isComponentExport("DEFAULT_SLOT", Symbol("slot"))).toBe(false);
});

test("reports missing wrappers and stale ignores", () => {
  const racExports = { Button: Forwarded, Slider: Forwarded, Provider: () => null, Old: Forwarded };
  const uiExports = { Button: () => null, Old: () => null };
  const report = coverageReport(racExports, uiExports, {
    enforce: true,
    ignore: ["Provider", "Old", "Gone"],
    ignorePatterns: [],
  });
  expect(report.required).toEqual(["Button", "Slider"]);
  expect(report.missing).toEqual(["Slider"]);
  expect(report.wrappedButIgnored).toEqual(["Old"]);
  expect(report.unknownIgnores).toEqual(["Gone"]);
});

test("every ignored name is a real react-aria-components component", () => {
  expect(coverageReport(rac, {}, config).unknownIgnores).toEqual([]);
});

test("the installed react-aria-components exposes the spec components", () => {
  const names = componentNames(rac);
  for (const name of ["Button", "Select", "Table", "Calendar", "ColorWheel", "Tree", "Toolbar"]) {
    expect(names).toContain(name);
  }
  expect(names).not.toContain("ListLayout");
  expect(names).not.toContain("ButtonContext");
});
