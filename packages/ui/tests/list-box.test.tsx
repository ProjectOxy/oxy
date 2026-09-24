import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Header, ListBox, ListBoxItem, ListBoxSection, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);
const option = (name: string) => screen.getByRole("option", { name });

describe("ListBox keeps the React Aria API", () => {
  test("selects options, forwards refs and links descriptions", () => {
    const onSelectionChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <ListBox
        ref={ref}
        aria-label="Mail"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      >
        <ListBoxItem id="inbox">Inbox</ListBoxItem>
        <ListBoxItem id="drafts" description="Unsent messages">
          Drafts
        </ListBoxItem>
        <ListBoxItem id="spam" isDisabled>
          Spam
        </ListBoxItem>
      </ListBox>,
    );

    const listbox = screen.getByRole("listbox", { name: "Mail" });
    expect(ref.current).toBe(listbox);

    fireEvent.click(option("Drafts"));

    expect(onSelectionChange).toHaveBeenCalledOnce();
    expect([...onSelectionChange.mock.calls[0]![0]]).toEqual(["drafts"]);
    expect(option("Drafts").getAttribute("aria-selected")).toBe("true");
    expect(option("Drafts").hasAttribute("data-selected")).toBe(true);
    const description = document.getElementById(option("Drafts").getAttribute("aria-describedby")!);
    expect(description?.textContent).toBe("Unsent messages");
    expect(option("Spam").getAttribute("aria-disabled")).toBe("true");
  });

  test("type to select finds options by the text of their children", () => {
    render(
      <ListBox aria-label="Mail" selectionMode="single">
        <ListBoxItem id="inbox" icon="✉">
          Inbox
        </ListBoxItem>
        <ListBoxItem id="drafts">Drafts</ListBoxItem>
        <ListBoxItem id="sent">Sent</ListBoxItem>
      </ListBox>,
    );

    act(() => option("Inbox").focus());
    fireEvent.keyDown(document.activeElement!, { key: "s" });

    expect(document.activeElement).toBe(option("Sent"));
  });

  test("sections are groups labelled by their header", () => {
    render(
      <ListBox aria-label="Food">
        <ListBoxSection>
          <Header>Fruit</Header>
          <ListBoxItem id="apple">Apple</ListBoxItem>
        </ListBoxSection>
      </ListBox>,
    );

    expect(screen.getByRole("group", { name: "Fruit" })).toBeTruthy();
  });
});

describe("ListBox styling", () => {
  test("variants are consumed, utilities kept and className gets the render state", () => {
    render(
      <ListBox
        aria-label="Mail"
        layout="grid"
        className={({ layout }) => `segmented dense gap-sm layout-${layout}`}
      >
        <ListBoxItem id="inbox">Inbox</ListBoxItem>
      </ListBox>,
    );

    const classes = classesOf(screen.getByRole("listbox"));
    for (const modifier of ["segmented", "dense"]) expect(classes.has(modifier)).toBe(false);
    expect(classes.has("gap-sm")).toBe(true);
    expect(classes.has("layout-grid")).toBe(true);
  });

  test("item slots take static and state-driven classes, the check marks selection", () => {
    render(
      <ListBox aria-label="Mail" selectionMode="multiple" defaultSelectedKeys={["inbox"]}>
        <ListBoxItem
          id="inbox"
          icon="✉"
          description="12 unread"
          trailing="12"
          classNames={{
            icon: "text-primary",
            label: ({ isSelected }) => (isSelected ? "type-label-large" : ""),
            description: "text-tertiary",
            trailing: "text-error",
            indicator: "text-secondary",
            stateLayer: "bg-error",
          }}
        >
          Inbox
        </ListBoxItem>
        <ListBoxItem id="sent">Sent</ListBoxItem>
      </ListBox>,
    );

    const inbox = option("Inbox");
    expect(classesOf(slotOf(inbox, "icon")!).has("text-primary")).toBe(true);
    expect(classesOf(slotOf(inbox, "label")!).has("type-label-large")).toBe(true);
    expect(classesOf(slotOf(inbox, "description")!).has("text-tertiary")).toBe(true);
    expect(classesOf(slotOf(inbox, "trailing")!).has("text-error")).toBe(true);
    expect(classesOf(slotOf(inbox, "indicator")!).has("text-secondary")).toBe(true);
    expect(classesOf(slotOf(inbox, "state-layer")!).has("bg-error")).toBe(true);
    expect(slotOf(option("Sent"), "indicator")).toBeNull();
  });

  test("unstyled mode keeps behaviour and drops decoration, as a prop and from the provider", () => {
    render(
      <>
        <ListBox aria-label="Own" unstyled className="segmented flex" selectionMode="single">
          <ListBoxItem id="a" className="px-md">
            A
          </ListBoxItem>
        </ListBox>
        <OxyProvider unstyled>
          <ListBox aria-label="Provider" selectionMode="single" defaultSelectedKeys={["b"]}>
            <ListBoxItem id="b">B</ListBoxItem>
          </ListBox>
        </OxyProvider>
      </>,
    );

    const own = screen.getByRole("listbox", { name: "Own" });
    expect(own.className).toMatch(/^oxy\S+( oxy\S+)* segmented flex$/);
    expect(classesOf(option("A")).has("px-md")).toBe(true);
    expect(slotOf(option("A"), "state-layer")).toBeNull();
    expect(slotOf(option("B"), "state-layer")).toBeNull();
    expect(slotOf(option("B"), "indicator")).toBeNull();
    expect(option("B").getAttribute("aria-selected")).toBe("true");
  });
});
