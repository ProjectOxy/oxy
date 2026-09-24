import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { ColorField, FieldError, Input, Label, OxyProvider, Text } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("ColorField keeps the React Aria API", () => {
  test("parses hex input on blur and forwards props, events and refs", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <ColorField ref={ref} onChange={onChange} name="brand" data-testid="field">
        <Label>Brand</Label>
        <Input />
        <Text slot="description">Hex value</Text>
      </ColorField>,
    );

    const input = screen.getByRole("textbox", { name: "Brand" });
    fireEvent.change(input, { target: { value: "#6750a4" } });
    fireEvent.blur(input);

    expect(onChange.mock.lastCall![0].toString("hex")).toBe("#6750A4");
    expect((input as HTMLInputElement).value).toBe("#6750A4");
    expect(input.getAttribute("name")).toBe("brand");
    expect(ref.current).toBe(screen.getByTestId("field"));
    expect(screen.getByText("Hex value").id).toBe(input.getAttribute("aria-describedby"));
  });

  test("edits one channel and exposes it in the render state", () => {
    render(
      <ColorField channel="hue" colorSpace="hsl" defaultValue="hsl(210, 80%, 45%)">
        {({ channel }) => (
          <>
            <Label>{channel}</Label>
            <Input />
          </>
        )}
      </ColorField>,
    );

    const input = screen.getByRole("textbox", { name: "hue" }) as HTMLInputElement;
    expect(input.value).toBe("210°");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("211°");
  });
});

describe("ColorField styling", () => {
  test("consumes variants, keeps utilities and styles its parts through slots", () => {
    render(
      <ColorField
        className="outlined error w-full"
        isInvalid
        classNames={{ label: ({ isInvalid }) => (isInvalid ? "invalid-label" : "") }}
        data-testid="field"
      >
        <Label>Accent</Label>
        <Input />
        <FieldError>Not a brand color</FieldError>
      </ColorField>,
    );

    const field = screen.getByTestId("field");
    expect(classesOf(field).has("outlined")).toBe(false);
    expect(classesOf(field).has("w-full")).toBe(true);
    expect(classesOf(screen.getByText("Accent")).has("invalid-label")).toBe(true);
  });

  test("unstyled reaches the parts, as a prop and from OxyProvider", () => {
    render(
      <>
        <ColorField unstyled className="grid">
          <Label>Own</Label>
          <Input className="plain" />
        </ColorField>
        <OxyProvider unstyled>
          <ColorField className="outlined">
            <Label>Inherited</Label>
            <Input />
          </ColorField>
        </OxyProvider>
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Own" }).className).toMatch(/plain$/);
    expect(screen.getByRole("textbox", { name: "Own" }).parentElement!.className).toBe("grid");
    expect(screen.getByRole("textbox", { name: "Inherited" }).parentElement!.className).toBe(
      "outlined",
    );
  });
});
