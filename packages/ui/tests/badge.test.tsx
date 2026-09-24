import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Badge, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("Badge content", () => {
  test("formats counts for the locale and caps them at max", () => {
    render(
      <>
        <Badge data-testid="count" value={42} />
        <Badge data-testid="capped" value={1200} />
        <Badge data-testid="custom-max" value={120} max={99} />
        <OxyProvider locale="ar-EG">
          <Badge data-testid="arabic" value={1200} />
        </OxyProvider>
      </>,
    );

    expect(screen.getByTestId("count").textContent).toBe("42");
    expect(screen.getByTestId("capped").textContent).toBe("999+");
    expect(screen.getByTestId("custom-max").textContent).toBe("99+");
    expect(screen.getByTestId("arabic").textContent).toBe("٩٩٩+");
  });

  test("a badge without a value is a decorative dot unless it is labelled", () => {
    render(
      <>
        <Badge data-testid="dot" />
        <Badge aria-label="New activity" />
        <Badge value={3} aria-label="3 unread messages" />
      </>,
    );

    const dot = screen.getByTestId("dot");
    expect(dot.hasAttribute("data-dot")).toBe(true);
    expect(dot.getAttribute("aria-hidden")).toBe("true");
    expect(dot.textContent).toBe("");
    expect(screen.getByRole("img", { name: "New activity" }).hasAttribute("data-dot")).toBe(true);
    expect(screen.getByRole("img", { name: "3 unread messages" }).textContent).toBe("3");
  });

  test("children become the anchor the badge sits on", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} value={5} classNames={{ anchor: "p-xs" }}>
        <span>icon</span>
      </Badge>,
    );

    const anchor = screen.getByText("icon").parentElement!;
    expect(anchor.dataset.slot).toBe("anchor");
    expect(classesOf(anchor).has("p-xs")).toBe(true);
    expect(anchor.lastElementChild).toBe(ref.current);
    expect(ref.current?.textContent).toBe("5");
  });
});

describe("Badge className", () => {
  test("consumes the tone, keeps utilities and receives the render state", () => {
    const className = vi.fn(() => "primary rounded-xs");
    render(
      <>
        <Badge data-testid="default" value={1} />
        <Badge data-testid="custom" value={1} className={className}>
          <span>icon</span>
        </Badge>
      </>,
    );

    const custom = classesOf(screen.getByTestId("custom"));
    expect(className).toHaveBeenCalledWith(
      expect.objectContaining({ isDot: false, isAnchored: true }),
    );
    expect(custom.has("primary")).toBe(false);
    expect(custom.has("rounded-xs")).toBe(true);
  });

  test("unstyled keeps only the given classes", () => {
    render(
      <OxyProvider unstyled>
        <Badge data-testid="bare" value={2} className="bg-error" />
      </OxyProvider>,
    );

    expect(screen.getByTestId("bare").className).toBe("bg-error");
  });
});
