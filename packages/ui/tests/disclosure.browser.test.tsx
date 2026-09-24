import { cleanup, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import {
  Breadcrumb,
  Breadcrumbs,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTitle,
  Link,
  Separator,
} from "../src/index.ts";
import {
  colorOf,
  corners,
  loadCss,
  rectOf,
  renderStill,
  slotOf,
  stylexCss,
  styleOf,
  utilitiesCss,
} from "./browser.tsx";

const trigger = (name: string) => screen.getByRole("button", { name });
const panelOf = (name: string) =>
  document.getElementById(trigger(name).getAttribute("aria-controls")!)!;

beforeAll(() => loadCss(stylexCss, utilitiesCss));
afterEach(cleanup);

function Item({ id, title }: { id: string; title: string }) {
  return (
    <Disclosure id={id} data-testid={id}>
      <DisclosureTitle>{title}</DisclosureTitle>
      <DisclosurePanel>
        <p style={{ margin: 0, blockSize: "40px" }}>{title} content</p>
      </DisclosurePanel>
    </Disclosure>
  );
}

describe("Disclosure", () => {
  test("a 56px title row with a chevron that turns over while the panel opens", async () => {
    renderStill(
      <div style={{ inlineSize: "320px" }}>
        <Item id="a" title="Shipping" />
      </div>,
    );

    const button = trigger("Shipping");
    const indicator = slotOf(button, "indicator");
    expect(rectOf(button).height).toBe(56);
    expect(rectOf(button).width).toBe(320);
    expect(styleOf(button).fontSize).toBe("16px");
    expect(rectOf(indicator).right).toBe(rectOf(button).right - 16);
    expect(styleOf(indicator).rotate).toBe("none");
    expect(rectOf(panelOf("Shipping")).height).toBe(0);

    await userEvent.click(button);

    expect(styleOf(indicator).rotate).toBe("180deg");
    await expect.poll(() => rectOf(panelOf("Shipping")).height).toBe(56);
    expect(styleOf(slotOf(panelOf("Shipping"), "content")).color).toBe(
      colorOf("on-surface-variant"),
    );
  });

  test("keyboard focus rings the title and Enter toggles it", async () => {
    renderStill(<Item id="a" title="Keyboard" />);

    await userEvent.keyboard("{Tab}");
    expect(document.activeElement).toBe(trigger("Keyboard"));
    expect(styleOf(trigger("Keyboard")).outlineStyle).toBe("solid");
    await userEvent.keyboard("{Enter}");
    expect(trigger("Keyboard").getAttribute("aria-expanded")).toBe("true");
  });

  test("filled and outlined disclosures are rounded containers", () => {
    renderStill(
      <>
        <Disclosure data-testid="filled" className="filled">
          <DisclosureTitle>Filled</DisclosureTitle>
        </Disclosure>
        <Disclosure data-testid="outlined" className="outlined">
          <DisclosureTitle>Outlined</DisclosureTitle>
        </Disclosure>
      </>,
    );

    const filled = screen.getByTestId("filled");
    const outlined = screen.getByTestId("outlined");
    expect(styleOf(filled).backgroundColor).toBe(colorOf("surface-container-low"));
    expect(corners(filled)).toEqual(["16px", "16px", "16px", "16px"]);
    expect(styleOf(outlined).borderBlockStartWidth).toBe("1px");
    expect(styleOf(outlined).borderBlockStartColor).toBe(colorOf("outline-variant"));
  });
});

describe("DisclosureGroup", () => {
  test("segmented groups join their items with small inner corners; an open item rounds fully", () => {
    renderStill(
      <DisclosureGroup defaultExpandedKeys={["b"]}>
        <Item id="a" title="First" />
        <Item id="b" title="Middle" />
        <Item id="c" title="Last" />
      </DisclosureGroup>,
    );

    const [first, middle, last] = ["a", "b", "c"].map((id) => screen.getByTestId(id));
    expect(styleOf(first!).backgroundColor).toBe(colorOf("surface-container-low"));
    expect(corners(first!)).toEqual(["16px", "16px", "4px", "4px"]);
    expect(corners(middle!)).toEqual(["16px", "16px", "16px", "16px"]);
    expect(corners(last!)).toEqual(["4px", "4px", "16px", "16px"]);
    expect(rectOf(middle!).top - rectOf(first!).bottom).toBe(2);
  });

  test("a plain group separates its items with dividers", () => {
    renderStill(
      <DisclosureGroup className="plain">
        <Item id="a" title="One" />
        <Item id="b" title="Two" />
      </DisclosureGroup>,
    );

    expect(styleOf(screen.getByTestId("a")).borderBlockStartWidth).toBe("0px");
    expect(styleOf(screen.getByTestId("b")).borderBlockStartWidth).toBe("1px");
    expect(styleOf(screen.getByTestId("b")).backgroundColor).toBe("rgba(0, 0, 0, 0)");
  });
});

describe("Breadcrumbs", () => {
  test("links are quiet, the current page is on-surface and chevrons mirror in RTL", () => {
    renderStill(
      <Breadcrumbs>
        <Breadcrumb id="home">
          <Link href="#home">Home</Link>
        </Breadcrumb>
        <Breadcrumb id="docs">
          <Link href="#docs">Docs</Link>
        </Breadcrumb>
      </Breadcrumbs>,
      "ar-EG",
    );

    const home = screen.getByRole("link", { name: "Home" });
    const docs = screen.getByRole("link", { name: "Docs" });
    const separator = slotOf(home.closest("li")!, "separator");
    expect(styleOf(home).color).toBe(colorOf("on-surface-variant"));
    expect(styleOf(home).textDecorationLine).toBe("none");
    expect(styleOf(docs).color).toBe(colorOf("on-surface"));
    expect(rectOf(docs).right).toBeLessThan(rectOf(home).left);
    expect(rectOf(separator).width).toBe(18);
    expect(styleOf(separator.querySelector("svg")!).transform).toBe("matrix(-1, 0, 0, 1, 0, 0)");
  });
});

describe("Separator", () => {
  test("M3 dividers: 1px outline-variant lines with optional insets", () => {
    renderStill(
      <div style={{ display: "flex", flexDirection: "column", inlineSize: "200px" }}>
        <Separator data-testid="full" />
        <Separator data-testid="inset" className="inset" />
        <Separator data-testid="middle" className="middle-inset" />
        <div style={{ display: "flex", blockSize: "40px" }}>
          <Separator data-testid="vertical" orientation="vertical" />
        </div>
      </div>,
    );

    const full = screen.getByTestId("full");
    expect(rectOf(full).height).toBe(1);
    expect(rectOf(full).width).toBe(200);
    expect(styleOf(full).borderBlockStartColor).toBe(colorOf("outline-variant"));
    expect(rectOf(screen.getByTestId("inset")).width).toBe(184);
    expect(rectOf(screen.getByTestId("middle")).width).toBe(168);
    expect(rectOf(screen.getByTestId("vertical")).width).toBe(1);
    expect(rectOf(screen.getByTestId("vertical")).height).toBe(40);
  });
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  afterEach(() => loadCss(stylexCss, utilitiesCss));

  test("utilities beat the disclosure and separator styles", () => {
    loadCss(...sheets);
    renderStill(
      <>
        <Disclosure data-testid="custom" className="segmented bg-tertiary-container rounded-none">
          <DisclosureTitle>Custom</DisclosureTitle>
        </Disclosure>
        <Separator data-testid="separator" className="inset border-primary ms-xl" />
      </>,
    );

    const custom = screen.getByTestId("custom");
    expect(styleOf(custom).backgroundColor).toBe(colorOf("tertiary-container"));
    expect(corners(custom)).toEqual(["0px", "0px", "0px", "0px"]);
    expect(styleOf(screen.getByTestId("separator")).borderBlockStartColor).toBe(colorOf("primary"));
    expect(styleOf(screen.getByTestId("separator")).marginInlineStart).toBe("24px");
  });
});
