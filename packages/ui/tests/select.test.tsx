import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Button as AriaButton, Select as AriaSelect } from "react-aria-components";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { ListBoxItem, OxyProvider, Select, SelectValue } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);

const fruits = [
  { id: "apple", name: "Apple" },
  { id: "banana", name: "Banana" },
  { id: "cherry", name: "Cherry" },
];

const trigger = () => screen.getByRole("button", { name: /Fruit/, hidden: true });
const describedBy = (element: Element) =>
  (element.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .map((id) => document.getElementById(id)?.textContent)
    .join(" ");

describe("Select keeps the React Aria API", () => {
  test("labels the trigger, opens a listbox and commits the chosen option", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <form>
        <Select
          ref={ref}
          label="Fruit"
          description="Pick one"
          name="fruit"
          items={fruits}
          onChange={onChange}
        >
          {(fruit) => <ListBoxItem id={fruit.id}>{fruit.name}</ListBoxItem>}
        </Select>
      </form>,
    );

    expect(ref.current?.contains(trigger())).toBe(true);
    expect(describedBy(trigger())).toContain("Pick one");

    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole("option", { name: "Cherry" }));

    expect(onChange).toHaveBeenCalledWith("cherry");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger().textContent).toContain("Cherry");
    expect(new FormData(container.querySelector("form")!).get("fruit")).toBe("cherry");
  });

  test("keyboard opens the listbox on the selected option", () => {
    render(
      <Select label="Fruit" items={fruits} defaultValue="banana">
        {(fruit) => <ListBoxItem id={fruit.id}>{fruit.name}</ListBoxItem>}
      </Select>,
    );

    fireEvent.keyDown(trigger(), { key: "ArrowDown" });

    const banana = screen.getByRole("option", { name: "Banana" });
    expect(banana.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(banana);
  });

  test("an invalid select shows its error message instead of the description", () => {
    render(
      <Select label="Fruit" description="Pick one" isInvalid errorMessage="Required" items={fruits}>
        {(fruit) => <ListBoxItem id={fruit.id}>{fruit.name}</ListBoxItem>}
      </Select>,
    );

    expect(screen.queryByText("Pick one")).toBeNull();
    expect(describedBy(trigger())).toContain("Required");
  });
});

describe("Select styling", () => {
  test("variants are consumed and every part takes its slot classes", () => {
    render(
      <Select
        label="Fruit"
        description="Pick one"
        items={fruits}
        className={({ isOpen }) => `outlined dense tertiary w-full ${isOpen ? "is-open" : ""}`}
        classNames={{
          label: "text-primary",
          trigger: "rounded-full",
          value: ({ isOpen }) => (isOpen ? "text-tertiary" : ""),
          indicator: "text-error",
          description: "type-label-small",
          popover: "rounded-xs",
          listbox: "gap-xs",
        }}
      >
        {(fruit) => <ListBoxItem id={fruit.id}>{fruit.name}</ListBoxItem>}
      </Select>,
    );

    const root = trigger().parentElement!;
    for (const modifier of ["outlined", "dense", "tertiary"])
      expect(classesOf(root).has(modifier)).toBe(false);
    expect(classesOf(root).has("w-full")).toBe(true);
    expect(classesOf(screen.getByText("Fruit")).has("text-primary")).toBe(true);
    expect(classesOf(trigger()).has("rounded-full")).toBe(true);
    expect(classesOf(slotOf(trigger(), "indicator")!).has("text-error")).toBe(true);
    expect(classesOf(screen.getByText("Pick one")).has("type-label-small")).toBe(true);

    fireEvent.click(trigger());

    expect(classesOf(root).has("is-open")).toBe(true);
    const listbox = screen.getByRole("listbox");
    expect(classesOf(listbox).has("gap-xs")).toBe(true);
    expect(classesOf(listbox.closest('[data-trigger="Select"]')!).has("rounded-xs")).toBe(true);
    expect(classesOf(trigger().querySelector("[data-placeholder]")!).has("text-tertiary")).toBe(
      true,
    );
  });

  test("unstyled keeps every functional part and drops the decoration", () => {
    render(
      <OxyProvider unstyled>
        <Select label="Fruit" items={fruits} defaultValue="apple">
          {(fruit) => <ListBoxItem id={fruit.id}>{fruit.name}</ListBoxItem>}
        </Select>
      </OxyProvider>,
    );

    expect(slotOf(trigger(), "indicator")).toBeNull();
    fireEvent.click(trigger());
    const apple = screen.getByRole("option", { name: "Apple" });
    expect(slotOf(apple, "state-layer")).toBeNull();
    expect(apple.getAttribute("aria-selected")).toBe("true");
  });

  test("SelectValue styles the value inside a hand-built React Aria select", () => {
    render(
      <AriaSelect aria-label="Fruit">
        <AriaButton>
          <SelectValue className={({ isPlaceholder }) => (isPlaceholder ? "text-error" : "")} />
        </AriaButton>
      </AriaSelect>,
    );

    const value = screen.getByRole("button").querySelector("[data-placeholder]")!;
    expect(value.className).toMatch(/^oxy\S+( oxy\S+)* text-error$/);
  });
});
