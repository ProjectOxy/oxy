import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { Label, Meter, ProgressBar } from "../src/index.ts";

afterEach(cleanup);

const classesOf = (element: Element) => new Set(element.getAttribute("class")!.split(" "));
const slotOf = (element: Element, slot: string) => element.querySelector(`[data-slot="${slot}"]`)!;

describe("ProgressBar", () => {
  test("reports its value and draws a linear indicator after the label", () => {
    render(
      <ProgressBar value={30} valueLabel="3 of 10">
        {({ valueText }) => (
          <>
            <Label>Uploading</Label>
            <span>{valueText}</span>
          </>
        )}
      </ProgressBar>,
    );

    const bar = screen.getByRole("progressbar", { name: "Uploading" });
    expect(bar.getAttribute("aria-valuenow")).toBe("30");
    expect(screen.getByText("3 of 10")).toBeTruthy();
    expect(bar.lastElementChild!.getAttribute("data-slot")).toBe("indicator");
    expect(slotOf(bar, "active-indicator").getAttribute("aria-hidden")).toBeNull();
    expect(slotOf(bar, "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  test("an indeterminate linear bar has two travelling segments", () => {
    render(<ProgressBar isIndeterminate aria-label="Loading" />);

    const bar = screen.getByRole("progressbar", { name: "Loading" });
    expect(bar.hasAttribute("aria-valuenow")).toBe(false);
    expect(bar.querySelectorAll('[data-slot="active-indicator"]')).toHaveLength(2);
  });

  test("circular, wavy and loading variants draw their own indicators", () => {
    render(
      <>
        <ProgressBar value={50} className="circular" aria-label="Circular" />
        <ProgressBar value={50} className="circular wavy" aria-label="Wavy" />
        <ProgressBar isIndeterminate className="loading contained" aria-label="Loading" />
      </>,
    );

    const circular = screen.getByRole("progressbar", { name: "Circular" });
    const wavy = screen.getByRole("progressbar", { name: "Wavy" });
    const loading = screen.getByRole("progressbar", { name: "Loading" });
    expect(slotOf(circular, "indicator").tagName.toLowerCase()).toBe("svg");
    expect(slotOf(circular, "active-indicator").tagName.toLowerCase()).toBe("circle");
    expect(slotOf(wavy, "active-indicator").tagName.toLowerCase()).toBe("path");
    expect(slotOf(loading, "active-indicator").tagName.toLowerCase()).toBe("span");
    expect(classesOf(loading).has("contained")).toBe(false);
  });

  test("slots take classes and unstyled drops the indicator", () => {
    render(
      <>
        <ProgressBar
          value={20}
          aria-label="Styled"
          classNames={{ track: "bg-tertiary-container" }}
        />
        <ProgressBar value={20} aria-label="Bare" unstyled />
      </>,
    );

    const styled = screen.getByRole("progressbar", { name: "Styled" });
    expect(classesOf(slotOf(styled, "track")).has("bg-tertiary-container")).toBe(true);
    expect(
      screen.getByRole("progressbar", { name: "Bare" }).querySelector("[data-slot]"),
    ).toBeNull();
  });
});

test("Meter reports its value with a meter role", () => {
  render(
    <Meter value={70} className="circular error">
      <Label>Storage</Label>
    </Meter>,
  );

  const meter = screen.getByRole("meter", { name: "Storage" });
  expect(meter.getAttribute("aria-valuenow")).toBe("70");
  expect(meter.firstElementChild!.getAttribute("data-slot")).toBe("indicator");
  expect(classesOf(meter).has("error")).toBe(false);
});
