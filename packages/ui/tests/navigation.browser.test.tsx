import { cleanup, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { page, userEvent } from "vite-plus/test/browser";
import {
  AppBar,
  ModalNavigationDrawer,
  NavigationBar,
  NavigationDrawer,
  NavigationItem,
  NavigationRail,
} from "../src/index.ts";
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

const link = (name: string | RegExp) => screen.getByRole("link", { name });
const nav = (name: string) => screen.getByRole("navigation", { name });
const indicatorOf = (name: string) => slotOf(link(name), "indicator");
const center = (element: Element) => {
  const { left, width } = rectOf(element);
  return left + width / 2;
};

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);
afterAll(() => page.viewport(414, 896));

const destinations = (
  <>
    <NavigationItem href="#home" icon="⌂" aria-current="page">
      Home
    </NavigationItem>
    <NavigationItem href="#search" icon="⌕">
      Search
    </NavigationItem>
    <NavigationItem href="#profile" icon="☺">
      Profile
    </NavigationItem>
  </>
);

describe("NavigationBar", () => {
  test("compact windows: a 64px bar of equal items with a 56×32 pill around the icon", async () => {
    await page.viewport(360, 640);
    renderStill(<NavigationBar aria-label="Bar">{destinations}</NavigationBar>);

    const bar = nav("Bar");
    expect(rectOf(bar).height).toBe(64);
    expect(styleOf(bar).backgroundColor).toBe(colorOf("surface-container"));
    expect(rectOf(link("Home")).width).toBe(120);
    expect(rectOf(link("Home")).height).toBe(64);

    const indicator = indicatorOf("Home");
    expect(rectOf(indicator).width).toBe(56);
    expect(rectOf(indicator).height).toBe(32);
    expect(center(indicator)).toBeCloseTo(center(link("Home")), 0);
    expect(rectOf(indicator).top - rectOf(link("Home")).top).toBe(6);
    expect(styleOf(indicator).backgroundColor).toBe(colorOf("secondary-container"));
    expect(styleOf(indicator).opacity).toBe("1");
    expect(styleOf(indicatorOf("Search")).opacity).toBe("0");
    expect(styleOf(slotOf(link("Home"), "icon")).color).toBe(colorOf("on-secondary-container"));
    expect(styleOf(slotOf(link("Home"), "label")).color).toBe(colorOf("secondary"));
    expect(styleOf(slotOf(link("Search"), "label")).color).toBe(colorOf("on-surface-variant"));
    expect(styleOf(slotOf(link("Home"), "label")).fontSize).toBe("12px");
  });

  test("medium windows: items sit side by side inside a 40px pill", async () => {
    await page.viewport(800, 600);
    renderStill(<NavigationBar aria-label="Bar">{destinations}</NavigationBar>);

    const home = link("Home");
    expect(rectOf(home).height).toBe(40);
    expect(rectOf(slotOf(home, "icon")).right).toBeLessThan(rectOf(slotOf(home, "label")).left);
    expect(rectOf(indicatorOf("Home"))).toEqual(rectOf(home));
    expect(styleOf(slotOf(home, "label")).color).toBe(colorOf("on-secondary-container"));
    expect(rectOf(slotOf(home, "touch-target")).height).toBe(48);
    const bar = rectOf(nav("Bar"));
    expect(rectOf(link("Search")).left - rectOf(link("Home")).right).toBe(8);
    expect(rectOf(link("Home")).left - bar.left).toBeCloseTo(
      bar.right - rectOf(link("Profile")).right,
      0,
    );
  });

  test("the vertical layout stays stacked on any window and RTL reverses the order", async () => {
    await page.viewport(800, 600);
    renderStill(
      <NavigationBar aria-label="Bar" className="vertical">
        {destinations}
      </NavigationBar>,
      "ar-EG",
    );

    expect(rectOf(link("Home")).height).toBe(64);
    expect(rectOf(link("Home")).left).toBeGreaterThan(rectOf(link("Profile")).left);
  });

  test("keyboard focus rings the indicator area and badges sit on the icon", async () => {
    await page.viewport(360, 640);
    renderStill(
      <NavigationBar aria-label="Bar">
        <NavigationItem href="#mail" icon="✉" badge="12">
          Mail
        </NavigationItem>
        <NavigationItem href="#chat" icon="☏" badge>
          Chat
        </NavigationItem>
      </NavigationBar>,
    );

    await userEvent.keyboard("{Tab}");
    const ring = slotOf(link(/Mail/), "focus-ring");
    expect(rectOf(ring)).toEqual(rectOf(slotOf(link(/Mail/), "state-layer")));
    expect(styleOf(ring).outlineStyle).toBe("solid");

    const badge = slotOf(link(/Mail/), "badge");
    const icon = slotOf(link(/Mail/), "icon");
    expect(rectOf(badge).height).toBe(16);
    expect(styleOf(badge).backgroundColor).toBe(colorOf("error"));
    expect(rectOf(badge).left).toBeCloseTo(center(icon), 0);
    const dot = slotOf(link("Chat"), "badge");
    expect(rectOf(dot).width).toBe(6);
    expect(rectOf(dot).right).toBe(rectOf(slotOf(link("Chat"), "icon")).right);
  });
});

describe("NavigationRail", () => {
  test("a 96px rail of stacked items expands to a 220px rail of 56px pills", () => {
    renderStill(
      <div style={{ display: "flex", blockSize: "400px" }}>
        <NavigationRail aria-label="Collapsed">{destinations}</NavigationRail>
        <NavigationRail aria-label="Expanded" className="expanded">
          <NavigationItem href="#inbox" icon="✉" aria-current="page">
            Inbox
          </NavigationItem>
        </NavigationRail>
      </div>,
    );

    expect(rectOf(nav("Collapsed")).width).toBe(96);
    expect(rectOf(link("Home")).height).toBe(64);
    expect(rectOf(link("Home")).width).toBe(96);
    expect(rectOf(link("Search")).top - rectOf(link("Home")).bottom).toBe(4);
    expect(styleOf(nav("Collapsed")).backgroundColor).toBe(colorOf("surface"));

    const inbox = link("Inbox");
    expect(rectOf(nav("Expanded")).width).toBe(220);
    expect(rectOf(inbox).height).toBe(56);
    expect(rectOf(inbox).width).toBe(180);
    expect(rectOf(indicatorOf("Inbox"))).toEqual(rectOf(inbox));
    expect(styleOf(slotOf(inbox, "label")).fontSize).toBe("14px");
  });
});

describe("NavigationDrawer", () => {
  test("a standard drawer lists 56px destinations with a full-width pill", () => {
    renderStill(
      <NavigationDrawer aria-label="Drawer">
        <NavigationItem href="#inbox" icon="✉" aria-current="page">
          Inbox
        </NavigationItem>
        <NavigationItem href="#sent" icon="➤" badge="7">
          Sent
        </NavigationItem>
      </NavigationDrawer>,
    );

    const drawer = nav("Drawer");
    const inbox = link("Inbox");
    expect(rectOf(drawer).width).toBe(360);
    expect(styleOf(drawer).backgroundColor).toBe(colorOf("surface-container-low"));
    expect(rectOf(inbox).width).toBe(336);
    expect(rectOf(inbox).height).toBe(56);
    const glyph = slotOf(inbox, "icon").firstElementChild!;
    expect(rectOf(glyph).width).toBe(24);
    expect(rectOf(slotOf(inbox, "label")).left - rectOf(glyph).right).toBe(12);
    expect(rectOf(indicatorOf("Inbox"))).toEqual(rectOf(inbox));
    expect(parseFloat(styleOf(indicatorOf("Inbox")).borderStartStartRadius)).toBeGreaterThan(28);

    const sent = link(/Sent/);
    const badge = slotOf(sent, "badge");
    expect(rectOf(badge).right).toBe(rectOf(sent).right - 24);
    expect(rectOf(badge).left).toBeGreaterThan(rectOf(slotOf(sent, "label")).right);
  });

  test("a modal drawer slides over a scrim from the inline start", async () => {
    await page.viewport(800, 600);
    for (const locale of ["en-US", "ar-EG"]) {
      renderStill(
        <ModalNavigationDrawer aria-label="Menu" defaultOpen>
          <NavigationItem href="#inbox">Inbox</NavigationItem>
        </ModalNavigationDrawer>,
        locale,
      );

      const panel = screen.getByRole("dialog", { name: "Menu" }).parentElement!;
      expect(rectOf(panel).width).toBe(360);
      expect(rectOf(panel).height).toBe(600);
      if (locale === "en-US") expect(rectOf(panel).left).toBe(0);
      else expect(rectOf(panel).right).toBe(800);
      expect(styleOf(panel.parentElement!).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
      cleanup();
    }
  });
});

describe("AppBar", () => {
  test("small, medium and large bars grow the title and move it under the actions", () => {
    renderStill(
      <>
        <AppBar data-testid="small" title="Small" leading={<button>≡</button>} />
        <AppBar data-testid="medium" className="medium" title="Medium" />
        <AppBar data-testid="large" className="large scrolled" title="Large" />
      </>,
    );

    const small = screen.getByTestId("small");
    const title = (name: string) => screen.getByRole("heading", { name });
    expect(rectOf(small).height).toBe(64);
    expect(styleOf(small).backgroundColor).toBe(colorOf("surface"));
    expect(styleOf(title("Small")).fontSize).toBe("22px");
    expect(rectOf(screen.getByTestId("medium")).height).toBe(112);
    expect(styleOf(title("Medium")).fontSize).toBe("28px");
    expect(rectOf(title("Medium")).top).toBeGreaterThanOrEqual(
      rectOf(screen.getByTestId("medium")).top + 64,
    );
    expect(rectOf(title("Medium")).left - rectOf(screen.getByTestId("medium")).left).toBe(16);
    expect(rectOf(screen.getByTestId("large")).height).toBe(120);
    expect(styleOf(title("Large")).fontSize).toBe("36px");
    expect(styleOf(screen.getByTestId("large")).backgroundColor).toBe(colorOf("surface-container"));
  });

  test("a centered small bar keeps its title in the middle, in RTL too", () => {
    renderStill(
      <div style={{ inlineSize: "400px" }}>
        <AppBar
          data-testid="bar"
          className="center"
          title="Center"
          leading={<button>≡</button>}
          trailing={<button>⋮</button>}
        />
      </div>,
      "ar-EG",
    );

    const bar = screen.getByTestId("bar");
    expect(center(screen.getByRole("heading", { name: "Center" }))).toBeCloseTo(center(bar), 0);
    expect(rectOf(screen.getByRole("button", { name: "≡" })).right).toBe(rectOf(bar).right - 4);
  });
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  afterEach(() => loadCss(stylexCss, utilitiesCss));

  test("utilities beat the navigation and app bar styles", () => {
    loadCss(...sheets);
    renderStill(
      <>
        <NavigationDrawer aria-label="Custom" className="bg-surface w-full">
          <NavigationItem href="#a" className="text-primary px-xl" aria-current="page">
            Custom
          </NavigationItem>
        </NavigationDrawer>
        <AppBar data-testid="bar" className="large bg-primary-container px-lg" title="Bar" />
      </>,
    );

    expect(styleOf(nav("Custom")).backgroundColor).toBe(colorOf("surface"));
    expect(styleOf(link("Custom")).color).toBe(colorOf("primary"));
    expect(styleOf(link("Custom")).paddingInlineStart).toBe("24px");
    expect(styleOf(screen.getByTestId("bar")).backgroundColor).toBe(colorOf("primary-container"));
    expect(styleOf(screen.getByTestId("bar")).paddingInlineStart).toBe("16px");
  });
});
