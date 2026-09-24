import { cleanup, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { DropZone, Meter, ProgressBar, Text } from "../src/index.ts";
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
const slotOf = (name: string, slot: string, role = "progressbar") =>
  screen.getByRole(role, { name }).querySelector(`[data-slot="${slot}"]`) as HTMLElement;

describe("linear progress", () => {
  test("draws the active indicator, a gap, the track and a stop", () => {
    renderStill(
      <Frame>
        <ProgressBar value={25} aria-label="Upload" />
      </Frame>,
    );

    const indicator = rectOf(slotOf("Upload", "indicator"));
    const active = rectOf(slotOf("Upload", "active-indicator"));
    const track = rectOf(slotOf("Upload", "track"));
    const stop = getComputedStyle(slotOf("Upload", "indicator"), "::after");

    expect([indicator.width, indicator.height]).toEqual([400, 4]);
    expect(active.width).toBe(100);
    expect(track.left - indicator.left).toBe(104);
    expect(styleOf(slotOf("Upload", "active-indicator")).backgroundColor).toBe(colorOf("primary"));
    expect(styleOf(slotOf("Upload", "track")).backgroundColor).toBe(colorOf("secondary-container"));
    expect(stop.backgroundColor).toBe(colorOf("primary"));
  });

  test("a wavy indicator masks a wave and leaves room for it", () => {
    renderStill(
      <Frame>
        <ProgressBar value={60} className="wavy" aria-label="Wavy" />
      </Frame>,
    );

    expect(rectOf(slotOf("Wavy", "indicator")).height).toBe(10);
    expect(styleOf(slotOf("Wavy", "active-indicator")).maskImage).toContain("svg");
  });

  test("fills from the inline start in an RTL locale", () => {
    renderStill(
      <Frame>
        <ProgressBar value={25} aria-label="تحميل" />
      </Frame>,
      "ar-EG",
    );

    const indicator = rectOf(slotOf("تحميل", "indicator"));
    expect(indicator.right - rectOf(slotOf("تحميل", "active-indicator")).right).toBe(0);
  });
});

describe("round progress", () => {
  test("a circular indicator draws its arc and track", () => {
    renderStill(<ProgressBar value={25} className="circular" aria-label="Sync" />);

    expect(rectOf(slotOf("Sync", "indicator")).width).toBe(40);
    expect(styleOf(slotOf("Sync", "active-indicator")).strokeDasharray).toBe("25px, 100px");
    expect(styleOf(slotOf("Sync", "active-indicator")).stroke).toBe(colorOf("primary"));
  });

  test("a contained loading indicator morphs a shape on a container", () => {
    renderStill(<ProgressBar isIndeterminate className="loading contained" aria-label="Wait" />);

    expect(rectOf(slotOf("Wait", "indicator")).width).toBe(48);
    expect(styleOf(slotOf("Wait", "indicator")).backgroundColor).toBe(colorOf("primary-container"));
    expect(rectOf(slotOf("Wait", "active-indicator")).width).toBe(38);
    expect(styleOf(slotOf("Wait", "active-indicator")).clipPath).toMatch(/^polygon\(/);
  });

  test("a circular meter uses its tone", () => {
    renderStill(<Meter value={80} className="circular error" aria-label="Disk" />);

    expect(styleOf(slotOf("Disk", "active-indicator", "meter")).stroke).toBe(colorOf("error"));
  });
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  afterEach(() => loadCss(stylexCss, utilitiesCss));

  test("utilities beat the indicator styles", () => {
    loadCss(...sheets);
    renderStill(
      <Frame>
        <ProgressBar
          value={50}
          aria-label="Custom"
          classNames={{ activeIndicator: "bg-tertiary h-sm" }}
        />
      </Frame>,
    );

    expect(styleOf(slotOf("Custom", "active-indicator")).backgroundColor).toBe(colorOf("tertiary"));
    expect(rectOf(slotOf("Custom", "active-indicator")).height).toBe(8);
  });
});

test("DropZone outlines itself and shows the focus ring for keyboard focus", async () => {
  renderStill(
    <DropZone data-testid="zone">
      <Text slot="label">Drop files</Text>
    </DropZone>,
  );

  const zone = screen.getByTestId("zone");
  expect(styleOf(zone).borderTopStyle).toBe("dashed");
  expect(styleOf(zone).borderTopColor).toBe(colorOf("outline"));
  expect(styleOf(zone).outlineStyle).toBe("none");

  await userEvent.keyboard("{Tab}");
  expect(zone.hasAttribute("data-focus-visible")).toBe(true);
  expect(styleOf(zone).outlineStyle).toBe("solid");
});
