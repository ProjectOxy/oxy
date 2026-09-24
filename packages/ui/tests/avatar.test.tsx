import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { Avatar, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const imageOf = (element: Element) => element.querySelector("img");

describe("Avatar image and fallback", () => {
  test("shows the fallback until the image loads, then only the image", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Avatar ref={ref} src="/anna.png" alt="Anna Karenina">
        AK
      </Avatar>,
    );

    const avatar = screen.getByRole("img", { name: "Anna Karenina" });
    expect(ref.current).toBe(avatar);
    expect(avatar.dataset.status).toBe("loading");
    expect(screen.getByText("AK").getAttribute("aria-hidden")).toBe("true");
    expect(imageOf(avatar)?.getAttribute("alt")).toBe("");

    fireEvent.load(imageOf(avatar)!);

    expect(avatar.dataset.status).toBe("loaded");
    expect(screen.queryByText("AK")).toBeNull();
  });

  test("keeps the fallback when the image fails and retries a new source", () => {
    const { rerender } = render(<Avatar src="/missing.png">AK</Avatar>);
    const avatar = screen.getByText("AK").parentElement!;

    fireEvent.error(imageOf(avatar)!);
    expect(avatar.dataset.status).toBe("error");
    expect(imageOf(avatar)).toBeNull();
    expect(screen.getByText("AK").hasAttribute("aria-hidden")).toBe(false);

    rerender(<Avatar src="/anna.png">AK</Avatar>);
    expect(avatar.dataset.status).toBe("loading");
    expect(imageOf(avatar)?.getAttribute("src")).toBe("/anna.png");
  });

  test("without a source renders the fallback content", () => {
    render(<Avatar data-testid="avatar">AK</Avatar>);

    const avatar = screen.getByTestId("avatar");
    expect(avatar.dataset.status).toBe("none");
    expect(avatar.hasAttribute("role")).toBe(false);
    expect(avatar.textContent).toBe("AK");
  });
});

describe("Avatar className", () => {
  test("consumes size, tone and shape, keeps utilities and styles slots by status", () => {
    render(
      <>
        <Avatar data-testid="default">A</Avatar>
        <Avatar
          data-testid="custom"
          className="xl tertiary square bg-surface"
          classNames={{ fallback: ({ status }) => `status-${status}` }}
        >
          B
        </Avatar>
      </>,
    );

    const custom = classesOf(screen.getByTestId("custom"));
    for (const variant of ["xl", "tertiary", "square"]) expect(custom.has(variant)).toBe(false);
    expect(custom.has("bg-surface")).toBe(true);
    expect(screen.getByTestId("custom").className).not.toBe(
      screen.getByTestId("default").className,
    );
    expect(classesOf(screen.getByText("B")).has("status-none")).toBe(true);
  });

  test("unstyled keeps only the reset and the given classes", () => {
    render(
      <OxyProvider unstyled>
        <Avatar data-testid="bare" className="size-2xl" classNames={{ fallback: "grow" }}>
          A
        </Avatar>
      </OxyProvider>,
    );

    expect(screen.getByTestId("bare").className).toMatch(/ size-2xl$/);
    expect(screen.getByText("A").className).toBe("grow");
  });
});
