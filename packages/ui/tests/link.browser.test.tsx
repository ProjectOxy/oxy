import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { Link } from "../src/index.ts";
import { colorOf, loadCss, renderStill, stylexCss, tokenValue, utilitiesCss } from "./browser.tsx";

const link = (name: string) => screen.getByRole("link", { name });
const styleOf = (name: string) => getComputedStyle(link(name));

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

test("links take their tone color and an underline that thickens on hover", async () => {
  renderStill(
    <>
      <Link href="#a">Primary</Link>
      <Link href="#b" className="plain error">
        Plain
      </Link>
      <Link href="#c" aria-current="page">
        Current
      </Link>
      <Link href="#d" isDisabled>
        Disabled
      </Link>
    </>,
  );

  expect(styleOf("Primary").color).toBe(colorOf("primary"));
  expect(styleOf("Primary").textDecorationLine).toBe("underline");
  expect(styleOf("Plain").color).toBe(colorOf("error"));
  expect(styleOf("Plain").textDecorationLine).toBe("none");
  expect(styleOf("Current").color).toBe(colorOf("on-surface"));
  expect(styleOf("Disabled").color).toBe(
    tokenValue("color", "color-mix(in srgb, var(--oxy-color-on-surface) 38%, transparent)"),
  );

  await userEvent.hover(link("Plain"));
  expect(styleOf("Plain").textDecorationLine).toBe("underline");
  expect(styleOf("Plain").textDecorationThickness).toBe("2px");
});

test("keyboard focus shows the M3 focus ring and utilities win", async () => {
  renderStill(
    <Link href="#a" className="text-tertiary">
      Focus
    </Link>,
  );

  await userEvent.keyboard("{Tab}");
  expect(styleOf("Focus").outlineStyle).toBe("solid");
  expect(styleOf("Focus").outlineWidth).toBe("3px");
  expect(styleOf("Focus").color).toBe(colorOf("tertiary"));
});
