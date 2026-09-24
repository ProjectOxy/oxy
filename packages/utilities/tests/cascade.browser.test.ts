import { color, radius, space } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { page } from "vite-plus/test/browser";
import { generateUtilities, layerOrder } from "../src/index.ts";

const styles = stylex.create({
  surface: {
    padding: space["--oxy-space-sm"],
    paddingInline: space["--oxy-space-md"],
    borderRadius: radius["--oxy-radius-sm"],
    color: color["--oxy-color-on-primary"],
    backgroundColor: {
      default: color["--oxy-color-primary"],
      ":not(:disabled)": color["--oxy-color-secondary-container"],
    },
  },
});

const component = stylex.props(styles.surface).className ?? "";
const stylexCss = await fetch("/stylex.css").then((response) => response.text());
const utilitiesCss = generateUtilities();

function loadCss(...sheets: string[]) {
  for (const css of sheets) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);
  }
}

function render(html: string) {
  document.body.innerHTML = html;
  return (id: string) => getComputedStyle(document.getElementById(id) as HTMLElement);
}

function tokenValue(property: string, value: string) {
  const probe = document.createElement("div");
  probe.style.setProperty(property, value);
  document.body.append(probe);
  const computed = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return computed;
}

const background = (token: string) => tokenValue("background-color", `var(--oxy-color-${token})`);

afterEach(async () => {
  for (const style of document.head.querySelectorAll("style")) style.remove();
  document.body.innerHTML = "";
  await page.viewport(414, 896);
});

describe.each([
  ["StyleX CSS loads first", [stylexCss, utilitiesCss]],
  ["utilities CSS loads first", [utilitiesCss, stylexCss]],
])("when the %s", (_, sheets) => {
  test("a StyleX component keeps its base styles without utilities", () => {
    loadCss(...sheets);
    const style = render(`<div id="card" class="${component}"></div>`);

    expect(style("card").backgroundColor).toBe(background("secondary-container"));
    expect(style("card").paddingInlineStart).toBe(tokenValue("padding", "var(--oxy-space-md)"));
  });

  test("utilities override the StyleX base styles of the component", () => {
    loadCss(...sheets);
    const style = render(
      `<div id="card" class="${component} bg-tertiary text-on-tertiary px-xl rounded-full"></div>`,
    );

    expect(style("card").backgroundColor).toBe(background("tertiary"));
    expect(style("card").color).toBe(tokenValue("color", "var(--oxy-color-on-tertiary)"));
    expect(style("card").paddingInlineStart).toBe(tokenValue("padding", "var(--oxy-space-xl)"));
    expect(style("card").paddingBlockStart).toBe(tokenValue("padding", "var(--oxy-space-sm)"));
    expect(style("card").borderStartStartRadius).toBe(
      tokenValue("border-radius", "var(--oxy-radius-full)"),
    );
  });

  test("state utilities override the component in that state", () => {
    loadCss(...sheets);
    const style = render(
      `<div id="card" class="${component} hover:bg-error" data-hovered="true"></div>`,
    );
    expect(style("card").backgroundColor).toBe(background("error"));
  });
});

test("without the layer order statement a later StyleX sheet would win", () => {
  loadCss(utilitiesCss.replace(layerOrder, ""), stylexCss);
  const style = render(`<div id="card" class="${component} bg-tertiary"></div>`);
  expect(style("card").backgroundColor).toBe(background("secondary-container"));
});

describe("modifiers", () => {
  test.each([
    ["hover", "data-hovered"],
    ["pressed", "data-pressed"],
    ["focus-visible", "data-focus-visible"],
    ["selected", "data-selected"],
    ["disabled", "data-disabled"],
    ["invalid", "data-invalid"],
  ])("%s: follows the React Aria %s attribute", (modifier, attribute) => {
    loadCss(stylexCss, utilitiesCss);
    const style = render(`
      <div id="idle" class="bg-primary ${modifier}:bg-tertiary"></div>
      <div id="active" class="bg-primary ${modifier}:bg-tertiary" ${attribute}="true"></div>
    `);

    expect(style("idle").backgroundColor).toBe(background("primary"));
    expect(style("active").backgroundColor).toBe(background("tertiary"));
  });

  test("dark: applies inside the closest dark scheme only", () => {
    loadCss(stylexCss, utilitiesCss);
    const style = render(`
      <div data-scheme="light"><span id="light" class="bg-primary dark:bg-tertiary"></span>
        <div data-scheme="dark"><span id="dark" class="bg-primary dark:bg-tertiary"></span>
          <div data-scheme="light"><span id="nested" class="bg-primary dark:bg-tertiary"></span></div>
        </div>
      </div>
    `);

    expect(style("light").backgroundColor).toBe(background("primary"));
    expect(style("dark").backgroundColor).toBe(background("tertiary"));
    expect(style("nested").backgroundColor).toBe(background("primary"));
  });

  test("rtl: applies in a right-to-left subtree", () => {
    loadCss(stylexCss, utilitiesCss);
    const style = render(`
      <div dir="ltr"><span id="ltr" class="bg-primary rtl:bg-tertiary"></span></div>
      <div dir="rtl"><span id="rtl" class="bg-primary rtl:bg-tertiary"></span></div>
    `);

    expect(style("ltr").backgroundColor).toBe(background("primary"));
    expect(style("rtl").backgroundColor).toBe(background("tertiary"));
  });

  test("breakpoints are mobile-first and wider ones win", async () => {
    loadCss(stylexCss, utilitiesCss);
    const style = render(
      `<div id="layout" class="flex flex-col medium:flex-row expanded:hidden"></div>`,
    );

    expect(style("layout").flexDirection).toBe("column");
    await page.viewport(600, 800);
    expect(style("layout").flexDirection).toBe("row");
    expect(style("layout").display).toBe("flex");
    await page.viewport(840, 800);
    expect(style("layout").display).toBe("none");
  });
});

test("a custom token gets its own utility class", () => {
  loadCss(stylexCss, generateUtilities({ tokens: { color: { brand: "#ff0066" } } }));
  const style = render(`<div id="brand" class="bg-brand"></div>`);
  expect(style("brand").backgroundColor).toBe("rgb(255, 0, 102)");
});
