import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Button, OxyProvider, Skeleton } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("Skeleton", () => {
  test("is hidden from assistive technology and keeps its content inert", () => {
    render(
      <>
        <Skeleton data-testid="line" />
        <Skeleton data-testid="sized">
          <Button>Continue</Button>
        </Skeleton>
      </>,
    );

    expect(screen.getByTestId("line").getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByTestId("line").childElementCount).toBe(0);
    expect(screen.queryByRole("button")).toBeNull();
    const content = screen.getByTestId("sized").firstElementChild as HTMLElement;
    expect(content.dataset.slot).toBe("content");
    expect(content.hasAttribute("inert")).toBe(true);
  });

  test("consumes shape and animation, keeps utilities and receives the render state", () => {
    const className = vi.fn(() => "circle wave size-2xl");
    render(
      <>
        <Skeleton data-testid="default" />
        <Skeleton data-testid="custom" className={className} />
      </>,
    );

    const custom = classesOf(screen.getByTestId("custom"));
    expect(className).toHaveBeenCalledWith(expect.objectContaining({ hasContent: false }));
    expect(custom.has("circle")).toBe(false);
    expect(custom.has("wave")).toBe(false);
    expect(custom.has("size-2xl")).toBe(true);
    expect(screen.getByTestId("custom").className).not.toBe(
      screen.getByTestId("default").className,
    );
  });

  test("the wave runs against the reading direction in RTL", () => {
    render(
      <>
        <Skeleton data-testid="ltr" className="wave" />
        <OxyProvider locale="he-IL">
          <Skeleton data-testid="rtl" className="wave" />
        </OxyProvider>
      </>,
    );

    expect(screen.getByTestId("rtl").className).not.toBe(screen.getByTestId("ltr").className);
  });

  test("unstyled keeps the reset and the given classes", () => {
    render(
      <OxyProvider unstyled>
        <Skeleton data-testid="bare" className="h-xl" />
      </OxyProvider>,
    );

    expect(screen.getByTestId("bare").className).toMatch(/ h-xl$/);
  });
});
