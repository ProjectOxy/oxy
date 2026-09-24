import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Link, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("Link keeps the React Aria API", () => {
  test("renders an anchor with its href, ref and press events", () => {
    const onPress = vi.fn();
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link ref={ref} href="#docs" target="_blank" onPress={onPress}>
        Docs
      </Link>,
    );

    const link = screen.getByRole("link", { name: "Docs" });
    fireEvent.click(link);

    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("#docs");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(ref.current).toBe(link);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("exposes current and disabled states", () => {
    render(
      <>
        <Link href="#home" aria-current="page">
          Home
        </Link>
        <Link href="#settings" isDisabled>
          Settings
        </Link>
      </>,
    );

    expect(screen.getByRole("link", { name: "Home" }).hasAttribute("data-current")).toBe(true);
    expect(screen.getByRole("link", { name: "Settings" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });
});

describe("Link className", () => {
  test("consumes variant modifiers, keeps utilities and resolves functions", () => {
    render(
      <>
        <Link href="#a">Default</Link>
        <Link href="#b" className="plain error type-label-large">
          Custom
        </Link>
        <Link href="#c" className={({ isCurrent }) => (isCurrent ? "plain" : "")} aria-current>
          Current
        </Link>
      </>,
    );

    const custom = classesOf(screen.getByRole("link", { name: "Custom" }));
    expect(custom.has("plain")).toBe(false);
    expect(custom.has("error")).toBe(false);
    expect(custom.has("type-label-large")).toBe(true);
    expect(custom).not.toEqual(classesOf(screen.getByRole("link", { name: "Default" })));
    expect(classesOf(screen.getByRole("link", { name: "Current" })).has("plain")).toBe(false);
  });

  test("unstyled passes classes through untouched", () => {
    render(
      <OxyProvider unstyled>
        <Link href="#a" className="plain underline-me">
          Bare
        </Link>
      </OxyProvider>,
    );

    expect(screen.getByRole("link", { name: "Bare" }).className).toMatch(
      /^oxy\S+( oxy\S+)* plain underline-me$/,
    );
  });
});
