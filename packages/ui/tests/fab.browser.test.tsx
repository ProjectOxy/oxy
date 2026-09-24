import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { ExtendedFab, Fab, FabMenu, FabMenuItem, FabMenuList } from "../src/index.ts";
import { colorOf, corners, loadCss, renderStill, stylexCss, utilitiesCss } from "./browser.tsx";

const button = (name: string) => screen.getByRole("button", { name });
const styleOf = (element: Element) => getComputedStyle(element);
const icon = <span aria-hidden style={{ inlineSize: "1em", blockSize: "1em" }} />;

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

describe("Fab", () => {
  test("sizes and corners follow the FAB, medium and large FAB specs", () => {
    renderStill(
      <>
        <Fab aria-label="sm">{icon}</Fab>
        <Fab aria-label="md" className="md">
          {icon}
        </Fab>
        <Fab aria-label="lg" className="lg">
          {icon}
        </Fab>
      </>,
    );

    for (const [size, edge, radius] of [
      ["sm", 56, "16px"],
      ["md", 80, "20px"],
      ["lg", 96, "28px"],
    ] as const) {
      const rect = button(size).getBoundingClientRect();
      expect([rect.width, rect.height]).toEqual([edge, edge]);
      expect(styleOf(button(size)).borderStartStartRadius).toBe(radius);
    }
  });

  test("tonal and filled colors follow the tone and hover raises the elevation", async () => {
    renderStill(
      <>
        <Fab aria-label="tonal">{icon}</Fab>
        <Fab aria-label="filled" className="filled tertiary">
          {icon}
        </Fab>
      </>,
    );

    expect(styleOf(button("tonal")).backgroundColor).toBe(colorOf("primary-container"));
    expect(styleOf(button("tonal")).color).toBe(colorOf("on-primary-container"));
    expect(styleOf(button("filled")).backgroundColor).toBe(colorOf("tertiary"));

    const resting = styleOf(button("tonal")).boxShadow;
    await userEvent.hover(button("tonal"));
    expect(styleOf(button("tonal")).boxShadow).not.toBe(resting);
  });

  test.each([
    ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
    ["utilities CSS loads first", [utilitiesCss, stylexCss]],
  ])("utilities beat the FAB styles when the %s", (_, sheets) => {
    loadCss(...sheets);
    renderStill(
      <Fab aria-label="Custom" className="lg bg-tertiary rounded-none">
        {icon}
      </Fab>,
    );

    expect(styleOf(button("Custom")).backgroundColor).toBe(colorOf("tertiary"));
    expect(corners(button("Custom"))).toEqual(["0px", "0px", "0px", "0px"]);
    loadCss(stylexCss, utilitiesCss);
  });
});

describe("ExtendedFab", () => {
  test("collapsing shrinks it to a square FAB while the label stays its name", () => {
    renderStill(
      <>
        <ExtendedFab icon={icon}>Compose</ExtendedFab>
        <ExtendedFab icon={icon} className="collapsed">
          Reply
        </ExtendedFab>
      </>,
    );

    const extended = button("Compose").getBoundingClientRect();
    const collapsed = button("Reply").getBoundingClientRect();
    expect(extended.height).toBe(56);
    expect(extended.width).toBeGreaterThan(100);
    expect([collapsed.width, collapsed.height]).toEqual([56, 56]);
  });

  test("the icon leads the label on the inline start side in RTL", () => {
    renderStill(<ExtendedFab icon={<span aria-hidden>★</span>}>إنشاء</ExtendedFab>, "ar-EG");

    const fab = button("إنشاء");
    const iconRect = fab.querySelector('[data-slot="icon"]')!.getBoundingClientRect();
    const labelRect = fab.querySelector('[data-slot="label"]')!.getBoundingClientRect();
    expect(iconRect.left).toBeGreaterThan(labelRect.left);
  });
});

describe("FabMenu", () => {
  test("opening the menu morphs the FAB into a round close button over tonal items", async () => {
    renderStill(
      <FabMenu>
        <Fab aria-label="Create" className="secondary" style={{ marginBlockStart: "400px" }}>
          {icon}
        </Fab>
        <FabMenuList aria-label="Create" className="secondary">
          <FabMenuItem id="message" icon={icon}>
            Message
          </FabMenuItem>
          <FabMenuItem id="event" icon={icon}>
            Event
          </FabMenuItem>
        </FabMenuList>
      </FabMenu>,
    );

    await userEvent.click(button("Create"));

    expect(button("Create").getAttribute("aria-expanded")).toBe("true");
    expect(corners(button("Create"))).toEqual(["28px", "28px", "28px", "28px"]);
    expect(styleOf(button("Create")).backgroundColor).toBe(colorOf("secondary"));

    const message = screen.getByRole("menuitem", { name: "Message" });
    expect(message.getBoundingClientRect().height).toBe(56);
    expect(styleOf(message).backgroundColor).toBe(colorOf("secondary-container"));
    expect(styleOf(message).color).toBe(colorOf("on-secondary-container"));
    expect(message.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      button("Create").getBoundingClientRect().top,
    );

    await userEvent.keyboard("{ArrowDown}");
    expect(styleOf(document.activeElement!).outlineStyle).toBe("solid");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
