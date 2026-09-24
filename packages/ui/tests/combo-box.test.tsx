import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { ComboBox, ListBoxItem, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);

const cities = [
  { id: "athens", name: "Athens" },
  { id: "berlin", name: "Berlin" },
  { id: "lisbon", name: "Lisbon" },
];

const input = () => screen.getByRole("combobox", { name: "City" });

describe("ComboBox keeps the React Aria API", () => {
  test("typing filters the options and choosing one fills the input", () => {
    const onChange = vi.fn();
    render(
      <ComboBox label="City" placeholder="Search" defaultItems={cities} onChange={onChange}>
        {(city) => <ListBoxItem id={city.id}>{city.name}</ListBoxItem>}
      </ComboBox>,
    );

    expect(input().getAttribute("placeholder")).toBe("Search");
    act(() => input().focus());
    fireEvent.change(input(), { target: { value: "li" } });

    const options = screen.getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual(["Berlin", "Lisbon"]);

    fireEvent.click(options[1]!);

    expect(onChange).toHaveBeenCalledWith("lisbon");
    expect((input() as HTMLInputElement).value).toBe("Lisbon");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  test("the indicator button opens every option and the error replaces the description", () => {
    render(
      <ComboBox
        label="City"
        description="Where the trip starts"
        isInvalid
        errorMessage="Unknown city"
        defaultItems={cities}
      >
        {(city) => <ListBoxItem id={city.id}>{city.name}</ListBoxItem>}
      </ComboBox>,
    );

    expect(screen.queryByText("Where the trip starts")).toBeNull();
    expect(document.getElementById(input().getAttribute("aria-describedby")!)?.textContent).toBe(
      "Unknown city",
    );

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  test("multiple selection shows the chosen items in the value slot", () => {
    render(
      <ComboBox
        label="City"
        selectionMode="multiple"
        defaultValue={["athens", "lisbon"]}
        defaultItems={cities}
      >
        {(city) => <ListBoxItem id={city.id}>{city.name}</ListBoxItem>}
      </ComboBox>,
    );

    expect(input().closest('[role="group"]')!.textContent).toContain("Athens");
  });
});

describe("ComboBox styling", () => {
  test("variants are consumed and parts take slot classes from the render state", () => {
    render(
      <ComboBox
        label="City"
        defaultItems={cities}
        className="outlined compact error max-w-full"
        classNames={{
          label: "text-primary",
          field: ({ isOpen }) => (isOpen ? "rounded-none" : "rounded-lg"),
          input: "type-title-medium",
          indicator: "text-tertiary",
          popover: "rounded-xs",
          listbox: "gap-xs",
        }}
      >
        {(city) => <ListBoxItem id={city.id}>{city.name}</ListBoxItem>}
      </ComboBox>,
    );

    const field = input().closest('[role="group"]')!;
    const root = field.parentElement!;
    for (const modifier of ["outlined", "compact", "error"])
      expect(classesOf(root).has(modifier)).toBe(false);
    expect(classesOf(root).has("max-w-full")).toBe(true);
    expect(classesOf(screen.getByText("City")).has("text-primary")).toBe(true);
    expect(classesOf(field).has("rounded-lg")).toBe(true);
    expect(classesOf(input()).has("type-title-medium")).toBe(true);
    expect(classesOf(screen.getByRole("button")).has("text-tertiary")).toBe(true);

    fireEvent.click(screen.getByRole("button"));

    expect(classesOf(field).has("rounded-none")).toBe(true);
    const listbox = screen.getByRole("listbox");
    expect(classesOf(listbox).has("gap-xs")).toBe(true);
    expect(classesOf(listbox.closest('[data-trigger="ComboBox"]')!).has("rounded-xs")).toBe(true);
  });

  test("unstyled keeps the input and the list, without the indicator", () => {
    render(
      <OxyProvider unstyled>
        <ComboBox label="City" defaultItems={cities}>
          {(city) => <ListBoxItem id={city.id}>{city.name}</ListBoxItem>}
        </ComboBox>
      </OxyProvider>,
    );

    expect(screen.queryByRole("button")).toBeNull();
    act(() => input().focus());
    fireEvent.change(input(), { target: { value: "a" } });
    expect(slotOf(screen.getByRole("option", { name: "Athens" }), "state-layer")).toBeNull();
  });
});
