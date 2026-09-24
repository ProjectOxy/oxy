import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  FieldError,
  Label,
  Radio,
  RadioButton,
  RadioField,
  RadioGroup,
  Text,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const rootOf = (name: string) => screen.getByRole("radio", { name }).closest("label")!;

describe("RadioGroup keeps the React Aria API", () => {
  test("selects with the keyboard and reports the value", () => {
    const onChange = vi.fn();
    render(
      <RadioGroup defaultValue="s" onChange={onChange}>
        <Label>Size</Label>
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
        <Radio value="l" isDisabled>
          Large
        </Radio>
      </RadioGroup>,
    );

    const small = screen.getByRole("radio", { name: "Small" });
    fireEvent.keyDown(small, { key: "ArrowDown" });
    fireEvent.click(screen.getByRole("radio", { name: "Medium" }));

    expect(onChange).toHaveBeenLastCalledWith("m");
    expect(screen.getByRole("radiogroup", { name: "Size" })).toBeTruthy();
    expect(rootOf("Medium").hasAttribute("data-selected")).toBe(true);
    expect(rootOf("Large").hasAttribute("data-disabled")).toBe(true);
  });

  test("lays a horizontal group out in a row and keeps its supporting text", () => {
    render(
      <RadioGroup orientation="horizontal" isInvalid classNames={{ fieldError: "text-error" }}>
        <Label>Plan</Label>
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
        <Text slot="description">Billed monthly</Text>
        <FieldError>Choose a plan</FieldError>
      </RadioGroup>,
    );

    const group = screen.getByRole("radiogroup", { name: "Plan" });
    expect(group.getAttribute("aria-orientation")).toBe("horizontal");
    expect(classesOf(screen.getByText("Choose a plan")).has("text-error")).toBe(true);
    expect(screen.getByText("Billed monthly").id).toBe(
      group.getAttribute("aria-describedby")?.split(" ")[0],
    );
  });
});

describe("Radio className and slots", () => {
  test("variants are consumed and the ring and dot take classes", () => {
    render(
      <RadioGroup aria-label="Tone" defaultValue="a">
        <Radio
          value="a"
          className="tertiary compact px-sm"
          classNames={{ ring: "border-primary", dot: "hidden" }}
        >
          Styled
        </Radio>
        <Radio value="b" unstyled className="tertiary">
          Bare
        </Radio>
      </RadioGroup>,
    );

    const styled = rootOf("Styled");
    expect(classesOf(styled).has("tertiary")).toBe(false);
    expect(classesOf(styled).has("px-sm")).toBe(true);
    expect(classesOf(styled.querySelector('[data-slot="ring"]')!).has("border-primary")).toBe(true);
    expect(classesOf(styled.querySelector('[data-slot="dot"]')!).has("hidden")).toBe(true);
    expect(rootOf("Bare").className).toBe("tertiary");
    expect(rootOf("Bare").querySelector('[data-slot="control"]')).toBeNull();
  });

  test("RadioField wraps a RadioButton with its own description", () => {
    render(
      <RadioGroup aria-label="Shipping">
        <RadioField value="express">
          <RadioButton>Express</RadioButton>
          <Text slot="description">Next day</Text>
        </RadioField>
      </RadioGroup>,
    );

    const radio = screen.getByRole("radio", { name: "Express" });
    expect(radio.getAttribute("aria-describedby")).toContain(screen.getByText("Next day").id);
    expect(rootOf("Express").querySelector('[data-slot="dot"]')).not.toBeNull();
  });
});
