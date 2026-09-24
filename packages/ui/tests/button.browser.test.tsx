import { cleanup, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { ButtonContext } from "react-aria-components";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { Button } from "../src/index.ts";
import {
  colorOf,
  loadCss,
  renderStill,
  slotOf as slotIn,
  stylexCss,
  tokenValue,
  utilitiesCss,
} from "./browser.tsx";

const button = (name: string) => screen.getByRole("button", { name });
const styleOf = (name: string) => getComputedStyle(button(name));
const slotOf = (name: string, slot: string) => slotIn(button(name), slot);

const Pressed = ({ children }: { children: ReactNode }) => (
  <ButtonContext value={{ isPressed: true }}>{children}</ButtonContext>
);

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

describe("variants", () => {
  test("sizes follow the M3 Expressive scale and density shrinks the height", () => {
    renderStill(
      <>
        {["xs", "sm", "md", "lg", "xl"].map((size) => (
          <Button key={size} className={size}>
            {size}
          </Button>
        ))}
        <Button className="compact">compact</Button>
        <Button className="dense">dense</Button>
      </>,
    );

    expect(["xs", "sm", "md", "lg", "xl"].map((size) => styleOf(size).blockSize)).toEqual([
      "32px",
      "40px",
      "56px",
      "96px",
      "136px",
    ]);
    expect(styleOf("xl").fontSize).toBe(
      tokenValue("font-size", "var(--oxy-typography-headline-large-size)"),
    );
    expect(styleOf("compact").blockSize).toBe("36px");
    expect(styleOf("dense").blockSize).toBe("32px");
  });

  test("style variants and tones pick their M3 color roles", () => {
    renderStill(
      <>
        <Button>filled</Button>
        <Button className="tonal secondary">tonal</Button>
        <Button className="outlined error">outlined</Button>
        <Button className="text tertiary">text</Button>
        <Button className="elevated">elevated</Button>
      </>,
    );

    expect(styleOf("filled").backgroundColor).toBe(colorOf("primary"));
    expect(styleOf("filled").color).toBe(colorOf("on-primary"));
    expect(styleOf("tonal").backgroundColor).toBe(colorOf("secondary-container"));
    expect(styleOf("tonal").color).toBe(colorOf("on-secondary-container"));
    expect(styleOf("outlined").backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(styleOf("outlined").color).toBe(colorOf("error"));
    expect(styleOf("outlined").borderInlineStartColor).toBe(colorOf("outline-variant"));
    expect(styleOf("outlined").borderInlineStartWidth).toBe("1px");
    expect(styleOf("text").color).toBe(colorOf("tertiary"));
    expect(styleOf("elevated").backgroundColor).toBe(colorOf("surface-container-low"));
    expect(styleOf("elevated").boxShadow).not.toBe("none");
  });

  test("shapes morph to the pressed radius", () => {
    renderStill(
      <>
        <Button>round</Button>
        <Button className="square">square</Button>
        <Button className="square lg">large</Button>
        <Pressed>
          <Button>pressed round</Button>
          <Button className="square lg">pressed large</Button>
        </Pressed>
      </>,
    );

    expect(styleOf("round").borderStartStartRadius).toBe("20px");
    expect(styleOf("square").borderStartStartRadius).toBe("12px");
    expect(styleOf("large").borderStartStartRadius).toBe("28px");
    expect(button("pressed round").hasAttribute("data-pressed")).toBe(true);
    expect(styleOf("pressed round").borderStartStartRadius).toBe("8px");
    expect(styleOf("pressed large").borderStartStartRadius).toBe("16px");
  });

  test("a disabled button uses the M3 disabled colors", () => {
    renderStill(<Button isDisabled>Disabled</Button>);

    expect(styleOf("Disabled").color).toBe(
      tokenValue("color", "color-mix(in srgb, var(--oxy-color-on-surface) 38%, transparent)"),
    );
    expect(styleOf("Disabled").backgroundColor).toBe(
      tokenValue("color", "color-mix(in srgb, var(--oxy-color-on-surface) 12%, transparent)"),
    );
  });
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  afterEach(() => loadCss(stylexCss, utilitiesCss));

  test("utilities beat the base and variant styles of the Button", () => {
    loadCss(...sheets);
    renderStill(
      <Pressed>
        <Button className="tonal square lg bg-tertiary text-on-tertiary px-sm rounded-none">
          Custom
        </Button>
      </Pressed>,
    );

    expect(styleOf("Custom").backgroundColor).toBe(colorOf("tertiary"));
    expect(styleOf("Custom").color).toBe(colorOf("on-tertiary"));
    expect(styleOf("Custom").paddingInlineStart).toBe("8px");
    expect(styleOf("Custom").borderStartStartRadius).toBe("0px");
    expect(styleOf("Custom").blockSize).toBe("96px");
  });
});

describe("unstyled", () => {
  test("keeps only a minimal reset and whatever utilities it is given", () => {
    renderStill(
      <>
        <Button unstyled>Bare</Button>
        <Button unstyled className="tonal bg-primary px-md rounded-full">
          Branded
        </Button>
      </>,
    );

    expect(styleOf("Bare").backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(styleOf("Bare").paddingInlineStart).toBe("0px");
    expect(styleOf("Bare").borderInlineStartWidth).toBe("0px");
    expect(styleOf("Branded").backgroundColor).toBe(colorOf("primary"));
    expect(styleOf("Branded").paddingInlineStart).toBe("12px");
  });
});

describe("accessibility", () => {
  test("shows the M3 focus ring for keyboard focus only", async () => {
    renderStill(<Button>Focus</Button>);

    await userEvent.click(button("Focus"));
    expect(styleOf("Focus").outlineStyle).toBe("none");

    button("Focus").blur();
    await userEvent.keyboard("{Tab}");
    expect(button("Focus").hasAttribute("data-focus-visible")).toBe(true);
    expect(styleOf("Focus").outlineStyle).toBe("solid");
    expect(styleOf("Focus").outlineWidth).toBe("3px");
    expect(styleOf("Focus").outlineColor).toBe(colorOf("secondary"));
    expect(getComputedStyle(slotOf("Focus", "state-layer")).opacity).toBe("0.1");
  });

  test("the touch target is at least 48px in comfortable density", () => {
    renderStill(
      <>
        <Button className="xs">Small</Button>
        <Button className="xs dense">Dense</Button>
        <Button className="lg">Large</Button>
      </>,
    );

    const small = slotOf("Small", "touch-target").getBoundingClientRect();
    const smallButton = button("Small").getBoundingClientRect();
    expect(small.height).toBe(48);
    expect(small.width).toBeGreaterThanOrEqual(48);
    expect(small.top + small.height / 2).toBeCloseTo(smallButton.top + smallButton.height / 2);

    expect(slotOf("Dense", "touch-target").getBoundingClientRect().height).toBe(
      button("Dense").clientHeight,
    );
    expect(slotOf("Large", "touch-target").getBoundingClientRect().height).toBe(
      button("Large").clientHeight,
    );
  });

  test("the state layer answers to hover", async () => {
    renderStill(<Button>Hover</Button>);

    expect(getComputedStyle(slotOf("Hover", "state-layer")).opacity).toBe("0");
    await userEvent.hover(button("Hover"));
    expect(getComputedStyle(slotOf("Hover", "state-layer")).opacity).toBe("0.08");
  });
});

test("content flows right to left in an RTL locale", () => {
  renderStill(
    <>
      <Button>
        <span data-testid="icon">★</span>
        <span data-testid="label">حفظ</span>
      </Button>
    </>,
    "ar-EG",
  );

  const icon = screen.getByTestId("icon").getBoundingClientRect();
  const label = screen.getByTestId("label").getBoundingClientRect();
  expect(icon.left).toBeGreaterThan(label.left);
});
