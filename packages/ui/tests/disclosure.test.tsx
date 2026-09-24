import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTitle,
  OxyProvider,
} from "../src/index.ts";

afterEach(cleanup);

const trigger = (name: string) => screen.getByRole("button", { name });
const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);

describe("Disclosure keeps the React Aria API", () => {
  test("the title toggles the panel and reports the expanded state", () => {
    const onExpandedChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <Disclosure ref={ref} onExpandedChange={onExpandedChange}>
        <DisclosureTitle>Details</DisclosureTitle>
        <DisclosurePanel>Hidden content</DisclosurePanel>
      </Disclosure>,
    );

    const button = trigger("Details");
    const panel = document.getElementById(button.getAttribute("aria-controls")!)!;
    expect(screen.getByRole("heading", { level: 3 }).contains(button)).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hasAttribute("hidden")).toBe(true);

    fireEvent.click(button);

    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(panel.hasAttribute("hidden")).toBe(false);
    expect(ref.current?.hasAttribute("data-expanded")).toBe(true);
    expect(screen.getByRole("group").textContent).toBe("Hidden content");
  });

  test("keyboard toggles the focused title", () => {
    render(
      <Disclosure>
        <DisclosureTitle level={2}>Keyboard</DisclosureTitle>
        <DisclosurePanel>Content</DisclosurePanel>
      </Disclosure>,
    );

    const button = trigger("Keyboard");
    act(() => button.focus());
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.keyUp(button, { key: "Enter" });

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });

  test("a hand-built React Aria trigger still works inside", () => {
    render(
      <Disclosure defaultExpanded isDisabled>
        {({ isExpanded }) => (
          <>
            <button slot="trigger">{isExpanded ? "Open" : "Closed"}</button>
            <DisclosurePanel>Content</DisclosurePanel>
          </>
        )}
      </Disclosure>,
    );

    expect(screen.getByText("Open")).toBeTruthy();
  });

  test("a group expands one disclosure at a time unless told otherwise", () => {
    render(
      <DisclosureGroup defaultExpandedKeys={["a"]}>
        <Disclosure id="a">
          <DisclosureTitle>A</DisclosureTitle>
          <DisclosurePanel>Panel A</DisclosurePanel>
        </Disclosure>
        <Disclosure id="b">
          <DisclosureTitle>B</DisclosureTitle>
          <DisclosurePanel>Panel B</DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>,
    );

    expect(trigger("A").getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(trigger("B"));
    expect(trigger("A").getAttribute("aria-expanded")).toBe("false");
    expect(trigger("B").getAttribute("aria-expanded")).toBe("true");
  });
});

describe("Disclosure className", () => {
  test("consumes variants, keeps utilities and resolves functions of the state", () => {
    const className = vi.fn(({ isExpanded }: { isExpanded: boolean }) =>
      isExpanded ? "outlined shadow-level1" : "outlined",
    );
    render(
      <>
        <Disclosure data-testid="plain">
          <DisclosureTitle>Plain</DisclosureTitle>
          <DisclosurePanel>Content</DisclosurePanel>
        </Disclosure>
        <Disclosure data-testid="custom" defaultExpanded className={className}>
          <DisclosureTitle>Custom</DisclosureTitle>
          <DisclosurePanel>Content</DisclosurePanel>
        </Disclosure>
      </>,
    );

    const custom = classesOf(screen.getByTestId("custom"));
    expect(className).toHaveBeenCalledWith(expect.objectContaining({ isExpanded: true }));
    expect(custom.has("outlined")).toBe(false);
    expect(custom.has("shadow-level1")).toBe(true);
    expect(custom).not.toEqual(classesOf(screen.getByTestId("plain")));
  });

  test("the group sets the default variant and a disclosure overrides it", () => {
    render(
      <>
        <DisclosureGroup className="filled gap-lg">
          <Disclosure data-testid="grouped">
            <DisclosureTitle>Grouped</DisclosureTitle>
            <DisclosurePanel>Content</DisclosurePanel>
          </Disclosure>
          <Disclosure data-testid="override" className="outlined">
            <DisclosureTitle>Override</DisclosureTitle>
            <DisclosurePanel>Content</DisclosurePanel>
          </Disclosure>
        </DisclosureGroup>
        <Disclosure data-testid="filled" className="filled">
          <DisclosureTitle>Filled</DisclosureTitle>
          <DisclosurePanel>Content</DisclosurePanel>
        </Disclosure>
        <Disclosure data-testid="outlined" className="outlined">
          <DisclosureTitle>Outlined</DisclosureTitle>
          <DisclosurePanel>Content</DisclosurePanel>
        </Disclosure>
      </>,
    );

    const group = screen.getByTestId("grouped").parentElement!;
    expect(classesOf(group).has("gap-lg")).toBe(true);
    expect(classesOf(group).has("filled")).toBe(false);
    expect(screen.getByTestId("grouped").className).toBe(screen.getByTestId("filled").className);
    expect(screen.getByTestId("override").className).toBe(screen.getByTestId("outlined").className);
  });

  test("slots reach the title, indicator and panel with the disclosure state", () => {
    render(
      <Disclosure
        defaultExpanded
        classNames={{
          heading: "m-none",
          trigger: "px-xl",
          indicator: ({ isExpanded }) => (isExpanded ? "text-primary" : ""),
          panel: "bg-surface",
          content: "p-lg",
        }}
      >
        <DisclosureTitle className="type-title-large">Slots</DisclosureTitle>
        <DisclosurePanel className="border">Content</DisclosurePanel>
      </Disclosure>,
    );

    const button = trigger("Slots");
    const panel = screen.getByRole("group");
    expect(classesOf(screen.getByRole("heading")).has("m-none")).toBe(true);
    expect(classesOf(screen.getByRole("heading")).has("type-title-large")).toBe(true);
    expect(classesOf(button).has("px-xl")).toBe(true);
    expect(classesOf(slotOf(button, "indicator")!).has("text-primary")).toBe(true);
    expect(classesOf(panel).has("bg-surface")).toBe(true);
    expect(classesOf(panel).has("border")).toBe(true);
    expect(classesOf(slotOf(panel, "content")!).has("p-lg")).toBe(true);
  });

  test("unstyled on the group or the provider reaches every part", () => {
    render(
      <>
        <DisclosureGroup unstyled className="flex">
          <Disclosure className="p-sm">
            <DisclosureTitle>Bare</DisclosureTitle>
            <DisclosurePanel>Content</DisclosurePanel>
          </Disclosure>
        </DisclosureGroup>
        <OxyProvider unstyled>
          <Disclosure>
            <DisclosureTitle>Provider</DisclosureTitle>
            <DisclosurePanel>Content</DisclosurePanel>
          </Disclosure>
        </OxyProvider>
      </>,
    );

    for (const name of ["Bare", "Provider"]) {
      const button = trigger(name);
      expect(slotOf(button, "indicator")).toBeNull();
      expect(slotOf(button, "state-layer")).toBeNull();
      expect(screen.getAllByRole("heading").find((h) => h.contains(button))!.className).toBe("");
    }
    expect(trigger("Bare").closest(".p-sm")!.className).toBe("p-sm");
  });
});
