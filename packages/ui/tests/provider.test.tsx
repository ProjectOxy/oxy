import { createTheme } from "@oxy/tokens";
import { cleanup, render, screen } from "@testing-library/react";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { Button, OxyProvider, useStrings } from "../src/index.ts";

afterEach(cleanup);

const brand = createTheme({ color: { primary: "#006a60" } });
const promo = createTheme({ color: { primary: "#b3261e" } }, brand);

const primaryOf = (element: Element) =>
  getComputedStyle(element).getPropertyValue("--oxy-color-primary");

function Selected({ count }: { count: number }) {
  const format = useStrings();
  return <p>{format("selectedCount", { count })}</p>;
}

describe("OxyProvider", () => {
  test("applies a theme and scheme to its subtree only", () => {
    render(
      <OxyProvider theme={brand} scheme="light">
        <Button>Outer</Button>
        <OxyProvider theme={promo} scheme="dark">
          <Button>Inner</Button>
        </OxyProvider>
      </OxyProvider>,
    );

    const outer = screen.getByRole("button", { name: "Outer" });
    const inner = screen.getByRole("button", { name: "Inner" });

    expect(primaryOf(outer)).toBe("#006a60");
    expect(primaryOf(inner)).toBe("#b3261e");
    expect(outer.closest("[data-scheme]")?.getAttribute("data-scheme")).toBe("light");
    expect(inner.closest("[data-scheme]")?.getAttribute("data-scheme")).toBe("dark");
  });

  test("sets language and direction from the locale and inherits them when nested", () => {
    render(
      <OxyProvider locale="ar-EG">
        <Button>أرسل</Button>
        <OxyProvider theme={brand}>
          <Button>Nested</Button>
        </OxyProvider>
      </OxyProvider>,
    );

    const outerScope = screen.getByRole("button", { name: "أرسل" }).closest("[data-oxy-scope]");
    const innerScope = screen.getByRole("button", { name: "Nested" }).closest("[data-oxy-scope]");

    expect(outerScope?.getAttribute("dir")).toBe("rtl");
    expect(outerScope?.getAttribute("lang")).toBe("ar-EG");
    expect(innerScope).not.toBe(outerScope);
    expect(innerScope?.getAttribute("dir")).toBe("rtl");
  });

  test("renders overlays inside the themed subtree", () => {
    render(
      <OxyProvider theme={promo}>
        <DialogTrigger defaultOpen>
          <Button>Open</Button>
          <Popover>
            <Dialog aria-label="Details">Content</Dialog>
          </Popover>
        </DialogTrigger>
      </OxyProvider>,
    );

    const dialog = screen.getByRole("dialog", { name: "Details" });
    expect(dialog.closest("[data-oxy-scope]")).toBe(
      screen.getByRole("button", { name: "Open", hidden: true }).closest("[data-oxy-scope]"),
    );
    expect(primaryOf(dialog)).toBe("#b3261e");
  });

  test("provides library strings in the locale and merges overrides of nested providers", () => {
    render(
      <OxyProvider locale="ru-RU">
        <Selected count={3} />
        <OxyProvider
          strings={{ ru: { selectedCount: { one: "{count} файл", other: "Файлов: {count}" } } }}
        >
          <Selected count={21} />
          <Selected count={5} />
        </OxyProvider>
      </OxyProvider>,
    );

    expect(screen.getByText("Выбрано 3 элемента")).toBeTruthy();
    expect(screen.getByText("21 файл")).toBeTruthy();
    expect(screen.getByText("Файлов: 5")).toBeTruthy();
  });
});
