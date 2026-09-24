import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import {
  Label,
  OxyProvider,
  Slider,
  SliderFill,
  SliderThumb,
  SliderTrack,
  type SliderProps,
} from "../src/index.ts";
import {
  colorOf,
  loadCss,
  rectOf,
  renderStill,
  styleOf,
  stylexCss,
  utilitiesCss,
} from "./support/browser.tsx";

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

const Frame = ({ children }: { children: ReactNode }) => (
  <div style={{ width: 400 }}>{children}</div>
);

function Volume({
  thumbClassName,
  ...props
}: SliderProps<number | number[]> & { thumbClassName?: string }) {
  const values = props.defaultValue ?? 0;
  return (
    <Frame>
      <Slider {...props}>
        <Label>Volume</Label>
        <SliderTrack data-testid="track">
          <SliderFill data-testid="fill" />
          {(Array.isArray(values) ? values : [values]).map((_, index) => (
            <SliderThumb
              key={index}
              index={index}
              className={thumbClassName}
              data-testid={`thumb-${index}`}
            />
          ))}
        </SliderTrack>
      </Slider>
    </Frame>
  );
}

const rect = (testId: string) => rectOf(screen.getByTestId(testId));
const centerOf = (testId: string) =>
  rect(testId).left + rect(testId).width / 2 - rect("track").left;
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

describe("geometry", () => {
  test("places the handle at the value and leaves a gap before it", () => {
    renderStill(<Volume defaultValue={30} />);

    expect(rect("track").height).toBe(16);
    expect(rect("thumb-0").height).toBe(44);
    expect(rect("thumb-0").width).toBe(4);
    expect(centerOf("thumb-0")).toBe(120);
    expect(rect("fill").width).toBe(120);
    expect(styleOf(screen.getByTestId("fill")).borderRightWidth).toBe("8px");
    expect(styleOf(screen.getByTestId("fill")).backgroundColor).toBe(colorOf("primary"));
    expect(getComputedStyle(screen.getByTestId("track"), "::before").backgroundColor).toBe(
      colorOf("secondary-container"),
    );
  });

  test("sizes follow the M3 Expressive scale", () => {
    renderStill(<Volume defaultValue={50} className="xl" />);

    expect(rect("track").height).toBe(96);
    expect(rect("thumb-0").height).toBe(108);
  });

  test("a range fills between its handles with a gap at both ends", () => {
    renderStill(<Volume defaultValue={[25, 75]} />);

    expect(rect("fill").left - rect("track").left).toBe(100);
    expect(rect("fill").width).toBe(200);
    expect(styleOf(screen.getByTestId("fill")).borderLeftWidth).toBe("8px");
    expect(styleOf(screen.getByTestId("fill")).borderRightWidth).toBe("8px");
  });

  test("a centered slider fills from the middle towards the handle", () => {
    renderStill(<Volume defaultValue={-25} minValue={-50} maxValue={50} className="centered" />);

    expect(rect("fill").left - rect("track").left).toBe(100);
    expect(rect("fill").width).toBe(100);
    expect(styleOf(screen.getByTestId("fill")).borderLeftWidth).toBe("8px");
    expect(styleOf(screen.getByTestId("fill")).borderRightWidth).toBe("0px");
  });

  test("a vertical slider runs from the bottom up", () => {
    renderStill(<Volume defaultValue={25} orientation="vertical" />);

    expect(rect("track").height).toBe(200);
    expect(rect("track").width).toBe(16);
    expect(rect("thumb-0").top + rect("thumb-0").height / 2 - rect("track").top).toBe(150);
    expect(rect("fill").height).toBe(50);
  });

  test("mirrors in an RTL locale", () => {
    renderStill(<Volume defaultValue={30} />, "ar-EG");

    expect(centerOf("thumb-0")).toBe(280);
    expect(rect("fill").left - rect("track").left).toBe(280);
    expect(rect("fill").width).toBe(120);
  });
});

describe("interaction", () => {
  test("keys move the handle and a labeled slider shows its value", async () => {
    renderStill(<Volume defaultValue={30} step={10} className="labeled" />);

    await userEvent.keyboard("{Tab}{ArrowRight}");
    await nextFrame();
    const indicator = screen.getByTestId("thumb-0").querySelector('[data-slot="value-indicator"]')!;

    expect(centerOf("thumb-0")).toBe(160);
    expect(indicator.textContent).toBe("40");
    expect(styleOf(indicator).opacity).toBe("1");
    expect(styleOf(indicator).color).toBe(colorOf("inverse-on-surface"));
    expect(styleOf(indicator).backgroundColor).toBe(colorOf("inverse-surface"));
    expect(styleOf(screen.getByTestId("thumb-0")).outlineStyle).toBe("solid");
  });

  test("the handle springs to a new value with motion on", async () => {
    render(
      <OxyProvider>
        <Volume defaultValue={0} step={50} />
      </OxyProvider>,
    );

    await userEvent.keyboard("{Tab}{ArrowRight}");
    const track = screen.getByTestId("track");
    await nextFrame();
    await nextFrame();
    const midway = Number(track.style.getPropertyValue("--oxy-slider-thumb-0"));
    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(midway).toBeGreaterThan(0);
    expect(midway).toBeLessThan(50);
    expect(Number(track.style.getPropertyValue("--oxy-slider-thumb-0"))).toBeCloseTo(50);
    expect(centerOf("thumb-0")).toBeCloseTo(200, 0);
  });
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  afterEach(() => loadCss(stylexCss, utilitiesCss));

  test("utilities beat the handle styles", () => {
    loadCss(...sheets);
    renderStill(<Volume defaultValue={50} className="md" thumbClassName="bg-error w-sm" />);

    expect(styleOf(screen.getByTestId("thumb-0")).backgroundColor).toBe(colorOf("error"));
    expect(rect("thumb-0").width).toBe(8);
    expect(rect("thumb-0").height).toBe(52);
  });
});
