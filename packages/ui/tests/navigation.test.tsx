import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef, useState } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Button,
  ModalNavigationDrawer,
  NavigationBar,
  NavigationDrawer,
  NavigationItem,
  NavigationRail,
  NavigationSection,
  OxyProvider,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);
const link = (name: string | RegExp) => screen.getByRole("link", { name });

describe("NavigationItem keeps the React Aria Link API", () => {
  test("renders a link with its ref, press events and current page", () => {
    const onPress = vi.fn();
    const ref = createRef<HTMLAnchorElement>();
    render(
      <NavigationBar aria-label="Main">
        <NavigationItem ref={ref} href="#home" icon="⌂" aria-current="page">
          Home
        </NavigationItem>
        <NavigationItem href="#search" icon="⌕" onPress={onPress}>
          Search
        </NavigationItem>
      </NavigationBar>,
    );

    expect(screen.getByRole("navigation", { name: "Main" }).tagName).toBe("NAV");
    expect(ref.current).toBe(link("Home"));
    expect(link("Home").getAttribute("aria-current")).toBe("page");
    expect(link("Home").hasAttribute("data-current")).toBe(true);
    expect(slotOf(link("Home"), "icon")?.textContent).toBe("⌂");

    fireEvent.click(link("Search"));
    expect(onPress).toHaveBeenCalledOnce();
  });

  test("a badge joins the accessible name unless it is a plain dot", () => {
    render(
      <NavigationRail aria-label="Rail">
        <NavigationItem href="#inbox" icon="✉" badge="3">
          Inbox
        </NavigationItem>
        <NavigationItem href="#chat" icon="☏" badge>
          Chat
        </NavigationItem>
      </NavigationRail>,
    );

    expect(slotOf(link(/Inbox/), "badge")?.textContent).toBe("3");
    expect(link(/Inbox/).textContent).toContain("3");
    expect(slotOf(link("Chat"), "badge")?.getAttribute("aria-hidden")).toBe("true");
  });

  test("render props receive the link state", () => {
    render(
      <NavigationDrawer aria-label="Drawer">
        <NavigationItem href="#a" aria-current="page">
          {({ isCurrent }) => (isCurrent ? "A (current)" : "A")}
        </NavigationItem>
      </NavigationDrawer>,
    );

    expect(link("A (current)")).toBeTruthy();
  });
});

describe("Navigation containers", () => {
  test("containers lay their items out differently and consume their variants", () => {
    render(
      <>
        <NavigationBar aria-label="Bar">
          <NavigationItem href="#a">Bar item</NavigationItem>
        </NavigationBar>
        <NavigationBar aria-label="Horizontal bar" className="horizontal px-md">
          <NavigationItem href="#a">Horizontal item</NavigationItem>
        </NavigationBar>
        <NavigationRail aria-label="Rail">
          <NavigationItem href="#a">Rail item</NavigationItem>
        </NavigationRail>
        <NavigationRail aria-label="Expanded rail" className="expanded">
          <NavigationItem href="#a">Expanded item</NavigationItem>
        </NavigationRail>
        <NavigationDrawer aria-label="Drawer">
          <NavigationItem href="#a">Drawer item</NavigationItem>
        </NavigationDrawer>
      </>,
    );

    const bar = classesOf(screen.getByRole("navigation", { name: "Horizontal bar" }));
    expect(bar.has("horizontal")).toBe(false);
    expect(bar.has("px-md")).toBe(true);
    expect(
      classesOf(screen.getByRole("navigation", { name: "Expanded rail" })).has("expanded"),
    ).toBe(false);

    const names = ["Bar item", "Horizontal item", "Rail item", "Expanded item"];
    expect(new Set(names.map((name) => link(name).className)).size).toBe(names.length);
    expect(link("Drawer item").className).toBe(link("Expanded item").className);
  });

  test("item slots take static and state-driven classes", () => {
    render(
      <NavigationBar aria-label="Bar">
        <NavigationItem
          href="#a"
          icon="★"
          badge="1"
          aria-current="page"
          className="type-label-large"
          classNames={{
            indicator: ({ isCurrent }) => (isCurrent ? "bg-tertiary-container" : ""),
            icon: "text-tertiary",
            badge: "bg-primary",
            label: "text-on-surface",
          }}
        >
          Slots
        </NavigationItem>
      </NavigationBar>,
    );

    const item = link(/Slots/);
    expect(classesOf(item).has("type-label-large")).toBe(true);
    expect(classesOf(slotOf(item, "indicator")!).has("bg-tertiary-container")).toBe(true);
    expect(classesOf(slotOf(item, "icon")!).has("text-tertiary")).toBe(true);
    expect(classesOf(slotOf(item, "badge")!).has("bg-primary")).toBe(true);
    expect(classesOf(slotOf(item, "label")!).has("text-on-surface")).toBe(true);
  });

  test("a section groups items under a headline", () => {
    render(
      <NavigationDrawer aria-label="Mail">
        <NavigationSection title="Labels" classNames={{ headline: "text-primary" }}>
          <NavigationItem href="#family">Family</NavigationItem>
        </NavigationSection>
      </NavigationDrawer>,
    );

    const section = screen.getByRole("group", { name: "Labels" });
    expect(section.contains(link("Family"))).toBe(true);
    expect(classesOf(slotOf(section, "headline")!).has("text-primary")).toBe(true);
  });

  test("unstyled containers unstyle their items", () => {
    render(
      <>
        <NavigationBar aria-label="Bare" unstyled className="flex">
          <NavigationItem href="#a" icon="★" className="p-sm">
            Bare
          </NavigationItem>
        </NavigationBar>
        <OxyProvider unstyled>
          <NavigationRail aria-label="Provider">
            <NavigationItem href="#b">Provider</NavigationItem>
          </NavigationRail>
        </OxyProvider>
      </>,
    );

    expect(screen.getByRole("navigation", { name: "Bare" }).className).toBe("flex");
    expect(link("Bare").className).toMatch(/ p-sm$/);
    expect(slotOf(link("Bare"), "indicator")).toBeNull();
    expect(slotOf(link("Bare"), "state-layer")).toBeNull();
    expect(screen.getByRole("navigation", { name: "Provider" }).hasAttribute("class")).toBe(false);
  });
});

describe("ModalNavigationDrawer", () => {
  function Example() {
    const [isOpen, setOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setOpen(true)}>Menu</Button>
        <ModalNavigationDrawer
          aria-label="Navigation"
          isOpen={isOpen}
          onOpenChange={setOpen}
          className="w-full"
          classNames={{ scrim: "bg-scrim", dialog: "p-lg" }}
        >
          {({ close }) => (
            <NavigationItem href="#inbox" onPress={close}>
              Inbox
            </NavigationItem>
          )}
        </ModalNavigationDrawer>
      </>
    );
  }

  test("opens as a labelled modal dialog and closes from an item or Escape", () => {
    render(<Example />);
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    const dialog = screen.getByRole("dialog", { name: "Navigation" });
    expect(classesOf(dialog).has("p-lg")).toBe(true);
    expect(classesOf(dialog.parentElement!).has("w-full")).toBe(true);
    expect(dialog.closest(".bg-scrim")).not.toBeNull();

    fireEvent.click(link("Inbox"));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
