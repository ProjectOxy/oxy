import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Breadcrumb, Breadcrumbs, Link, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`);

const items = [
  { id: "home", label: "Home", href: "#home" },
  { id: "docs", label: "Docs", href: "#docs" },
  { id: "tabs", label: "Tabs", href: "#tabs" },
];

describe("Breadcrumbs keep the React Aria API", () => {
  test("renders an ordered list where the last item is the current page", () => {
    const onAction = vi.fn();
    const ref = createRef<HTMLOListElement>();
    render(
      <Breadcrumbs ref={ref} aria-label="Location" items={items} onAction={onAction}>
        {(item) => (
          <Breadcrumb>
            <Link href={item.href}>{item.label}</Link>
          </Breadcrumb>
        )}
      </Breadcrumbs>,
    );

    const current = screen.getByRole("link", { name: "Tabs" });
    expect(ref.current?.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(current.hasAttribute("data-current")).toBe(true);

    fireEvent.click(screen.getByRole("link", { name: "Docs" }));
    expect(onAction).toHaveBeenCalledWith("docs");
  });

  test("separators follow every item but the current one and stay hidden from assistive tech", () => {
    render(
      <Breadcrumbs>
        <Breadcrumb id="a">
          <Link>A</Link>
        </Breadcrumb>
        <Breadcrumb id="b">
          {({ isCurrent }) => <Link>{isCurrent ? "B (current)" : "B"}</Link>}
        </Breadcrumb>
      </Breadcrumbs>,
    );

    const [first, last] = screen.getAllByRole("listitem");
    expect(slotOf(first!, "separator")?.getAttribute("aria-hidden")).toBe("true");
    expect(slotOf(last!, "separator")).toBeNull();
    expect(screen.getByRole("link", { name: "B (current)" })).toBeTruthy();
  });
});

describe("Breadcrumbs className", () => {
  test("links inside a breadcrumb take its link style and slot classes", () => {
    render(
      <>
        <Link href="#alone">Alone</Link>
        <Breadcrumbs className="gap-md">
          <Breadcrumb
            id="a"
            className={({ isCurrent }) => (isCurrent ? "" : "pe-sm")}
            classNames={{ link: "type-label-large", separator: "text-primary" }}
          >
            <Link href="#a">Inside</Link>
          </Breadcrumb>
          <Breadcrumb id="b">
            <Link href="#b">Current</Link>
          </Breadcrumb>
        </Breadcrumbs>
      </>,
    );

    const inside = screen.getByRole("link", { name: "Inside" });
    const item = inside.closest("li")!;
    expect(classesOf(screen.getByRole("list")).has("gap-md")).toBe(true);
    expect(classesOf(item).has("pe-sm")).toBe(true);
    expect(classesOf(inside).has("type-label-large")).toBe(true);
    expect(classesOf(slotOf(item, "separator")!).has("text-primary")).toBe(true);
    expect(classesOf(inside)).not.toEqual(classesOf(screen.getByRole("link", { name: "Alone" })));
  });

  test("unstyled breadcrumbs keep only the given classes", () => {
    render(
      <OxyProvider unstyled>
        <Breadcrumbs className="flex">
          <Breadcrumb id="a" className="p-xs">
            <Link href="#a">A</Link>
          </Breadcrumb>
          <Breadcrumb id="b">
            <Link href="#b">B</Link>
          </Breadcrumb>
        </Breadcrumbs>
      </OxyProvider>,
    );

    const [first] = screen.getAllByRole("listitem");
    expect(first!.className).toBe("p-xs");
    expect(slotOf(first!, "separator")).toBeNull();
  });
});
