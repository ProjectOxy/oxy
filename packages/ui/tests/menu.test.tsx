import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Button,
  Header,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  OxyProvider,
  SubmenuTrigger,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);
const item = (name: string) => screen.getByRole("menuitem", { name });

function renderMenu(onAction = vi.fn()) {
  render(
    <MenuTrigger>
      <Button>Edit</Button>
      <Menu
        aria-label="Edit"
        onAction={onAction}
        className="vibrant compact p-sm"
        classNames={{ popover: ({ placement }) => `shadow-level5 placed-${placement}` }}
      >
        <MenuItem id="cut" trailing="Ctrl+X">
          Cut
        </MenuItem>
        <MenuItem id="copy">Copy</MenuItem>
        <SubmenuTrigger>
          <MenuItem id="share">Share</MenuItem>
          <Menu aria-label="Share">
            <MenuItem id="mail">Mail</MenuItem>
          </Menu>
        </SubmenuTrigger>
      </Menu>
    </MenuTrigger>,
  );
  return onAction;
}

describe("Menu inside a MenuTrigger", () => {
  test("opens in its own popover, reports the chosen action and closes", () => {
    const onAction = renderMenu();
    const trigger = screen.getByRole("button", { name: "Edit" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("true");

    fireEvent.click(trigger);

    const menu = screen.getByRole("menu", { name: "Edit" });
    const popover = menu.closest('[data-trigger="MenuTrigger"]')!;
    expect(popover).not.toBeNull();
    expect(classesOf(popover).has("shadow-level5")).toBe(true);
    expect(classesOf(popover).has("placed-bottom")).toBe(true);
    for (const modifier of ["vibrant", "compact"])
      expect(classesOf(menu).has(modifier)).toBe(false);
    expect(classesOf(menu).has("p-sm")).toBe(true);

    fireEvent.click(item("Cut"));

    expect(onAction).toHaveBeenCalledOnce();
    expect(onAction.mock.calls[0]![0]).toBe("cut");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("keyboard moves focus between items, a submenu opens to the side and Escape closes", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    act(() => item("Copy").focus());
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item("Share"));
    expect(item("Share").getAttribute("aria-haspopup")).toBe("menu");
    expect(slotOf(item("Share"), "indicator")).not.toBeNull();

    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    const submenu = screen.getByRole("menu", { name: "Share" });
    expect(submenu.closest('[data-trigger="SubmenuTrigger"]')).not.toBeNull();

    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("Inline Menu", () => {
  test("renders in place with sections, selection checks and item slots", () => {
    const onSelectionChange = vi.fn();
    render(
      <Menu aria-label="View">
        <MenuSection
          selectionMode="single"
          defaultSelectedKeys={["list"]}
          onSelectionChange={onSelectionChange}
        >
          <Header>Layout</Header>
          <MenuItem id="grid" icon="▦" classNames={{ icon: "text-primary" }}>
            Grid
          </MenuItem>
          <MenuItem
            id="list"
            description="One row per file"
            classNames={{ indicator: "text-tertiary" }}
          >
            List
          </MenuItem>
        </MenuSection>
      </Menu>,
    );

    const menu = screen.getByRole("menu", { name: "View" });
    expect(menu.closest("[data-trigger]")).toBeNull();
    expect(screen.getByRole("group", { name: "Layout" })).toBeTruthy();

    const list = screen.getByRole("menuitemradio", { name: "List" });
    expect(list.getAttribute("aria-checked")).toBe("true");
    expect(classesOf(slotOf(list, "indicator")!).has("text-tertiary")).toBe(true);
    expect(document.getElementById(list.getAttribute("aria-describedby")!)?.textContent).toBe(
      "One row per file",
    );

    const grid = screen.getByRole("menuitemradio", { name: "Grid" });
    expect(classesOf(slotOf(grid, "icon")!).has("text-primary")).toBe(true);
    expect(slotOf(grid, "indicator")).toBeNull();

    fireEvent.click(grid);
    expect([...onSelectionChange.mock.calls[0]![0]]).toEqual(["grid"]);
  });

  test("unstyled cascades to the items, as a prop and from the provider", () => {
    render(
      <>
        <Menu aria-label="Own" unstyled className="vibrant flex">
          <MenuItem id="a" className="px-md">
            A
          </MenuItem>
        </Menu>
        <OxyProvider unstyled>
          <Menu aria-label="Provider">
            <MenuItem id="b">B</MenuItem>
          </Menu>
        </OxyProvider>
      </>,
    );

    expect(screen.getByRole("menu", { name: "Own" }).className).toMatch(
      /^oxy\S+( oxy\S+)* vibrant flex$/,
    );
    expect(item("A").className).toMatch(/^oxy\S+( oxy\S+)* px-md$/);
    expect(slotOf(item("A"), "state-layer")).toBeNull();
    expect(slotOf(item("B"), "state-layer")).toBeNull();
  });
});
