import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { Button, Toolbar } from "../src/index.ts";
import { colorOf, loadCss, renderStill, stylexCss, utilitiesCss } from "./browser.tsx";

const toolbar = (name: string) => screen.getByRole("toolbar", { name });
const styleOf = (name: string) => getComputedStyle(toolbar(name));

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

test("a docked toolbar spans its container on the surface container color", () => {
  renderStill(
    <div style={{ inlineSize: "360px" }}>
      <Toolbar aria-label="Docked">
        <Button>One</Button>
      </Toolbar>
    </div>,
  );

  expect(toolbar("Docked").getBoundingClientRect().width).toBe(360);
  expect(toolbar("Docked").getBoundingClientRect().height).toBe(64);
  expect(styleOf("Docked").backgroundColor).toBe(colorOf("surface-container"));
});

test("a floating toolbar is a raised pill that scrolls when space runs out", () => {
  renderStill(
    <div style={{ inlineSize: "120px" }}>
      <Toolbar aria-label="Floating" className="floating vibrant">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </Toolbar>
    </div>,
  );

  const floating = toolbar("Floating");
  expect(styleOf("Floating").backgroundColor).toBe(colorOf("primary-container"));
  expect(styleOf("Floating").boxShadow).not.toBe("none");
  expect(styleOf("Floating").paddingInlineStart).toBe("8px");
  expect(parseFloat(styleOf("Floating").borderStartStartRadius)).toBeGreaterThan(1000);
  expect(floating.getBoundingClientRect().width).toBe(120);
  expect(floating.scrollWidth).toBeGreaterThan(floating.clientWidth);
});

test("a vertical toolbar stacks its items and arrow keys move between them", async () => {
  renderStill(
    <Toolbar aria-label="Vertical" orientation="vertical" className="floating">
      <Button>Up</Button>
      <Button>Down</Button>
    </Toolbar>,
  );

  const up = screen.getByRole("button", { name: "Up" });
  const down = screen.getByRole("button", { name: "Down" });
  expect(down.getBoundingClientRect().top).toBeGreaterThan(up.getBoundingClientRect().bottom);

  await userEvent.keyboard("{Tab}");
  expect(document.activeElement).toBe(up);
  await userEvent.keyboard("{ArrowDown}");
  expect(document.activeElement).toBe(down);
});
