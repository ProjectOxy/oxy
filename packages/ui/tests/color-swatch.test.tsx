import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { ColorSwatch, OxyProvider } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

describe("ColorSwatch", () => {
  test("is a labelled image of its color and forwards refs", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ColorSwatch ref={ref} color="#ff0000" aria-label="Brand" />);

    const swatch = screen.getByRole("img");
    expect(swatch.getAttribute("aria-label")).toMatch(/red.*Brand/i);
    expect(ref.current).toBe(swatch);
  });

  test("consumes variants, keeps utilities and paints the color over a checkerboard", () => {
    render(<ColorSwatch color="rgba(0, 0, 255, 0.5)" className="xl square shadow-level2" />);

    const swatch = screen.getByRole("img");
    expect(classesOf(swatch).has("xl")).toBe(false);
    expect(classesOf(swatch).has("square")).toBe(false);
    expect(classesOf(swatch).has("shadow-level2")).toBe(true);
    expect(swatch.style.color).toBe("rgba(0, 0, 255, 0.5)");
  });

  test("className and style functions receive the color", () => {
    render(
      <ColorSwatch
        color="#b3261e"
        className={({ color }) => (color.getChannelValue("red") > 128 ? "warm" : "cool")}
        style={({ color }) => ({ outlineColor: color.toString("hex") })}
      />,
    );

    const swatch = screen.getByRole("img");
    expect(classesOf(swatch).has("warm")).toBe(true);
    expect(swatch.style.outlineColor).toBe("rgb(179, 38, 30)");
  });

  test("unstyled keeps only React Aria's background color", () => {
    render(
      <>
        <ColorSwatch color="#00ff00" unstyled className="size-2xl" />
        <OxyProvider unstyled>
          <ColorSwatch color="#0000ff" className="lg" />
        </OxyProvider>
      </>,
    );

    const [own, inherited] = screen.getAllByRole("img");
    expect(own!.className).toBe("size-2xl");
    expect(own!.style.color).toBe("");
    expect(inherited!.className).toBe("lg");
  });
});
