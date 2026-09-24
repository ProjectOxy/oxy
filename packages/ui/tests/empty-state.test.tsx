import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { Button, EmptyState, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) =>
  element.querySelector(`[data-slot="${slot}"]`) as HTMLElement | null;

describe("EmptyState", () => {
  test("renders a headline, description, decorative icon and actions", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <EmptyState
        ref={ref}
        icon={<span>inbox</span>}
        headline="No messages yet"
        headingLevel={3}
        description="Messages from your team show up here."
      >
        <Button>New message</Button>
      </EmptyState>,
    );

    const heading = screen.getByRole("heading", { name: "No messages yet", level: 3 });
    const root = ref.current!;
    expect(root.contains(heading)).toBe(true);
    expect(slotOf(root, "icon")?.getAttribute("aria-hidden")).toBe("true");
    expect(slotOf(root, "description")?.textContent).toBe("Messages from your team show up here.");
    expect(slotOf(root, "actions")?.contains(screen.getByRole("button"))).toBe(true);
  });

  test("leaves out the parts it was not given", () => {
    render(<EmptyState data-testid="empty" headline="Nothing here" />);

    const root = screen.getByTestId("empty");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Nothing here");
    for (const slot of ["icon", "description", "actions"]) expect(slotOf(root, slot)).toBeNull();
  });

  test("consumes tone and alignment, keeps utilities and styles slots", () => {
    render(
      <>
        <EmptyState data-testid="default" headline="A">
          <Button>Go</Button>
        </EmptyState>
        <EmptyState
          data-testid="custom"
          headline="B"
          className="tertiary start gap-lg"
          classNames={{ headline: "type-display-small", actions: "flex-col" }}
        >
          <Button>Go</Button>
        </EmptyState>
      </>,
    );

    const custom = screen.getByTestId("custom");
    const defaults = screen.getByTestId("default");
    expect(classesOf(custom).has("start")).toBe(false);
    expect(classesOf(custom).has("gap-lg")).toBe(true);
    expect(custom.className).not.toBe(defaults.className);
    expect(classesOf(slotOf(custom, "headline")!).has("type-display-small")).toBe(true);
    expect(slotOf(custom, "actions")!.className).not.toBe(slotOf(defaults, "actions")!.className);
  });

  test("unstyled keeps only the given classes", () => {
    render(
      <OxyProvider unstyled>
        <EmptyState
          data-testid="bare"
          headline="Bare"
          icon="icon"
          className="flex"
          classNames={{ headline: "m-none" }}
        />
      </OxyProvider>,
    );

    const root = screen.getByTestId("bare");
    expect(root.className).toBe("flex");
    expect(slotOf(root, "headline")?.className).toBe("m-none");
    expect(slotOf(root, "icon")?.hasAttribute("class")).toBe(false);
  });
});
