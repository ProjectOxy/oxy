import { describe, expect, test } from "vite-plus/test";
import { buttonVariants, defineVariants } from "../src/index.ts";

describe("defineVariants", () => {
  test("picks every modifier by its group and hands the rest over as utilities", () => {
    expect(buttonVariants.parse("tonal lg bg-tertiary secondary square hover:px-xl dense")).toEqual(
      {
        variants: {
          variant: "tonal",
          size: "lg",
          tone: "secondary",
          shape: "square",
          density: "dense",
        },
        className: "bg-tertiary hover:px-xl",
      },
    );
  });

  test("falls back to the defaults for groups the class string leaves out", () => {
    expect(buttonVariants.parse("outlined")).toEqual({
      variants: { ...buttonVariants.defaults, variant: "outlined" },
      className: "",
    });
    expect(buttonVariants.parse(undefined).variants).toEqual(buttonVariants.defaults);
  });

  test("lets the last modifier of a group win", () => {
    expect(buttonVariants.parse("xs tonal xl text").variants).toMatchObject({
      variant: "text",
      size: "xl",
    });
  });

  test("ignores extra whitespace and keeps utility order", () => {
    expect(buttonVariants.parse("  px-md\n  elevated\tpy-sm  ")).toEqual({
      variants: { ...buttonVariants.defaults, variant: "elevated" },
      className: "px-md py-sm",
    });
  });

  test("only matches whole modifier names", () => {
    expect(buttonVariants.parse("text-primary bg-error lg:px-md").className).toBe(
      "text-primary bg-error lg:px-md",
    );
  });

  test("rejects a modifier declared in two groups", () => {
    expect(() =>
      defineVariants(
        { variant: ["outlined"], shape: ["outlined"] },
        { variant: "outlined", shape: "outlined" },
      ),
    ).toThrow('Variant "outlined" is declared in both "variant" and "shape"');
  });
});
