import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  type ColorSwatchPickerProps,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const swatchOf = (option: Element) => option.querySelector('[role="img"]')!;

const Picker = (props: Partial<ColorSwatchPickerProps>) => (
  <ColorSwatchPicker defaultValue="#ff0000" {...props}>
    {["#ff0000", "#00ff00", "#0000ff"].map((color) => (
      <ColorSwatchPickerItem key={color} color={color}>
        <ColorSwatch />
      </ColorSwatchPickerItem>
    ))}
  </ColorSwatchPicker>
);

describe("ColorSwatchPicker", () => {
  test("is a listbox that selects one color", () => {
    const onChange = vi.fn();
    render(<Picker onChange={onChange} />);

    const options = screen.getAllByRole("option");
    expect(screen.getByRole("listbox").getAttribute("aria-label")).toBeTruthy();
    expect(options[0]!.getAttribute("aria-selected")).toBe("true");

    fireEvent.click(options[2]!);

    expect(onChange.mock.lastCall![0].toString("hex")).toBe("#0000FF");
    expect(options[2]!.getAttribute("aria-selected")).toBe("true");
  });

  test("consumes variants and styles the items and swatches from the item state", () => {
    render(
      <Picker
        className="lg square gap-md"
        classNames={{
          item: ({ isSelected }) => (isSelected ? "on" : "off"),
          swatch: ({ isSelected }) => (isSelected ? "rounded-md" : ""),
        }}
      />,
    );

    const listbox = screen.getByRole("listbox");
    const [selected, other] = screen.getAllByRole("option");
    expect(classesOf(listbox).has("lg")).toBe(false);
    expect(classesOf(listbox).has("gap-md")).toBe(true);
    expect(classesOf(selected!).has("on")).toBe(true);
    expect(classesOf(other!).has("off")).toBe(true);
    expect(classesOf(swatchOf(selected!)).has("rounded-md")).toBe(true);
    expect(swatchOf(selected!).className).not.toBe(swatchOf(other!).className);
  });

  test("unstyled reaches the items and swatches", () => {
    render(<Picker unstyled className="row" classNames={{ item: "chip" }} />);

    const option = screen.getAllByRole("option")[1]!;
    expect(screen.getByRole("listbox").className).toBe("row");
    expect(option.className).toBe("chip");
    expect(swatchOf(option).className).toBe("");
    expect(option.querySelector('[data-slot="touch-target"]')).toBeNull();
  });
});
