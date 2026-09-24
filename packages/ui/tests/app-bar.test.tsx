import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { AppBar, Button, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);

describe("AppBar", () => {
  test("renders a header with a titled heading, subtitle and actions", () => {
    const ref = createRef<HTMLElement>();
    render(
      <AppBar
        ref={ref}
        aria-label="Inbox bar"
        title="Inbox"
        subtitle="3 unread"
        titleLevel={2}
        leading={<Button aria-label="Menu">≡</Button>}
        trailing={<Button aria-label="Search">⌕</Button>}
      />,
    );

    const header = screen.getByRole("banner", { name: "Inbox bar" });
    expect(ref.current).toBe(header);
    expect(screen.getByRole("heading", { level: 2, name: "Inbox" })).toBeTruthy();
    expect(slotOf(header, "subtitle")?.textContent).toBe("3 unread");
    expect(slotOf(header, "leading")?.contains(screen.getByRole("button", { name: "Menu" }))).toBe(
      true,
    );
    expect(
      slotOf(header, "trailing")?.contains(screen.getByRole("button", { name: "Search" })),
    ).toBe(true);
  });

  test("consumes size, alignment and scroll modifiers and keeps utilities", () => {
    render(
      <>
        <AppBar data-testid="small" title="Small" />
        <AppBar data-testid="large" title="Large" className="large center scrolled px-md" />
      </>,
    );

    const large = classesOf(screen.getByTestId("large"));
    for (const modifier of ["large", "center", "scrolled"]) expect(large.has(modifier)).toBe(false);
    expect(large.has("px-md")).toBe(true);
    expect(large).not.toEqual(classesOf(screen.getByTestId("small")));
    expect(screen.getByRole("heading", { name: "Large" }).className).not.toBe(
      screen.getByRole("heading", { name: "Small" }).className,
    );
  });

  test("slots take classes and unstyled keeps only them", () => {
    render(
      <>
        <AppBar
          data-testid="slots"
          title="Slots"
          leading="←"
          classNames={{ title: "type-title-small", leading: "p-xs", headline: "gap-xs" }}
        />
        <OxyProvider unstyled>
          <AppBar
            data-testid="bare"
            title="Bare"
            className="flex"
            classNames={{ title: "m-none" }}
          />
        </OxyProvider>
      </>,
    );

    const slots = screen.getByTestId("slots");
    expect(classesOf(screen.getByRole("heading", { name: "Slots" })).has("type-title-small")).toBe(
      true,
    );
    expect(classesOf(slotOf(slots, "leading")!).has("p-xs")).toBe(true);
    expect(classesOf(slotOf(slots, "headline")!).has("gap-xs")).toBe(true);
    expect(screen.getByTestId("bare").className).toBe("flex");
    expect(screen.getByRole("heading", { name: "Bare" }).className).toBe("m-none");
  });
});
