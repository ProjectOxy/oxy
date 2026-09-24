import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Button, OxyProvider, Toolbar } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("Toolbar keeps the React Aria API", () => {
  test("renders a labelled toolbar with its orientation and ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Toolbar ref={ref} aria-label="Editor" orientation="vertical">
        {({ orientation }) => <Button>{orientation}</Button>}
      </Toolbar>,
    );

    const toolbar = screen.getByRole("toolbar", { name: "Editor" });
    expect(ref.current).toBe(toolbar);
    expect(toolbar.getAttribute("aria-orientation")).toBe("vertical");
    expect(screen.getByRole("button", { name: "vertical" })).toBeTruthy();
  });
});

describe("Toolbar className", () => {
  test("consumes variant modifiers and hands orientation to a className function", () => {
    const className = vi.fn(() => "floating vibrant gap-md");
    render(
      <>
        <Toolbar aria-label="Docked" />
        <Toolbar aria-label="Floating" className={className} />
      </>,
    );

    const floating = classesOf(screen.getByRole("toolbar", { name: "Floating" }));
    expect(className).toHaveBeenCalledWith(expect.objectContaining({ orientation: "horizontal" }));
    expect(floating.has("floating")).toBe(false);
    expect(floating.has("vibrant")).toBe(false);
    expect(floating.has("gap-md")).toBe(true);
    expect(floating).not.toEqual(classesOf(screen.getByRole("toolbar", { name: "Docked" })));
  });

  test("unstyled keeps only the given classes", () => {
    render(
      <OxyProvider unstyled>
        <Toolbar aria-label="Bare" className="flex gap-sm" />
      </OxyProvider>,
    );

    expect(screen.getByRole("toolbar", { name: "Bare" }).className).toBe("flex gap-sm");
  });
});
