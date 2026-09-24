import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { FieldError, Switch, SwitchButton, SwitchField, Text } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const rootOf = (name: string) => screen.getByRole("switch", { name }).closest("label")!;
const slotOf = (name: string, slot: string) => rootOf(name).querySelector(`[data-slot="${slot}"]`);

describe("Switch keeps the React Aria API", () => {
  test("toggles with a click and forwards refs", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLLabelElement>();
    render(
      <Switch ref={ref} onChange={onChange}>
        Wi-Fi
      </Switch>,
    );

    fireEvent.click(screen.getByRole("switch", { name: "Wi-Fi" }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(ref.current).toBe(rootOf("Wi-Fi"));
    expect(rootOf("Wi-Fi").hasAttribute("data-selected")).toBe(true);
  });

  test("SwitchField describes its SwitchButton", () => {
    render(
      <SwitchField isInvalid>
        <SwitchButton>Backups</SwitchButton>
        <Text slot="description">Daily at night</Text>
        <FieldError>Storage is full</FieldError>
      </SwitchField>,
    );

    expect(
      screen.getByRole("switch", { name: "Backups" }).getAttribute("aria-describedby"),
    ).toContain(screen.getByText("Daily at night").id);
    expect(screen.getByText("Storage is full")).toBeTruthy();
  });
});

describe("Switch icons and slots", () => {
  test("shows icons by the icons modifier", () => {
    render(
      <>
        <Switch>Plain</Switch>
        <Switch className="checkmark">Checkmark off</Switch>
        <Switch className="checkmark" defaultSelected>
          Checkmark on
        </Switch>
        <Switch className="icons">Icons off</Switch>
      </>,
    );

    expect(slotOf("Plain", "icon")).toBeNull();
    expect(slotOf("Checkmark off", "icon")).toBeNull();
    expect(slotOf("Checkmark on", "icon")).not.toBeNull();
    expect(slotOf("Icons off", "icon")).not.toBeNull();
    expect(classesOf(rootOf("Icons off")).has("icons")).toBe(false);
  });

  test("the track and handle take classes from the switch state", () => {
    render(
      <Switch
        defaultSelected
        classNames={{
          track: ({ isSelected }) => (isSelected ? "bg-tertiary" : "bg-surface"),
          handle: "bg-on-tertiary",
        }}
      >
        Custom
      </Switch>,
    );

    expect(classesOf(slotOf("Custom", "track")!).has("bg-tertiary")).toBe(true);
    expect(classesOf(slotOf("Custom", "handle")!).has("bg-on-tertiary")).toBe(true);
  });
});
