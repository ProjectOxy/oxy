import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  Label,
  OxyProvider,
  Slider,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  type SliderProps,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));

function Volume(props: SliderProps<number | number[]>) {
  return (
    <Slider {...props}>
      <Label>Volume</Label>
      <SliderOutput data-testid="output" />
      <SliderTrack data-testid="track">
        <SliderFill data-testid="fill" />
        <SliderThumb />
        {Array.isArray(props.defaultValue) && <SliderThumb index={1} />}
      </SliderTrack>
    </Slider>
  );
}

describe("Slider keeps the React Aria API", () => {
  test("moves with the keyboard, labels the thumb and shows the output", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<Volume ref={ref} defaultValue={40} step={10} onChange={onChange} />);

    const thumb = screen.getByRole("slider", { name: "Volume" });
    fireEvent.keyDown(thumb, { key: "ArrowRight" });

    expect(onChange).toHaveBeenCalledWith(50);
    expect(screen.getByTestId("output").textContent).toBe("50");
    expect(ref.current?.getAttribute("role")).toBe("group");
  });

  test("a range has one thumb per value", () => {
    render(<Volume defaultValue={[20, 60]} />);

    const thumbs = screen.getAllByRole("slider");
    expect(thumbs.map((thumb) => (thumb as HTMLInputElement).value)).toEqual(["20", "60"]);
    expect(screen.getByTestId("output").textContent).toMatch(/20.+60/);
  });
});

describe("Slider variants", () => {
  test("stops mark every step and the active ones differ", () => {
    render(<Volume defaultValue={30} step={10} className="stops md" />);

    const stops = screen.getByTestId("track").querySelectorAll('[data-slot="stop"]');
    expect(stops).toHaveLength(11);
    expect(stops[3]!.className).not.toBe(stops[4]!.className);
    expect(classesOf(screen.getByRole("group")).has("stops")).toBe(false);
  });

  test("a centered slider fills from the middle of the range", () => {
    render(
      <OxyProvider>
        <Volume
          defaultValue={-20}
          minValue={-50}
          maxValue={50}
          className="centered stops"
          step={10}
        />
      </OxyProvider>,
    );

    const stops = [...screen.getByTestId("track").querySelectorAll('[data-slot="stop"]')];
    const active = stops.map((stop) => stop.className === stops[5]!.className);
    expect(active).toEqual([
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ]);
    expect(screen.getByTestId("fill").getAttribute("style")).toMatch(/min\(/);
  });

  test("the labeled modifier adds a value indicator to each thumb", () => {
    render(
      <Volume
        defaultValue={[10, 90]}
        className="labeled"
        classNames={{ valueIndicator: "bg-primary" }}
      />,
    );

    const indicators = screen
      .getAllByText(/^(10|90)$/)
      .filter((node) => node.dataset.slot === "value-indicator");
    expect(indicators).toHaveLength(2);
    expect(classesOf(indicators[0]!).has("bg-primary")).toBe(true);
    expect(indicators[0]!.getAttribute("aria-hidden")).toBe("true");
  });

  test("slots take classes from the slider state", () => {
    render(
      <Volume
        defaultValue={40}
        isDisabled
        classNames={{
          track: "h-lg",
          thumb: ({ isDisabled }) => (isDisabled ? "bg-outline" : "bg-primary"),
        }}
      />,
    );

    expect(classesOf(screen.getByTestId("track")).has("h-lg")).toBe(true);
    const thumb = screen.getByRole("slider").closest("[data-rac]:not(input)")!;
    expect(classesOf(thumb).has("bg-outline")).toBe(true);
  });

  test("unstyled keeps the React Aria placement and drops the drawn parts", () => {
    render(<Volume defaultValue={40} unstyled className="stops labeled" />);

    expect(screen.getByTestId("track").querySelector('[data-slot="stop"]')).toBeNull();
    expect(screen.getByTestId("fill").getAttribute("style")).toMatch(/width: 40%/);
  });
});
