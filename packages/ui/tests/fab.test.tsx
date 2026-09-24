import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { ExtendedFab, Fab, FabMenu, FabMenuItem, FabMenuList, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);

describe("Fab", () => {
  test("is a React Aria button with variants, utilities and a state layer slot", () => {
    const onPress = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <>
        <Fab ref={ref} aria-label="Compose" onPress={onPress}>
          ✎
        </Fab>
        <Fab
          aria-label="Large"
          className="lg filled tertiary shadow-level1"
          classNames={{ stateLayer: "bg-error" }}
        >
          ✎
        </Fab>
      </>,
    );

    const fab = screen.getByRole("button", { name: "Compose" });
    const large = screen.getByRole("button", { name: "Large" });
    fireEvent.click(fab);

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(fab);
    for (const modifier of ["lg", "filled", "tertiary"])
      expect(classesOf(large).has(modifier)).toBe(false);
    expect(classesOf(large).has("shadow-level1")).toBe(true);
    expect(classesOf(slotOf(large, "state-layer")!).has("bg-error")).toBe(true);
  });

  test("unstyled renders the bare button", () => {
    render(
      <Fab aria-label="Bare" unstyled className="lg">
        ✎
      </Fab>,
    );

    const fab = screen.getByRole("button", { name: "Bare" });
    expect(fab.className).toMatch(/^oxy\S+( oxy\S+)* lg$/);
    expect(slotOf(fab, "state-layer")).toBeNull();
  });
});

describe("ExtendedFab", () => {
  test("keeps its label as the accessible name when collapsed", () => {
    render(
      <>
        <ExtendedFab icon={<span>✎</span>}>Compose</ExtendedFab>
        <ExtendedFab icon={<span>✎</span>} className="collapsed">
          Reply
        </ExtendedFab>
      </>,
    );

    const extended = screen.getByRole("button", { name: "Compose" });
    const collapsed = screen.getByRole("button", { name: "Reply" });
    expect(classesOf(collapsed).has("collapsed")).toBe(false);
    expect(classesOf(collapsed)).not.toEqual(classesOf(extended));
    expect(slotOf(collapsed, "label")!.className).not.toBe(slotOf(extended, "label")!.className);
    expect(slotOf(extended, "icon")!.textContent).toBe("✎");
  });

  test("slots take classes from the render state and render props still work", () => {
    render(
      <ExtendedFab
        isDisabled
        icon={<span>✎</span>}
        classNames={{
          icon: "text-primary",
          label: ({ isDisabled }) => (isDisabled ? "type-label-large" : ""),
        }}
      >
        {({ isDisabled }) => (isDisabled ? "Locked" : "Compose")}
      </ExtendedFab>,
    );

    const fab = screen.getByRole("button", { name: "Locked" });
    expect(classesOf(slotOf(fab, "icon")!).has("text-primary")).toBe(true);
    expect(classesOf(slotOf(fab, "label")!).has("type-label-large")).toBe(true);
  });

  test("unstyled keeps the content without theme classes", () => {
    render(
      <OxyProvider unstyled>
        <ExtendedFab icon={<span>✎</span>} className="collapsed">
          Compose
        </ExtendedFab>
      </OxyProvider>,
    );

    const fab = screen.getByRole("button", { name: "Compose" });
    expect(slotOf(fab, "label")!.getAttribute("class")).toBeNull();
    expect(slotOf(fab, "label")!.textContent).toBe("Compose");
  });
});

describe("FabMenu", () => {
  function renderMenu(onAction = vi.fn()) {
    render(
      <FabMenu>
        <Fab aria-label="Create">+</Fab>
        <FabMenuList
          aria-label="Create"
          onAction={onAction}
          className="secondary"
          classNames={{ menu: "gap-sm" }}
        >
          <FabMenuItem id="message" icon={<span>✉</span>}>
            Message
          </FabMenuItem>
          <FabMenuItem id="event" isDisabled>
            Event
          </FabMenuItem>
        </FabMenuList>
      </FabMenu>,
    );
    return onAction;
  }

  test("the FAB opens a menu of actions and reports the chosen one", () => {
    const onAction = renderMenu();
    const trigger = screen.getByRole("button", { name: "Create" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("true");

    fireEvent.click(trigger);

    const menu = screen.getByRole("menu", { name: "Create" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(classesOf(menu).has("gap-sm")).toBe(true);
    expect(screen.getByRole("menuitem", { name: "Event" }).getAttribute("aria-disabled")).toBe(
      "true",
    );

    fireEvent.click(screen.getByRole("menuitem", { name: "Message" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(onAction.mock.calls[0]![0]).toBe("message");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("Escape closes the menu", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    act(() => {
      fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    });

    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("button", { name: "Create" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });
});
