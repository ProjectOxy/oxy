import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { CheckboxContext } from "react-aria-components";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Checkbox,
  CheckboxButton,
  CheckboxField,
  CheckboxGroup,
  FieldError,
  Label,
  OxyProvider,
  Text,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const rootOf = (name: string) => screen.getByRole("checkbox", { name }).closest("label")!;
const slotOf = (name: string, slot: string) => rootOf(name).querySelector(`[data-slot="${slot}"]`);

describe("Checkbox keeps the React Aria API", () => {
  test("toggles, forwards refs and exposes its state", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLLabelElement>();
    const inputRef = createRef<HTMLInputElement>();
    render(
      <Checkbox ref={ref} inputRef={inputRef} onChange={onChange} value="news">
        Newsletter
      </Checkbox>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Newsletter" });
    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(ref.current).toBe(rootOf("Newsletter"));
    expect(inputRef.current).toBe(checkbox);
    expect(rootOf("Newsletter").hasAttribute("data-selected")).toBe(true);
    expect(slotOf("Newsletter", "control")!.getAttribute("aria-hidden")).toBe("true");
  });

  test("renders an indeterminate state and render-prop children", () => {
    render(
      <Checkbox isIndeterminate>
        {({ isIndeterminate }) => (isIndeterminate ? "Some" : "All")}
      </Checkbox>,
    );

    expect(rootOf("Some").hasAttribute("data-indeterminate")).toBe(true);
    expect(slotOf("Some", "icon")!.querySelector("path")!.getAttribute("d")).toMatch(/h9/);
  });

  test("takes props from a slot context", () => {
    render(
      <CheckboxContext value={{ isSelected: true, isReadOnly: true }}>
        <Checkbox>Locked</Checkbox>
      </CheckboxContext>,
    );

    expect((screen.getByRole("checkbox", { name: "Locked" }) as HTMLInputElement).checked).toBe(
      true,
    );
  });
});

describe("Checkbox className and slots", () => {
  test("consumes tone and density modifiers and keeps utilities", () => {
    render(
      <>
        <Checkbox>Default</Checkbox>
        <Checkbox className="error dense gap-lg">Custom</Checkbox>
      </>,
    );

    const custom = classesOf(rootOf("Custom"));
    expect(custom.has("error")).toBe(false);
    expect(custom.has("dense")).toBe(false);
    expect(custom.has("gap-lg")).toBe(true);
    expect(custom).not.toEqual(classesOf(rootOf("Default")));
  });

  test("accepts classes for every inner part", () => {
    render(
      <Checkbox
        defaultSelected
        classNames={{
          box: ({ isSelected }) => (isSelected ? "rounded-full" : "rounded-none"),
          icon: "text-on-tertiary",
          stateLayer: "bg-tertiary",
        }}
      >
        Parts
      </Checkbox>,
    );

    expect(classesOf(slotOf("Parts", "box")!).has("rounded-full")).toBe(true);
    expect(slotOf("Parts", "icon")!.getAttribute("class")).toMatch(/text-on-tertiary$/);
    expect(classesOf(slotOf("Parts", "state-layer")!).has("bg-tertiary")).toBe(true);
  });

  test("unstyled drops the drawn control unless it is given classes", () => {
    render(
      <>
        <Checkbox unstyled className="error">
          Bare
        </Checkbox>
        <OxyProvider unstyled>
          <Checkbox classNames={{ control: "my-control" }}>Own control</Checkbox>
        </OxyProvider>
      </>,
    );

    expect(rootOf("Bare").className).toBe("error");
    expect(slotOf("Bare", "control")).toBeNull();
    expect(slotOf("Own control", "control")!.className).toBe("my-control");
    expect(slotOf("Own control", "box")).toBeNull();
  });
});

describe("CheckboxField and CheckboxGroup", () => {
  test("a field describes its checkbox and styles the supporting text", () => {
    render(
      <CheckboxField isRequired isInvalid classNames={{ description: "text-primary" }}>
        <CheckboxButton>Accept terms</CheckboxButton>
        <Text slot="description">Required to continue</Text>
        <FieldError>You must accept</FieldError>
      </CheckboxField>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox.getAttribute("aria-describedby")).toContain(
      screen.getByText("Required to continue").id,
    );
    expect(classesOf(screen.getByText("Required to continue")).has("text-primary")).toBe(true);
    expect(screen.getByText("You must accept")).toBeTruthy();
    expect(rootOf("Accept terms").hasAttribute("data-invalid")).toBe(true);
  });

  test("a group labels its checkboxes and collects their values", () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup
        defaultValue={["tea"]}
        onChange={onChange}
        classNames={{ label: "type-title-small" }}
      >
        <Label>Drinks</Label>
        <Checkbox value="tea">Tea</Checkbox>
        <Checkbox value="coffee">Coffee</Checkbox>
      </CheckboxGroup>,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Coffee" }));
    expect(onChange).toHaveBeenCalledWith(["tea", "coffee"]);
    expect(screen.getByRole("group", { name: "Drinks" })).toBeTruthy();
    expect(classesOf(screen.getByText("Drinks")).has("type-title-small")).toBe(true);
  });
});
