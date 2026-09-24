import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { ColorThumb, ColorWheel, ColorWheelTrack, type ColorWheelProps } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const thumbOf = () => screen.getByRole("slider").closest("[data-rac]:not(input)")!;

const Wheel = (props: Partial<ColorWheelProps>) => (
  <ColorWheel defaultValue="hsl(30, 100%, 50%)" data-testid="wheel" {...props}>
    <ColorWheelTrack data-testid="track" />
    <ColorThumb />
  </ColorWheel>
);

describe("ColorWheel", () => {
  test("turns the hue with the keyboard and forwards refs", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<Wheel ref={ref} onChange={onChange} />);

    fireEvent.keyDown(screen.getByRole("slider", { name: "Hue" }), { key: "ArrowRight" });

    expect(onChange.mock.lastCall![0].getChannelValue("hue")).toBe(31);
    expect(ref.current).toBe(screen.getByTestId("wheel"));
  });

  test("defaults the radii and keeps them overridable", () => {
    render(<Wheel />);
    expect(screen.getByTestId("track").style.width).toBe("192px");
    cleanup();

    render(<Wheel outerRadius={50} innerRadius={30} />);
    expect(screen.getByTestId("track").style.width).toBe("100px");
  });

  test("slots take the wheel state and unstyled passes classes through", () => {
    render(
      <Wheel
        isDisabled
        classNames={{
          track: "shadow-level2",
          thumb: ({ isDisabled }) => (isDisabled ? "off" : ""),
        }}
      />,
    );
    expect(classesOf(screen.getByTestId("track")).has("shadow-level2")).toBe(true);
    expect(classesOf(thumbOf()).has("off")).toBe(true);
    cleanup();

    render(<Wheel unstyled className="wheel" classNames={{ track: "ring" }} />);
    expect(screen.getByTestId("wheel").className).toBe("wheel");
    expect(screen.getByTestId("track").className).toBe("ring");
    expect(thumbOf().className).toBe("");
  });
});
