import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Menu, MenuItem, OxyProvider, Separator } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("Separator keeps the React Aria API", () => {
  test("renders a horizontal rule or a vertical separator with its ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <>
        <Separator ref={ref} />
        <Separator orientation="vertical" aria-label="Divider" />
      </>,
    );

    expect(ref.current?.tagName).toBe("HR");
    const vertical = screen.getByRole("separator", { name: "Divider" });
    expect(vertical.getAttribute("aria-orientation")).toBe("vertical");
  });

  test("works as a collection separator that keyboard navigation skips", () => {
    render(
      <Menu aria-label="Actions">
        <MenuItem id="copy">Copy</MenuItem>
        <Separator />
        <MenuItem id="delete">Delete</MenuItem>
      </Menu>,
    );

    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
    expect(screen.getByRole("separator")).toBeTruthy();
    act(() => screen.getByRole("menuitem", { name: "Copy" }).focus());
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Delete" }));
  });
});

describe("Separator className", () => {
  test("consumes inset variants, keeps utilities and receives the orientation", () => {
    const className = vi.fn(() => "middle-inset my-sm");
    render(
      <>
        <Separator data-testid="full" />
        <Separator data-testid="inset" className="inset" />
        <Separator data-testid="custom" orientation="vertical" className={className} />
      </>,
    );

    const custom = classesOf(screen.getByTestId("custom"));
    expect(className).toHaveBeenCalledWith(expect.objectContaining({ orientation: "vertical" }));
    expect(custom.has("middle-inset")).toBe(false);
    expect(custom.has("my-sm")).toBe(true);
    expect(classesOf(screen.getByTestId("inset")).has("inset")).toBe(false);
    expect(screen.getByTestId("inset").className).not.toBe(screen.getByTestId("full").className);
  });

  test("unstyled keeps the reset and the given classes", () => {
    render(
      <OxyProvider unstyled>
        <Separator data-testid="bare" className="border-outline" />
      </OxyProvider>,
    );

    expect(screen.getByTestId("bare").className).toMatch(/ border-outline$/);
  });
});
