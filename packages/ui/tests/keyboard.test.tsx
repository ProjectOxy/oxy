import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { Keyboard, Menu, MenuItem, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("Keyboard keeps the React Aria API", () => {
  test("renders a kbd element with its ref", () => {
    const ref = createRef<HTMLElement>();
    render(<Keyboard ref={ref}>⌘K</Keyboard>);

    expect(ref.current?.tagName).toBe("KBD");
    expect(ref.current?.textContent).toBe("⌘K");
  });

  test("describes a menu item as its keyboard shortcut", () => {
    render(
      <Menu aria-label="Edit">
        <MenuItem
          id="copy"
          textValue="Copy"
          trailing={<Keyboard className="plain">Ctrl+C</Keyboard>}
        >
          Copy
        </MenuItem>
      </Menu>,
    );

    const item = screen.getByRole("menuitem", { name: "Copy" });
    const shortcut = screen.getByText("Ctrl+C");
    expect(item.getAttribute("aria-describedby")?.split(" ")).toContain(shortcut.id);
  });
});

describe("Keyboard className", () => {
  test("consumes the appearance and keeps utilities", () => {
    render(
      <>
        <Keyboard data-testid="keycap">A</Keyboard>
        <Keyboard data-testid="plain" className="plain text-primary">
          B
        </Keyboard>
      </>,
    );

    const plain = classesOf(screen.getByTestId("plain"));
    expect(plain.has("plain")).toBe(false);
    expect(plain.has("text-primary")).toBe(true);
    expect(screen.getByTestId("plain").className).not.toBe(screen.getByTestId("keycap").className);
  });

  test("unstyled keeps the reset and the given classes", () => {
    render(
      <OxyProvider unstyled>
        <Keyboard data-testid="bare" className="px-xs">
          A
        </Keyboard>
      </OxyProvider>,
    );

    expect(screen.getByTestId("bare").className).toMatch(/ px-xs$/);
  });
});
