import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { Checkbox, Radio, RadioGroup, Switch } from "../src/index.ts";
import {
  colorOf,
  loadCss,
  mixedOnSurface,
  rectOf,
  renderStill,
  styleOf,
  stylexCss,
  utilitiesCss,
} from "./browser.tsx";

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

const slotOf = (role: string, name: string, slot: string) =>
  screen
    .getByRole(role, { name })
    .closest("label")!
    .querySelector(`[data-slot="${slot}"]`) as HTMLElement;

describe("Checkbox", () => {
  test("draws an 18px box inside a 40px state layer and fills it when selected", () => {
    renderStill(
      <>
        <Checkbox>Off</Checkbox>
        <Checkbox defaultSelected className="tertiary">
          On
        </Checkbox>
        <Checkbox isInvalid>Invalid</Checkbox>
        <Checkbox isDisabled defaultSelected>
          Disabled
        </Checkbox>
      </>,
    );

    expect(rectOf(slotOf("checkbox", "Off", "box")).width).toBe(18);
    expect(rectOf(slotOf("checkbox", "Off", "control")).width).toBe(40);
    expect(styleOf(slotOf("checkbox", "Off", "box")).borderInlineStartColor).toBe(
      colorOf("on-surface-variant"),
    );
    expect(styleOf(slotOf("checkbox", "On", "box")).backgroundColor).toBe(colorOf("tertiary"));
    expect(styleOf(slotOf("checkbox", "On", "icon")).strokeDashoffset).toBe("0px");
    expect(styleOf(slotOf("checkbox", "Invalid", "box")).borderInlineStartColor).toBe(
      colorOf("error"),
    );
    expect(styleOf(slotOf("checkbox", "Disabled", "box")).backgroundColor).toBe(mixedOnSurface(38));
  });

  test("shows the focus ring for keyboard focus only and keeps a 48px touch target", async () => {
    renderStill(
      <>
        <Checkbox>Focus</Checkbox>
        <Checkbox className="dense">Dense</Checkbox>
      </>,
    );

    await userEvent.click(screen.getByText("Focus"));
    expect(styleOf(slotOf("checkbox", "Focus", "control")).outlineStyle).toBe("none");
    await userEvent.keyboard("{Tab}{Shift>}{Tab}{/Shift}");
    expect(styleOf(slotOf("checkbox", "Focus", "control")).outlineStyle).toBe("solid");
    expect(styleOf(slotOf("checkbox", "Focus", "control")).outlineColor).toBe(colorOf("secondary"));

    expect(rectOf(slotOf("checkbox", "Focus", "touch-target")).height).toBe(48);
    expect(rectOf(slotOf("checkbox", "Dense", "control")).height).toBe(32);
  });
});

test("Radio grows its dot when selected", () => {
  renderStill(
    <RadioGroup aria-label="Size" defaultValue="m">
      <Radio value="s">Small</Radio>
      <Radio value="m">Medium</Radio>
    </RadioGroup>,
  );

  expect(rectOf(slotOf("radio", "Small", "ring")).width).toBe(20);
  expect(styleOf(slotOf("radio", "Small", "dot")).scale).toBe("0");
  expect(styleOf(slotOf("radio", "Medium", "dot")).scale).toBe("1");
  expect(styleOf(slotOf("radio", "Medium", "ring")).borderInlineStartColor).toBe(
    colorOf("primary"),
  );
});

describe("Switch", () => {
  test("moves and grows the handle when selected", () => {
    renderStill(
      <>
        <Switch>Off</Switch>
        <Switch defaultSelected>On</Switch>
        <Switch className="icons">Icons</Switch>
      </>,
    );

    const offTrack = rectOf(slotOf("switch", "Off", "track"));
    const off = rectOf(slotOf("switch", "Off", "handle"));
    const onTrack = rectOf(slotOf("switch", "On", "track"));
    const on = rectOf(slotOf("switch", "On", "handle"));

    expect([offTrack.width, offTrack.height]).toEqual([52, 32]);
    expect(off.width).toBe(16);
    expect(off.left + off.width / 2 - offTrack.left).toBe(16);
    expect(on.width).toBe(24);
    expect(onTrack.right - (on.left + on.width / 2)).toBe(16);
    expect(styleOf(slotOf("switch", "On", "track")).backgroundColor).toBe(colorOf("primary"));
    expect(styleOf(slotOf("switch", "On", "handle")).backgroundColor).toBe(colorOf("on-primary"));
    expect(rectOf(slotOf("switch", "Icons", "handle")).width).toBe(24);
  });

  test("mirrors in an RTL locale", () => {
    renderStill(<Switch defaultSelected>تشغيل</Switch>, "ar-EG");

    const track = rectOf(slotOf("switch", "تشغيل", "track"));
    const handle = rectOf(slotOf("switch", "تشغيل", "handle"));
    expect(handle.left + handle.width / 2 - track.left).toBe(16);
  });
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  afterEach(() => loadCss(stylexCss, utilitiesCss));

  test("utilities beat the control styles", () => {
    loadCss(...sheets);
    renderStill(
      <Checkbox defaultSelected className="gap-xl" classNames={{ box: "bg-error rounded-full" }}>
        Custom
      </Checkbox>,
    );

    const root = screen.getByRole("checkbox").closest("label")!;
    expect(styleOf(root).columnGap).toBe("24px");
    expect(styleOf(slotOf("checkbox", "Custom", "box")).backgroundColor).toBe(colorOf("error"));
    expect(styleOf(slotOf("checkbox", "Custom", "box")).borderStartStartRadius).toBe("9999px");
  });
});
