import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "../src/index.ts";
import {
  colorOf,
  loadCss,
  rectOf,
  renderStill,
  slotOf,
  stylexCss,
  styleOf,
  utilitiesCss,
} from "./browser.tsx";

const tab = (name: string) => screen.getByRole("tab", { name });
const indicatorOf = (name: string) => slotOf(tab(name), "indicator");

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

function Example({ className, icons = false }: { className?: string; icons?: boolean }) {
  return (
    <Tabs>
      <TabList aria-label="Tabs" className={className}>
        <Tab id="flights" icon={icons ? "✈" : undefined}>
          Flights
        </Tab>
        <Tab id="trips" icon={icons ? "⌂" : undefined}>
          Trips
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="flights">Flights panel</TabPanel>
        <TabPanel id="trips">Trips panel</TabPanel>
      </TabPanels>
    </Tabs>
  );
}

describe("primary tabs", () => {
  test("fixed tabs share the width, sit on a divider and grow to 64px with icons", () => {
    renderStill(
      <div style={{ inlineSize: "400px" }}>
        <Example />
      </div>,
    );

    const list = screen.getByRole("tablist");
    expect(rectOf(tab("Flights")).width).toBe(200);
    expect(rectOf(tab("Trips")).width).toBe(200);
    expect(rectOf(tab("Flights")).height).toBe(48);
    expect(styleOf(list).borderBlockEndWidth).toBe("1px");
    expect(styleOf(list).borderBlockEndColor).toBe(colorOf("outline-variant"));
    expect(styleOf(tab("Flights")).color).toBe(colorOf("primary"));
    expect(styleOf(tab("Trips")).color).toBe(colorOf("on-surface-variant"));
    expect(styleOf(tab("Flights")).fontSize).toBe("14px");

    cleanup();
    renderStill(<Example icons />);
    expect(rectOf(tab("Flights")).height).toBe(64);
    const content = slotOf(tab("Flights"), "content");
    expect(styleOf(content).flexDirection).toBe("column");
  });

  test("the indicator is a 3px rounded bar under the label that moves to the selected tab", async () => {
    renderStill(
      <div style={{ inlineSize: "400px" }}>
        <Example />
      </div>,
    );

    const indicator = indicatorOf("Flights");
    const label = rectOf(slotOf(tab("Flights"), "content"));
    expect(rectOf(indicator).height).toBe(3);
    expect(rectOf(indicator).width).toBe(label.width);
    expect(rectOf(indicator).bottom).toBe(rectOf(tab("Flights")).bottom);
    expect(styleOf(indicator).backgroundColor).toBe(colorOf("primary"));
    expect(styleOf(indicator).borderStartStartRadius).toBe("3px");
    expect(indicatorOf("Trips")).toBeNull();

    await userEvent.click(tab("Trips"));
    await expect.poll(() => indicatorOf("Trips")).not.toBeNull();
    expect(indicatorOf("Flights")).toBeNull();
    await expect.poll(() => screen.getAllByRole("tabpanel", { hidden: true }).length).toBe(1);
    expect(screen.getByRole("tabpanel").textContent).toBe("Trips panel");
  });
});

describe("secondary and scrollable tabs", () => {
  test("secondary tabs put the icon inline, use on-surface and a 2px full-width indicator", () => {
    renderStill(
      <div style={{ inlineSize: "400px" }}>
        <Example className="secondary" icons />
      </div>,
    );

    expect(rectOf(tab("Flights")).height).toBe(48);
    expect(styleOf(tab("Flights")).color).toBe(colorOf("on-surface"));
    const indicator = indicatorOf("Flights");
    expect(rectOf(indicator).height).toBe(2);
    expect(rectOf(indicator).width).toBe(200);
    expect(styleOf(slotOf(tab("Flights"), "content")).flexDirection).toBe("row");
  });

  test("scrollable tabs size to their labels, start after the inset and scroll", () => {
    renderStill(
      <div style={{ inlineSize: "240px" }}>
        <Tabs>
          <TabList aria-label="Scrollable" className="scrollable">
            {["Overview", "Specifications", "Reviews", "Related"].map((name) => (
              <Tab key={name} id={name}>
                {name}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </div>,
    );

    const list = screen.getByRole("tablist");
    expect(styleOf(list).paddingInlineStart).toBe("52px");
    expect(rectOf(tab("Overview")).left - rectOf(list).left).toBe(52);
    expect(rectOf(tab("Overview")).width).not.toBe(rectOf(tab("Specifications")).width);
    expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
  });
});

test("keyboard focus shows an inset focus ring", async () => {
  renderStill(<Example />);

  await userEvent.keyboard("{Tab}");
  expect(document.activeElement).toBe(tab("Flights"));
  expect(styleOf(tab("Flights")).outlineStyle).toBe("solid");
  expect(styleOf(tab("Flights")).outlineOffset).toBe("-3px");

  await userEvent.keyboard("{ArrowRight}");
  expect(document.activeElement).toBe(tab("Trips"));
});

test("vertical tabs stack and put the indicator on the inline end", () => {
  renderStill(
    <Tabs orientation="vertical">
      <TabList aria-label="Vertical">
        <Tab id="a">Alpha</Tab>
        <Tab id="b">Beta</Tab>
      </TabList>
      <TabPanel id="a">Alpha panel</TabPanel>
      <TabPanel id="b">Beta panel</TabPanel>
    </Tabs>,
  );

  expect(rectOf(tab("Beta")).top).toBe(rectOf(tab("Alpha")).bottom);
  const indicator = indicatorOf("Alpha");
  expect(rectOf(indicator).width).toBe(3);
  expect(rectOf(indicator).right).toBe(rectOf(tab("Alpha")).right);
  expect(rectOf(indicator).height).toBe(rectOf(tab("Alpha")).height);
});

test("tabs run right to left in an RTL locale", () => {
  renderStill(
    <div style={{ inlineSize: "400px" }}>
      <Example />
    </div>,
    "ar-EG",
  );

  expect(rectOf(tab("Flights")).left).toBeGreaterThan(rectOf(tab("Trips")).left);
  expect(rectOf(indicatorOf("Flights")).right).toBe(
    rectOf(slotOf(tab("Flights"), "content")).right,
  );
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  afterEach(() => loadCss(stylexCss, utilitiesCss));

  test("utilities beat the tab list and tab styles", () => {
    loadCss(...sheets);
    renderStill(
      <Tabs>
        <TabList aria-label="Custom" className="secondary bg-surface-container border-0">
          <Tab id="a" className="text-tertiary px-xl">
            Custom
          </Tab>
        </TabList>
      </Tabs>,
    );

    expect(styleOf(screen.getByRole("tablist")).backgroundColor).toBe(colorOf("surface-container"));
    expect(styleOf(screen.getByRole("tablist")).borderBlockEndWidth).toBe("0px");
    expect(styleOf(tab("Custom")).color).toBe(colorOf("tertiary"));
    expect(styleOf(tab("Custom")).paddingInlineStart).toBe("24px");
  });
});
