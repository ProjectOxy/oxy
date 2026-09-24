import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  Input,
  Label,
  SliderTrack,
} from "../src/index.ts";

afterEach(cleanup);

test("a ColorPicker keeps its area, slider, field, swatch and presets in sync", () => {
  const onChange = vi.fn();
  render(
    <ColorPicker defaultValue="#ff0000" onChange={onChange}>
      <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness">
        <ColorThumb />
      </ColorArea>
      <ColorSlider colorSpace="hsb" channel="hue">
        <Label />
        <SliderTrack>
          <ColorThumb />
        </SliderTrack>
      </ColorSlider>
      <ColorSwatch data-testid="preview" />
      <ColorField>
        <Label>Hex</Label>
        <Input />
      </ColorField>
      <ColorSwatchPicker>
        <ColorSwatchPickerItem color="#0000ff">
          <ColorSwatch />
        </ColorSwatchPickerItem>
      </ColorSwatchPicker>
    </ColorPicker>,
  );

  const hex = screen.getByRole("textbox", { name: "Hex" }) as HTMLInputElement;
  const hue = screen.getByRole("slider", { name: "Hue" }) as HTMLInputElement;

  fireEvent.click(screen.getByRole("option"));
  expect(hex.value).toBe("#0000FF");
  expect(hue.value).toBe("240");
  expect(screen.getByTestId("preview").style.color).toBe("rgb(0, 0, 255)");

  fireEvent.change(hex, { target: { value: "#00ff00" } });
  fireEvent.blur(hex);
  expect(hue.value).toBe("120");

  fireEvent.keyDown(hue, { key: "ArrowRight" });
  expect(onChange.mock.lastCall![0].toString("hex")).toBe("#00FF04");
  expect(hex.value).toBe("#00FF04");
});
