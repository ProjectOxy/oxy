import { springVars } from "@oxy/motion";
import { checkContrast, cssVar, flattenTokens, semanticTokens } from "@oxy/tokens";
import { describe, expect, test } from "vite-plus/test";
import {
  colorSchemes,
  contrasts,
  createMaterialTheme,
  createNeutralTheme,
  expressiveTokens,
  materialDarkTheme,
  materialTheme,
  neutralTheme,
} from "../src/index.ts";

const seeds = ["#6750a4", "#0061a4", "#386a20", "#b3261e", "#7d5700", "#ffff00", "#808080"];

const hexChannels = (hex: string) => [1, 3, 5].map((i) => hex.slice(i, i + 2));

const changedVars = (before: object, after: object) =>
  Object.entries(after)
    .filter(([name, value]) => before[name as keyof typeof before] !== value)
    .map(([name]) => name);

describe("createMaterialTheme", () => {
  test("different seeds give different schemes", () => {
    const [ocean, forest] = ["#0061a4", "#386a20"].map((seed) => createMaterialTheme({ seed }));

    for (const role of ["primary", "secondary", "tertiary", "primary-container", "surface"]) {
      expect(ocean?.vars[cssVar(`color.${role}`)]).not.toBe(forest?.vars[cssVar(`color.${role}`)]);
    }
    expect(createMaterialTheme({ seed: "#0061a4" })).toEqual(ocean);
  });

  test("light, dark and contrast variants of one seed differ", () => {
    const schemes = colorSchemes.flatMap((scheme) =>
      contrasts.map((contrast) =>
        JSON.stringify(createMaterialTheme({ scheme, contrast }).tokens.color),
      ),
    );
    expect(new Set(schemes).size).toBe(schemes.length);
    expect(materialDarkTheme).toEqual(createMaterialTheme({ scheme: "dark" }));
  });

  test("overrides replace only the targeted tokens and their aliases", () => {
    const theme = createMaterialTheme({
      seed: "#0061a4",
      overrides: {
        color: { primary: "#123456" },
        radius: { md: "{radius.xl}" },
        button: { sm: { height: "48px" } },
      },
    });
    const base = createMaterialTheme({ seed: "#0061a4" });

    expect(changedVars(base.vars, theme.vars)).toEqual([
      "--oxy-color-primary",
      "--oxy-radius-md",
      "--oxy-button-sm-height",
    ]);
    expect(theme.vars["--oxy-color-surface-tint"]).toBe("var(--oxy-color-primary)");
    expect(theme.vars["--oxy-card-radius"]).toBe("var(--oxy-radius-md)");
  });

  test("declares every semantic token so the theme is complete on any subtree", () => {
    for (const theme of [materialTheme, neutralTheme]) {
      for (const path of flattenTokens(semanticTokens).keys()) {
        expect(theme.vars).toHaveProperty([cssVar(path)]);
      }
    }
  });

  test("ships the M3 Expressive shape, type, elevation and spring scales", () => {
    const { tokens, vars } = materialTheme;

    expect(tokens.radius).toMatchObject({
      "lg-increased": "20px",
      "xl-increased": "32px",
      "2xl": "48px",
    });
    expect(tokens.typography["title-medium-emphasized"].weight).toBe("700");
    expect(tokens.elevation.level3).toContain("{color.shadow}");
    expect(tokens.motion.spring).toEqual(expressiveTokens.motion.spring);
    expect(vars).toMatchObject(springVars(expressiveTokens.motion.spring));
  });

  test("spring overrides regenerate the CSS spring curves", () => {
    const spring = { damping: "0.5", stiffness: "500" };
    const theme = createMaterialTheme({
      overrides: { motion: { spring: { spatial: { fast: spring } } } },
    });

    expect(theme.tokens.motion.spring.spatial.fast).toEqual(spring);
    expect(theme.vars).toMatchObject(springVars(theme.tokens.motion.spring));
    expect(theme.vars["--oxy-motion-spring-spatial-fast-easing"]).not.toBe(
      materialTheme.vars["--oxy-motion-spring-spatial-fast-easing"],
    );
  });
});

describe("createNeutralTheme", () => {
  test("is a grayscale base with an error hue, system font and small radii", () => {
    const { color, typography, radius } = neutralTheme.tokens;
    const chromatic = Object.entries(color)
      .filter(([, value]) => value.startsWith("#") && new Set(hexChannels(value)).size > 1)
      .map(([role]) => role);

    expect(chromatic.every((role) => role.includes("error"))).toBe(true);
    expect(chromatic).toContain("error");
    expect(typography.family.brand).toBe("system-ui, sans-serif");
    expect(radius.xl).toBe("12px");
  });

  test("overrides build a brand on top of it", () => {
    const brand = createNeutralTheme({
      scheme: "dark",
      overrides: { color: { primary: "#ffb4ab" } },
    });
    expect(brand.tokens.color.primary).toBe("#ffb4ab");
    expect(brand.tokens.color.surface).toBe(
      createNeutralTheme({ scheme: "dark" }).tokens.color.surface,
    );
  });
});

describe("contrast", () => {
  const variants = colorSchemes.flatMap((scheme) =>
    contrasts.map((contrast) => ({ scheme, contrast })),
  );

  test.each(variants)(
    "material $scheme / $contrast passes AA for every seed",
    ({ scheme, contrast }) => {
      for (const seed of seeds) {
        const failures = checkContrast(createMaterialTheme({ seed, scheme, contrast })).filter(
          ({ passes }) => !passes,
        );
        expect(failures, seed).toEqual([]);
      }
    },
  );

  test.each(colorSchemes)("material %s at high contrast reaches 7:1 for every seed", (scheme) => {
    for (const seed of seeds) {
      const theme = createMaterialTheme({ seed, scheme, contrast: "high" });
      expect(
        checkContrast(theme, 7).filter(({ passes }) => !passes),
        seed,
      ).toEqual([]);
    }
  });

  test.each(variants)("neutral $scheme / $contrast passes AA", ({ scheme, contrast }) => {
    expect(
      checkContrast(createNeutralTheme({ scheme, contrast })).filter(({ passes }) => !passes),
    ).toEqual([]);
  });
});
