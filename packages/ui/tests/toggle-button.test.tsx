import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { ToggleButtonContext } from "react-aria-components";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { OxyProvider, ToggleButton } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);

describe("ToggleButton keeps the React Aria API", () => {
  test("toggles its selection, forwards refs and exposes the pressed state", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <ToggleButton ref={ref} onChange={onChange} data-testid="bold">
        Bold
      </ToggleButton>,
    );

    const button = screen.getByRole("button", { name: "Bold" });
    expect(button.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.hasAttribute("data-selected")).toBe(true);
    expect(ref.current).toBe(button);
    expect(button.dataset.testid).toBe("bold");
  });

  test("stays controlled and renders children from the render state", () => {
    render(
      <ToggleButton isSelected>{({ isSelected }) => (isSelected ? "Pinned" : "Pin")}</ToggleButton>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Pinned" }));
    expect(screen.getByRole("button", { name: "Pinned" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  test("takes props from a React Aria slot context", () => {
    render(
      <ToggleButtonContext value={{ slots: { mute: { "aria-label": "Mute", isSelected: true } } }}>
        <ToggleButton slot="mute">🔇</ToggleButton>
      </ToggleButtonContext>,
    );

    expect(screen.getByRole("button", { name: "Mute" }).getAttribute("aria-pressed")).toBe("true");
  });
});

describe("ToggleButton className", () => {
  test("consumes variant modifiers and keeps utilities", () => {
    render(
      <>
        <ToggleButton>Default</ToggleButton>
        <ToggleButton className="outlined md square tertiary px-xl">Custom</ToggleButton>
      </>,
    );

    const standard = classesOf(screen.getByRole("button", { name: "Default" }));
    const custom = classesOf(screen.getByRole("button", { name: "Custom" }));
    for (const modifier of ["outlined", "md", "square", "tertiary"]) {
      expect(custom.has(modifier)).toBe(false);
    }
    expect(custom.has("px-xl")).toBe(true);
    expect(custom).not.toEqual(standard);
  });

  test("styles the selected state differently and passes it to a className function", () => {
    const className = vi.fn(({ isSelected }) => (isSelected ? "bg-primary" : "bg-surface"));
    render(
      <>
        <ToggleButton className={className}>Off</ToggleButton>
        <ToggleButton className={className} defaultSelected>
          On
        </ToggleButton>
      </>,
    );

    const off = classesOf(screen.getByRole("button", { name: "Off" }));
    const on = classesOf(screen.getByRole("button", { name: "On" }));
    expect(className).toHaveBeenCalledWith(expect.objectContaining({ isSelected: true }));
    expect(on.has("bg-primary")).toBe(true);
    expect(off.has("bg-surface")).toBe(true);
    expect([...on].filter((name) => !off.has(name)).length).toBeGreaterThan(1);
  });
});

describe("ToggleButton slots and unstyled mode", () => {
  test("slots take static and state-driven classes", () => {
    render(
      <ToggleButton
        defaultSelected
        classNames={{
          stateLayer: ({ isSelected }) => (isSelected ? "bg-on-primary" : "bg-primary"),
          touchTarget: "hidden",
        }}
      >
        Star
      </ToggleButton>,
    );

    const button = screen.getByRole("button", { name: "Star" });
    expect(classesOf(slotOf(button, "state-layer")!).has("bg-on-primary")).toBe(true);
    expect(classesOf(slotOf(button, "touch-target")!).has("hidden")).toBe(true);
  });

  test("unstyled drops theme styles, as a prop or from the provider", () => {
    render(
      <>
        <ToggleButton unstyled className="tonal bg-primary">
          Bare
        </ToggleButton>
        <OxyProvider unstyled>
          <ToggleButton className="tonal">Inherited</ToggleButton>
        </OxyProvider>
      </>,
    );

    const bare = screen.getByRole("button", { name: "Bare" });
    expect(bare.className).toMatch(/^oxy\S+( oxy\S+)* tonal bg-primary$/);
    expect(slotOf(bare, "state-layer")).toBeNull();
    expect(classesOf(screen.getByRole("button", { name: "Inherited" })).has("tonal")).toBe(true);
  });
});
