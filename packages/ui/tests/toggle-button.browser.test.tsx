import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { Button, SplitButton, ToggleButton, ToggleButtonGroup } from "../src/index.ts";
import {
  colorOf,
  corners,
  loadCss,
  renderStill,
  slotOf,
  stylexCss,
  utilitiesCss,
} from "./browser.tsx";

const toggle = (name: string) => screen.getByRole("button", { name });
const radio = (name: string) => screen.getByRole("radio", { name });
const styleOf = (element: Element) => getComputedStyle(element);

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

describe("ToggleButton", () => {
  test("selection switches to the M3 selected colors of each variant", () => {
    renderStill(
      <>
        <ToggleButton>filled</ToggleButton>
        <ToggleButton defaultSelected>filled on</ToggleButton>
        <ToggleButton className="tonal secondary" defaultSelected>
          tonal on
        </ToggleButton>
        <ToggleButton className="outlined">outlined</ToggleButton>
        <ToggleButton className="outlined" defaultSelected>
          outlined on
        </ToggleButton>
        <ToggleButton className="elevated tertiary" defaultSelected>
          elevated on
        </ToggleButton>
      </>,
    );

    expect(styleOf(toggle("filled")).backgroundColor).toBe(colorOf("surface-container"));
    expect(styleOf(toggle("filled")).color).toBe(colorOf("on-surface-variant"));
    expect(styleOf(toggle("filled on")).backgroundColor).toBe(colorOf("primary"));
    expect(styleOf(toggle("filled on")).color).toBe(colorOf("on-primary"));
    expect(styleOf(toggle("tonal on")).backgroundColor).toBe(colorOf("secondary"));
    expect(styleOf(toggle("outlined")).borderInlineStartColor).toBe(colorOf("outline-variant"));
    expect(styleOf(toggle("outlined on")).backgroundColor).toBe(colorOf("inverse-surface"));
    expect(styleOf(toggle("outlined on")).color).toBe(colorOf("inverse-on-surface"));
    expect(styleOf(toggle("elevated on")).backgroundColor).toBe(colorOf("tertiary"));
  });

  test("selection morphs round buttons to square and square ones to round", async () => {
    renderStill(
      <>
        <ToggleButton>round</ToggleButton>
        <ToggleButton className="square">square</ToggleButton>
      </>,
    );

    expect(styleOf(toggle("round")).borderStartStartRadius).toBe("20px");
    expect(styleOf(toggle("square")).borderStartStartRadius).toBe("12px");

    await userEvent.click(toggle("round"));
    await userEvent.click(toggle("square"));

    expect(toggle("round").getAttribute("aria-pressed")).toBe("true");
    expect(styleOf(toggle("round")).borderStartStartRadius).toBe("12px");
    expect(styleOf(toggle("square")).borderStartStartRadius).toBe("20px");
  });

  test("keyboard toggles it and shows the focus ring and a 48px touch target", async () => {
    renderStill(<ToggleButton className="xs">Mute</ToggleButton>);

    await userEvent.keyboard("{Tab}");
    await userEvent.keyboard(" ");

    expect(toggle("Mute").getAttribute("aria-pressed")).toBe("true");
    expect(styleOf(toggle("Mute")).outlineStyle).toBe("solid");
    expect(slotOf(toggle("Mute"), "touch-target").getBoundingClientRect().height).toBe(48);
  });
});

describe("ToggleButtonGroup", () => {
  interface GroupProps {
    className?: string;
    orientation?: "horizontal" | "vertical";
  }

  const Group = ({ className, orientation }: GroupProps) => (
    <ToggleButtonGroup
      aria-label="View"
      className={className}
      orientation={orientation}
      defaultSelectedKeys={["week"]}
    >
      <ToggleButton id="day">Day</ToggleButton>
      <ToggleButton id="week">Week</ToggleButton>
      <ToggleButton id="month">Month</ToggleButton>
      <ToggleButton id="year">Year</ToggleButton>
    </ToggleButtonGroup>
  );

  test("connected buttons share inner corners and the selected one turns fully round", () => {
    renderStill(<Group />);

    expect(corners(radio("Day"))).toEqual(["20px", "8px", "20px", "8px"]);
    expect(corners(radio("Month"))).toEqual(["8px", "8px", "8px", "8px"]);
    expect(corners(radio("Year"))).toEqual(["8px", "20px", "8px", "20px"]);
    expect(corners(radio("Week"))).toEqual(["20px", "20px", "20px", "20px"]);

    const day = radio("Day").getBoundingClientRect();
    const week = radio("Week").getBoundingClientRect();
    expect(week.left - day.right).toBe(2);
  });

  test("a vertical connected group joins buttons along the block axis", () => {
    renderStill(<Group orientation="vertical" />);

    expect(corners(radio("Day"))).toEqual(["20px", "20px", "8px", "8px"]);
    expect(corners(radio("Year"))).toEqual(["8px", "8px", "20px", "20px"]);
    expect(radio("Month").getBoundingClientRect().top).toBe(
      radio("Week").getBoundingClientRect().bottom + 2,
    );
  });

  test("a standard group keeps each button's own shape and spaces them by size", () => {
    renderStill(<Group className="standard xs" />);

    expect(corners(radio("Month"))).toEqual(["20px", "20px", "20px", "20px"]);
    expect(
      radio("Month").getBoundingClientRect().left - radio("Week").getBoundingClientRect().right,
    ).toBe(18);
  });

  test("the outer corners sit on the inline start in right-to-left layouts", () => {
    renderStill(<Group />, "he-IL");

    const day = radio("Day");
    expect(day.getBoundingClientRect().left).toBeGreaterThan(
      radio("Year").getBoundingClientRect().left,
    );
    expect(styleOf(day).borderTopRightRadius).toBe("20px");
    expect(styleOf(day).borderTopLeftRadius).toBe("8px");
  });

  test("arrow keys move focus between buttons and Space selects", async () => {
    renderStill(<Group />);

    await userEvent.keyboard("{Tab}");
    expect(document.activeElement).toBe(radio("Day"));
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(document.activeElement).toBe(radio("Month"));
    await userEvent.keyboard(" ");

    expect(radio("Month").getAttribute("aria-checked")).toBe("true");
    expect(corners(radio("Month"))).toEqual(["20px", "20px", "20px", "20px"]);
    expect(corners(radio("Week"))).toEqual(["8px", "8px", "8px", "8px"]);
  });

  test.each([
    ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
    ["utilities CSS loads first", [utilitiesCss, stylexCss]],
  ])("utilities beat the connected shape when the %s", (_, sheets) => {
    loadCss(...sheets);
    renderStill(
      <ToggleButtonGroup aria-label="Custom">
        <ToggleButton id="a" className="rounded-none">
          A
        </ToggleButton>
        <ToggleButton id="b">B</ToggleButton>
      </ToggleButtonGroup>,
    );

    expect(corners(radio("A"))).toEqual(["0px", "0px", "0px", "0px"]);
    loadCss(stylexCss, utilitiesCss);
  });
});

describe("SplitButton", () => {
  test("the leading and trailing buttons share inner corners and a selected trailing toggle rounds", async () => {
    renderStill(
      <SplitButton aria-label="Send">
        <Button className="md">Send</Button>
        <ToggleButton className="md" aria-label="Options">
          ▾
        </ToggleButton>
      </SplitButton>,
    );

    const send = screen.getByRole("button", { name: "Send" });
    expect(corners(send)).toEqual(["28px", "8px", "28px", "8px"]);
    expect(corners(toggle("Options"))).toEqual(["8px", "28px", "8px", "28px"]);

    await userEvent.click(toggle("Options"));
    expect(corners(toggle("Options"))).toEqual(["28px", "28px", "28px", "28px"]);
    expect(
      toggle("Options").getBoundingClientRect().left - send.getBoundingClientRect().right,
    ).toBe(2);
  });

  test("a trailing menu button rounds while its menu is expanded", () => {
    renderStill(
      <SplitButton aria-label="Send">
        <Button className="square">Send</Button>
        <Button className="square" aria-label="Options" aria-expanded>
          ▴
        </Button>
      </SplitButton>,
    );

    expect(corners(toggle("Options"))).toEqual(["20px", "20px", "20px", "20px"]);
    expect(corners(screen.getByRole("button", { name: "Send" }))).toEqual([
      "12px",
      "8px",
      "12px",
      "8px",
    ]);
  });
});
