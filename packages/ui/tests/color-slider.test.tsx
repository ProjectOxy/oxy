import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  ColorSlider,
  ColorThumb,
  Label,
  OxyProvider,
  SliderOutput,
  SliderTrack,
  type ColorSliderProps,
} from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.className.split(" "));
const thumbOf = () => screen.getByRole("slider").closest("[data-rac]:not(input)")!;

const Hue = (props: Partial<ColorSliderProps>) => (
  <ColorSlider channel="hue" defaultValue="hsl(120, 100%, 50%)" {...props}>
    <Label data-testid="label" />
    <SliderOutput data-testid="output" />
    <SliderTrack data-testid="track">
      <ColorThumb />
    </SliderTrack>
  </ColorSlider>
);

describe("ColorSlider keeps the React Aria API", () => {
  test("labels itself with the channel, moves with the keyboard and shows the output", () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<Hue ref={ref} onChange={onChange} />);

    const thumb = screen.getByRole("slider", { name: "Hue" });
    fireEvent.keyDown(thumb, { key: "ArrowRight" });

    expect(onChange.mock.lastCall![0].getChannelValue("hue")).toBe(121);
    expect(screen.getByTestId("output").textContent).toBe("121°");
    expect(ref.current?.dataset.orientation).toBe("horizontal");
  });

  test("the track draws the channel gradient without the M3 slider parts", () => {
    render(<Hue />);

    const track = screen.getByTestId("track");
    expect(track.getAttribute("style")).toMatch(/linear-gradient/);
    expect(track.querySelector('[data-slot="stop"]')).toBeNull();
  });
});

describe("ColorSlider styling", () => {
  test("slots reach the label, output, track and thumb from the slider state", () => {
    render(
      <Hue
        isDisabled
        classNames={{
          label: "type-title-medium",
          output: "text-primary",
          track: "rounded-xs",
          thumb: ({ isDisabled }) => (isDisabled ? "bg-outline" : "bg-primary"),
        }}
      />,
    );

    expect(classesOf(screen.getByTestId("label")).has("type-title-medium")).toBe(true);
    expect(classesOf(screen.getByTestId("output")).has("text-primary")).toBe(true);
    expect(classesOf(screen.getByTestId("track")).has("rounded-xs")).toBe(true);
    expect(classesOf(thumbOf()).has("bg-outline")).toBe(true);
  });

  test("unstyled passes classes through, as a prop and from OxyProvider", () => {
    render(
      <>
        <Hue unstyled className="grid" classNames={{ track: "bar" }} />
        <OxyProvider unstyled>
          <ColorSlider channel="alpha" defaultValue="#0000ff80" data-testid="inherited">
            <SliderTrack className="line">
              <ColorThumb />
            </SliderTrack>
          </ColorSlider>
        </OxyProvider>
      </>,
    );

    expect(screen.getByTestId("track").className).toBe("bar");
    expect(screen.getByTestId("inherited").className).toBe("");
    expect(screen.getByTestId("inherited").querySelector(".line")).not.toBeNull();
  });
});
