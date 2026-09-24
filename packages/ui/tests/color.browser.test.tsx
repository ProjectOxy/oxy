import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import {
  ColorArea,
  ColorField,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  ColorWheel,
  ColorWheelTrack,
  Input,
  Label,
  SliderTrack,
  type ColorSliderProps,
} from "../src/index.ts";
import {
  colorOf,
  loadCss,
  rectOf,
  renderStill,
  slotOf,
  styleOf,
  stylexCss,
  utilitiesCss,
  tokenValue,
} from "./browser.tsx";

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

const thumbOf = (container: HTMLElement) =>
  container.querySelector("input")!.closest("[data-rac]:not(input)") as HTMLElement;
const centerX = (element: Element) => rectOf(element).left + rectOf(element).width / 2;
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
const centerY = (element: Element) => rectOf(element).top + rectOf(element).height / 2;

const Slider = (props: ColorSliderProps) => (
  <div style={{ width: 300 }}>
    <ColorSlider data-testid="slider" {...props}>
      <Label />
      <SliderTrack data-testid="track">
        <ColorThumb />
      </SliderTrack>
    </ColorSlider>
  </div>
);

describe("ColorArea and ColorThumb", () => {
  test("a 256px rounded area with a bordered, elevated 24px thumb", () => {
    renderStill(
      <ColorArea
        aria-label="Tint"
        defaultValue="hsb(0, 50%, 50%)"
        xChannel="saturation"
        yChannel="brightness"
        data-testid="area"
      >
        <ColorThumb />
      </ColorArea>,
    );

    const area = screen.getByTestId("area");
    const thumb = thumbOf(area);
    expect(rectOf(area).width).toBe(256);
    expect(rectOf(area).height).toBe(256);
    expect(styleOf(area).borderTopLeftRadius).toBe("16px");
    expect(rectOf(thumb).width).toBe(24);
    expect(centerX(thumb) - rectOf(area).left).toBe(128);
    expect(styleOf(thumb).borderTopColor).toBe(colorOf("surface-container-lowest"));
    expect(styleOf(thumb).boxShadow).not.toBe("none");
    expect(rectOf(slotOf(thumb, "touch-target")).height).toBe(48);
  });

  test("shows the focus ring for keyboard focus and grows the thumb while dragging", async () => {
    renderStill(
      <ColorArea aria-label="Tint" defaultValue="hsb(0, 50%, 50%)" data-testid="area">
        <ColorThumb />
      </ColorArea>,
    );
    const area = screen.getByTestId("area");
    const thumb = thumbOf(area);

    await userEvent.keyboard("{Tab}");
    expect(styleOf(thumb).outlineStyle).toBe("solid");
    expect(styleOf(thumb).outlineColor).toBe(colorOf("secondary"));

    const pointer = { pointerId: 1, pointerType: "mouse", button: 0, bubbles: true };
    area.dispatchEvent(new PointerEvent("pointerdown", { ...pointer, clientX: 10, clientY: 10 }));
    await nextFrame();
    expect(rectOf(thumb).width).toBe(32);
    window.dispatchEvent(new PointerEvent("pointerup", pointer));
    await nextFrame();
    expect(rectOf(thumb).width).toBe(24);
  });

  test("mirrors the horizontal channel in an RTL locale", () => {
    renderStill(
      <ColorArea
        aria-label="Tint"
        defaultValue="hsb(0, 25%, 50%)"
        xChannel="saturation"
        yChannel="brightness"
        data-testid="area"
      >
        <ColorThumb />
      </ColorArea>,
      "ar-EG",
    );

    const area = screen.getByTestId("area");
    expect(rectOf(area).right - centerX(thumbOf(area))).toBe(64);
  });
});

describe("ColorSlider", () => {
  test("a 24px pill track with the thumb centred on it", () => {
    renderStill(<Slider channel="hue" defaultValue="hsl(90, 100%, 50%)" />);

    const track = screen.getByTestId("track");
    const thumb = thumbOf(track);
    expect(rectOf(track).width).toBe(300);
    expect(rectOf(track).height).toBe(24);
    expect(styleOf(track).borderTopLeftRadius).not.toBe("0px");
    expect(centerY(thumb)).toBe(centerY(track));
    expect(centerX(thumb) - rectOf(track).left).toBe(75);
  });

  test("an alpha track shows a checkerboard beneath its gradient", () => {
    renderStill(<Slider channel="alpha" defaultValue="hsla(0, 100%, 50%, 0.5)" />);

    const before = getComputedStyle(screen.getByTestId("track"), "::before");
    expect(before.backgroundImage).toMatch(/conic-gradient/);
    expect(before.zIndex).toBe("-1");
    expect(styleOf(screen.getByTestId("slider")).isolation).toBe("isolate");
  });

  test("a vertical slider stands 200px tall with the thumb centred across it", () => {
    renderStill(<Slider channel="hue" orientation="vertical" defaultValue="hsl(90, 100%, 50%)" />);

    const track = screen.getByTestId("track");
    expect(rectOf(track).height).toBe(200);
    expect(rectOf(track).width).toBe(24);
    expect(centerX(thumbOf(track))).toBe(centerX(track));
  });

  test("mirrors in an RTL locale", () => {
    renderStill(<Slider channel="hue" defaultValue="hsl(90, 100%, 50%)" />, "ar-EG");

    const track = screen.getByTestId("track");
    expect(rectOf(track).right - centerX(thumbOf(track))).toBe(75);
  });
});

test("ColorWheel draws a 192px ring with the thumb on the middle of the track", () => {
  renderStill(
    <ColorWheel defaultValue="hsl(0, 100%, 50%)" data-testid="wheel">
      <ColorWheelTrack data-testid="track" />
      <ColorThumb />
    </ColorWheel>,
  );

  const track = screen.getByTestId("track");
  const thumb = thumbOf(screen.getByTestId("wheel"));
  expect(rectOf(track).width).toBe(192);
  expect(centerX(thumb) - rectOf(track).left).toBe(96 + 82);
  expect(centerY(thumb) - rectOf(track).top).toBe(96);
});

describe("ColorSwatch", () => {
  test("sizes and shapes follow the variants", () => {
    renderStill(
      <>
        <ColorSwatch color="#6750a4" data-testid="default" />
        <ColorSwatch color="#6750a4" className="xl square" data-testid="xl" />
      </>,
    );

    const swatch = screen.getByTestId("default");
    expect(rectOf(swatch).width).toBe(32);
    expect(styleOf(swatch).borderTopLeftRadius).toBe("50%");
    expect(rectOf(screen.getByTestId("xl")).width).toBe(64);
    expect(styleOf(screen.getByTestId("xl")).borderTopLeftRadius).toBe("8px");
  });

  test("paints the color over a checkerboard", () => {
    renderStill(<ColorSwatch color="rgba(0, 0, 255, 0.5)" data-testid="swatch" />);

    const style = styleOf(screen.getByTestId("swatch"));
    expect(style.color).toBe("rgba(0, 0, 255, 0.5)");
    expect(style.backgroundImage).toMatch(/linear-gradient.*conic-gradient/);
  });

  describe.each([
    ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
    ["utilities CSS loads first", [utilitiesCss, stylexCss]],
  ])("when the %s", (_, sheets) => {
    afterEach(() => loadCss(stylexCss, utilitiesCss));

    test("utilities beat the base and variant styles", () => {
      loadCss(...sheets);
      renderStill(<ColorSwatch color="#6750a4" className="xl square size-lg rounded-none" />);

      const swatch = screen.getByRole("img");
      expect(rectOf(swatch).width).toBe(16);
      expect(styleOf(swatch).borderTopLeftRadius).toBe("0px");
    });
  });
});

test("ColorSwatchPicker rings the selected swatch and sizes swatches from the picker", () => {
  renderStill(
    <ColorSwatchPicker defaultValue="#ff0000" className="md square">
      {["#ff0000", "#0000ff"].map((color) => (
        <ColorSwatchPickerItem key={color} color={color}>
          <ColorSwatch />
        </ColorSwatchPickerItem>
      ))}
    </ColorSwatchPicker>,
  );

  const [selected, other] = screen.getAllByRole("img");
  expect(rectOf(selected!).width).toBe(40);
  expect(styleOf(selected!).borderTopLeftRadius).toBe("8px");
  expect(styleOf(selected!).boxShadow).toContain(colorOf("on-surface"));
  expect(styleOf(other!).boxShadow).toContain(
    tokenValue("color", "var(--oxy-color-outline-variant)"),
  );
  expect(rectOf(other!).left - rectOf(selected!).right).toBe(8);
});

test("ColorField is an M3 text field", () => {
  renderStill(
    <ColorField defaultValue="#6750a4" className="outlined">
      <Label>Hex</Label>
      <Input />
    </ColorField>,
  );

  const input = screen.getByRole("textbox", { name: "Hex" });
  expect(rectOf(input).height).toBe(56);
  expect(styleOf(input).color).toBe(colorOf("on-surface"));
});
