import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { ColorArea, ColorThumb, OxyProvider, type ColorAreaProps } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const thumbOf = () => screen.getAllByRole("slider")[0]!.closest("[data-rac]:not(input)")!;

const Area = (props: Partial<ColorAreaProps>) => (
  <ColorArea aria-label="Tint" defaultValue="hsb(0, 50%, 50%)" data-testid="area" {...props}>
    <ColorThumb />
  </ColorArea>
);

describe("ColorArea keeps the React Aria API", () => {
  test("moves both channels with the keyboard and forwards refs", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<Area ref={ref} onChange={onChange} xChannel="saturation" yChannel="brightness" />);

    const [x, y] = screen.getByTestId("area").querySelectorAll("input");
    fireEvent.keyDown(x!, { key: "ArrowRight" });
    fireEvent.keyDown(y!, { key: "ArrowUp" });

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.lastCall![0].getChannelValue("saturation")).toBe(51);
    expect(onChange.mock.lastCall![0].getChannelValue("brightness")).toBe(51);
    expect(ref.current).toBe(screen.getByTestId("area"));
  });

  test("passes the render state to children and className", () => {
    render(
      <ColorArea
        aria-label="Tint"
        isDisabled
        defaultValue="#ff0000"
        className={({ isDisabled }) => (isDisabled ? "opacity-50" : "")}
      >
        {({ state }) => <ColorThumb data-color={state.value.toString("hex")} />}
      </ColorArea>,
    );

    expect(classesOf(screen.getByRole("group")).has("opacity-50")).toBe(true);
    expect(screen.getAllByRole("slider")[0]!.hasAttribute("disabled")).toBe(true);
    expect(thumbOf().getAttribute("data-color")).toBe("#FF0000");
  });
});

describe("ColorArea styling", () => {
  test("the thumb slot takes static and state-driven classes and keeps a touch target", () => {
    render(<Area classNames={{ thumb: ({ isDisabled }) => (isDisabled ? "off" : "size-2xl") }} />);

    expect(classesOf(thumbOf()).has("size-2xl")).toBe(true);
    expect(thumbOf().querySelector('[data-slot="touch-target"]')).not.toBeNull();
  });

  test("unstyled passes classes through, as a prop and from OxyProvider", () => {
    render(
      <>
        <Area unstyled className="size-3xl" classNames={{ thumb: "dot" }} />
        <OxyProvider unstyled>
          <Area aria-label="Inherited" data-testid="inherited" className="size-3xl" />
        </OxyProvider>
      </>,
    );

    expect(screen.getByTestId("area").className).toBe("size-3xl");
    expect(screen.getByTestId("inherited").className).toBe("size-3xl");
    expect(thumbOf().className).toBe("dot");
    expect(thumbOf().querySelector('[data-slot="touch-target"]')).toBeNull();
  });
});
