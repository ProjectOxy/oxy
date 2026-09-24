import { tokens } from "@oxy/tokens";
import { describe, expect, test } from "vite-plus/test";
import {
  escapeClassName,
  extractCandidates,
  generateUtilities,
  layerOrder,
  layers,
} from "../src/index.ts";

const css = generateUtilities();
const lines = css.split("\n");
const ruleFor = (selector: string) => lines.find((line) => line.startsWith(`${selector}{`));

describe("generateUtilities", () => {
  test("declares the layer order before any rule and wraps every rule in the utilities layer", () => {
    expect(lines[0]).toBe(layerOrder);
    expect(layerOrder).toBe("@layer oxy.components, oxy.utilities;");
    expect(lines[1]).toBe(`@layer ${layers.utilities}{`);
    expect(css.trimEnd().endsWith("}\n}")).toBe(true);
  });

  test("utilities reference token variables so they follow the theme", () => {
    expect(ruleFor(".bg-primary")).toBe(".bg-primary{background-color:var(--oxy-color-primary)}");
    expect(ruleFor(".text-on-surface")).toBe(".text-on-surface{color:var(--oxy-color-on-surface)}");
    expect(ruleFor(".px-lg")).toBe(".px-lg{padding-inline:var(--oxy-space-lg)}");
    expect(ruleFor(".rounded-xl-increased")).toBe(
      ".rounded-xl-increased{border-radius:var(--oxy-radius-xl-increased)}",
    );
    expect(ruleFor(".shadow-level3")).toBe(
      ".shadow-level3{box-shadow:var(--oxy-elevation-level3)}",
    );
    expect(ruleFor(".type-title-medium-emphasized")).toBe(
      ".type-title-medium-emphasized{" +
        "font-family:var(--oxy-typography-title-medium-emphasized-family);" +
        "font-size:var(--oxy-typography-title-medium-emphasized-size);" +
        "line-height:var(--oxy-typography-title-medium-emphasized-line-height);" +
        "font-weight:var(--oxy-typography-title-medium-emphasized-weight);" +
        "letter-spacing:var(--oxy-typography-title-medium-emphasized-tracking)}",
    );
  });

  test("covers every semantic color, space, radius and elevation token", () => {
    const groups = {
      bg: tokens.color,
      p: tokens.space,
      rounded: tokens.radius,
      shadow: tokens.elevation,
    };
    for (const [prefix, group] of Object.entries(groups)) {
      for (const key of Object.keys(group)) expect(ruleFor(`.${prefix}-${key}`)).toBeDefined();
    }
  });

  test("uses logical properties only", () => {
    const physical =
      /[{;](?:(?:margin|padding|border)-(?:left|right|top|bottom)[\w-]*|width|height|left|right|top|bottom):/;
    expect(lines.filter((line) => physical.test(line))).toEqual([]);
  });

  test("state modifiers follow React Aria data attributes", () => {
    expect(ruleFor(".hover\\:bg-primary[data-hovered]")).toBeDefined();
    expect(ruleFor(".pressed\\:shadow-level1[data-pressed]")).toBeDefined();
    expect(ruleFor(".focus-visible\\:rounded-sm[data-focus-visible]")).toBeDefined();
    expect(ruleFor(".selected\\:bg-secondary-container[data-selected]")).toBeDefined();
    expect(ruleFor(".disabled\\:text-on-surface[data-disabled]")).toBeDefined();
    expect(ruleFor(".invalid\\:border-error[data-invalid]")).toBeDefined();
    expect(ruleFor(".rtl\\:flex-row-reverse:dir(rtl)")).toBeDefined();
  });

  test("scheme and breakpoint modifiers come after base utilities, breakpoints ascending", () => {
    const atRules = lines.filter((line) => line.startsWith("@") && line !== lines[0]).slice(1);
    expect(atRules).toEqual([
      '@scope ([data-scheme="dark"]) to ([data-scheme="light"]){',
      "@media (width >= 600px){",
      "@media (width >= 840px){",
      "@media (width >= 1200px){",
      "@media (width >= 1600px){",
    ]);
    expect(lines.indexOf(".expanded\\:flex-row{flex-direction:row}")).toBeGreaterThan(
      lines.indexOf(".medium\\:flex-row{flex-direction:row}"),
    );
    expect(lines.indexOf(".medium\\:flex-row{flex-direction:row}")).toBeGreaterThan(
      lines.indexOf(".flex-row{flex-direction:row}"),
    );
  });

  test("custom tokens produce classes and declare their variables", () => {
    const custom = generateUtilities({
      tokens: {
        color: { brand: "#ff0066", "on-brand": "{color.on-primary}" },
        space: { gutter: "20px" },
      },
    });

    expect(custom).toContain(
      ":root{--oxy-color-brand:#ff0066;--oxy-color-on-brand:var(--oxy-color-on-primary);--oxy-space-gutter:20px}",
    );
    expect(custom).toContain(".bg-brand{background-color:var(--oxy-color-brand)}");
    expect(custom).toContain(".text-on-brand{color:var(--oxy-color-on-brand)}");
    expect(custom).toContain(
      ".hover\\:bg-brand[data-hovered]{background-color:var(--oxy-color-brand)}",
    );
    expect(custom).toContain(".gap-gutter{gap:var(--oxy-space-gutter)}");
  });

  test("passing a whole theme's tokens redeclares nothing the theme already owns", () => {
    const themed = generateUtilities({ tokens });
    expect(themed).not.toContain(":root{");
    expect(themed).toBe(css);
  });

  test("custom breakpoints and modifiers replace or extend the defaults", () => {
    const custom = generateUtilities({
      breakpoints: { tablet: "700px" },
      modifiers: { open: "&[data-open]" },
    });

    expect(custom).toContain("@media (width >= 700px){\n.tablet\\:p-none{");
    expect(custom).toContain(".tablet\\:flex-row{flex-direction:row}");
    expect(custom).not.toContain("width >= 600px");
    expect(custom).toContain(".open\\:shadow-level2[data-open]{");
  });

  test("emits only the used classes when given candidates", () => {
    const used = extractCandidates(
      `<div className="bg-primary hover:bg-tertiary medium:flex-row unknown-class" />`,
    );
    expect(generateUtilities({}, used)).toBe(
      [
        layerOrder,
        `@layer ${layers.utilities}{`,
        ".bg-primary{background-color:var(--oxy-color-primary)}",
        ".hover\\:bg-tertiary[data-hovered]{background-color:var(--oxy-color-tertiary)}",
        "@media (width >= 600px){",
        ".medium\\:flex-row{flex-direction:row}",
        "}",
        "}",
        "",
      ].join("\n"),
    );
  });
});

test("escapeClassName escapes modifiers and leading digits", () => {
  expect(escapeClassName("hover:bg-primary")).toBe("hover\\:bg-primary");
  expect(escapeClassName("2xl:p-md")).toBe("\\32 xl\\:p-md");
});
