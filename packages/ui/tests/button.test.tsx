import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { ButtonContext } from "react-aria-components";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Button, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);

describe("Button keeps the React Aria API", () => {
  test("forwards props, events, refs and state attributes", () => {
    const onPress = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} onPress={onPress} aria-describedby="hint" data-testid="save" type="submit">
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    fireEvent.click(button);

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(button);
    expect(button.getAttribute("type")).toBe("submit");
    expect(button.getAttribute("aria-describedby")).toBe("hint");
    expect(button.dataset.testid).toBe("save");
    expect(button.hasAttribute("data-rac")).toBe(true);
  });

  test("renders children as a function of the render state", () => {
    render(<Button isDisabled>{({ isDisabled }) => (isDisabled ? "Locked" : "Open")}</Button>);

    const button = screen.getByRole("button", { name: "Locked" });
    expect(button.hasAttribute("data-disabled")).toBe(true);
    expect(button.hasAttribute("disabled")).toBe(true);
  });

  test("takes props from a React Aria slot context", () => {
    const onPress = vi.fn();
    render(
      <ButtonContext value={{ slots: { close: { "aria-label": "Close", onPress } } }}>
        <Button slot="close">×</Button>
      </ButtonContext>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("Button className", () => {
  test("turns variant modifiers into styles and keeps the rest as utilities", () => {
    render(
      <>
        <Button>Default</Button>
        <Button className="tonal lg secondary square dense bg-tertiary px-xl">Custom</Button>
        <Button className="px-xl dense square secondary lg tonal bg-tertiary">Reordered</Button>
      </>,
    );

    const standard = classesOf(screen.getByRole("button", { name: "Default" }));
    const custom = classesOf(screen.getByRole("button", { name: "Custom" }));
    const reordered = classesOf(screen.getByRole("button", { name: "Reordered" }));

    for (const modifier of ["tonal", "lg", "secondary", "square", "dense"]) {
      expect(custom.has(modifier)).toBe(false);
    }
    expect(custom.has("bg-tertiary")).toBe(true);
    expect(custom.has("px-xl")).toBe(true);
    expect(custom).not.toEqual(standard);
    expect(reordered).toEqual(custom);
  });

  test("resolves a className function with the render state before parsing it", () => {
    const className = vi.fn(({ isDisabled, defaultClassName }) =>
      isDisabled ? `outlined ${defaultClassName}` : "bg-primary",
    );
    render(
      <>
        <Button className={className}>Enabled</Button>
        <Button className={className} isDisabled>
          Disabled
        </Button>
        <Button className="outlined">Outlined</Button>
      </>,
    );

    const enabled = classesOf(screen.getByRole("button", { name: "Enabled" }));
    const disabled = classesOf(screen.getByRole("button", { name: "Disabled" }));

    expect(className).toHaveBeenCalledWith(
      expect.objectContaining({ isDisabled: false, isPressed: false, isHovered: false }),
    );
    expect(enabled.has("bg-primary")).toBe(true);
    expect(disabled.has("react-aria-Button")).toBe(true);
    expect(disabled.has("outlined")).toBe(false);
    expect(disabled).not.toEqual(enabled);
  });
});

describe("Button slots", () => {
  test("accepts classes for every inner part, statically or from the render state", () => {
    render(
      <Button
        isDisabled
        classNames={{
          stateLayer: "bg-error",
          touchTarget: ({ isDisabled }) => (isDisabled ? "hidden" : "block"),
        }}
      >
        Delete
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Delete" });
    expect(classesOf(slotOf(button, "state-layer")!).has("bg-error")).toBe(true);
    expect(classesOf(slotOf(button, "touch-target")!).has("hidden")).toBe(true);
    expect(slotOf(button, "state-layer")!.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("unstyled Button", () => {
  test("drops theme styles and passes classes through untouched", () => {
    render(
      <>
        <Button className="tonal lg" unstyled>
          Bare
        </Button>
        <Button className="tonal lg">Styled</Button>
      </>,
    );

    const bare = screen.getByRole("button", { name: "Bare" });
    const styled = screen.getByRole("button", { name: "Styled" });

    expect(bare.className).toMatch(/^oxy\S+( oxy\S+)* tonal lg$/);
    expect(bare.className.split(" ").length).toBeLessThan(styled.className.split(" ").length);
    expect(slotOf(bare, "state-layer")).toBeNull();
    expect(slotOf(bare, "touch-target")).toBeNull();
    expect(slotOf(styled, "state-layer")).not.toBeNull();
  });

  test("renders a slot only when the unstyled Button is given classes for it", () => {
    render(
      <Button unstyled classNames={{ stateLayer: "my-ripple" }}>
        Bare
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Bare" });
    expect(slotOf(button, "state-layer")!.className).toBe("my-ripple");
    expect(slotOf(button, "touch-target")).toBeNull();
  });

  test("follows the nearest provider unless the prop says otherwise", () => {
    render(
      <OxyProvider unstyled>
        <Button className="tonal">Inherited</Button>
        <Button className="tonal" unstyled={false}>
          Opted out
        </Button>
        <OxyProvider unstyled={false}>
          <Button className="tonal">Nested</Button>
        </OxyProvider>
      </OxyProvider>,
    );

    expect(classesOf(screen.getByRole("button", { name: "Inherited" })).has("tonal")).toBe(true);
    expect(classesOf(screen.getByRole("button", { name: "Opted out" })).has("tonal")).toBe(false);
    expect(classesOf(screen.getByRole("button", { name: "Nested" })).has("tonal")).toBe(false);
  });
});
