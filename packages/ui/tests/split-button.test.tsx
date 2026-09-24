import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Button, SplitButton, ToggleButton } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("SplitButton", () => {
  test("groups a leading action with a trailing toggle and connects their shapes", () => {
    const onPress = vi.fn();
    render(
      <>
        <SplitButton aria-label="Send options">
          <Button onPress={onPress}>Send</Button>
          <ToggleButton aria-label="More">▾</ToggleButton>
        </SplitButton>
        <Button>Alone</Button>
      </>,
    );

    const group = screen.getByRole("group", { name: "Send options" });
    const send = screen.getByRole("button", { name: "Send" });
    fireEvent.click(send);
    fireEvent.click(screen.getByRole("button", { name: "More" }));

    expect(group.contains(send)).toBe(true);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "More" }).getAttribute("aria-pressed")).toBe("true");
    expect(classesOf(send)).not.toEqual(classesOf(screen.getByRole("button", { name: "Alone" })));
  });

  test("an unstyled SplitButton keeps its buttons unconnected", () => {
    render(
      <>
        <SplitButton unstyled className="inline-flex">
          <Button>Send</Button>
        </SplitButton>
        <Button>Alone</Button>
      </>,
    );

    expect(screen.getByRole("group").className).toBe("inline-flex");
    expect(classesOf(screen.getByRole("button", { name: "Send" }))).toEqual(
      classesOf(screen.getByRole("button", { name: "Alone" })),
    );
  });
});
