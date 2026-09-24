import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { Card, Divider, OxyProvider, Separator } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("Card", () => {
  test("renders a container that forwards props, ref and children", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} role="article" aria-label="Glacier hike">
        <h3>Glacier hike</h3>
      </Card>,
    );

    const card = screen.getByRole("article", { name: "Glacier hike" });
    expect(ref.current).toBe(card);
    expect(card.querySelector("h3")?.textContent).toBe("Glacier hike");
  });

  test("consumes the variant and keeps utilities", () => {
    render(
      <>
        <Card data-testid="elevated" />
        <Card data-testid="filled" className="filled p-none" />
        <Card data-testid="outlined" className="outlined" />
      </>,
    );

    const filled = classesOf(screen.getByTestId("filled"));
    expect(filled.has("filled")).toBe(false);
    expect(filled.has("p-none")).toBe(true);
    const classNames = ["elevated", "filled", "outlined"].map(
      (id) => screen.getByTestId(id).className,
    );
    expect(new Set(classNames).size).toBe(3);
  });

  test("unstyled keeps only the given classes", () => {
    render(
      <OxyProvider unstyled>
        <Card data-testid="bare" className="outlined p-md" />
      </OxyProvider>,
    );

    expect(screen.getByTestId("bare").className).toBe("outlined p-md");
  });
});

describe("Divider", () => {
  test("is the M3 name of Separator", () => {
    render(<Divider className="inset" />);

    expect(Divider).toBe(Separator);
    expect(screen.getByRole("separator").tagName).toBe("HR");
  });
});
