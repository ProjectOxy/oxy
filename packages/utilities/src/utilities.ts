import { cssVar, type TokenTree } from "@oxy/tokens";

export type Declarations = Readonly<Record<string, string>>;
export type Utilities = Map<string, Declarations>;

type Scale = Record<string, string>;
type TokenNode = TokenTree | string | undefined;

const entriesOf = (node: TokenNode) => (typeof node === "object" ? Object.entries(node) : []);

const at = (tokens: TokenTree, path: string) =>
  path
    .split(".")
    .reduce<TokenNode>((node, key) => (typeof node === "object" ? node[key] : undefined), tokens);

const scale = (tokens: TokenTree, group: string): Scale =>
  Object.fromEntries(
    entriesOf(at(tokens, group))
      .filter(([, value]) => typeof value === "string")
      .map(([key]) => [key, `var(${cssVar(`${group}.${key}`)})`]),
  );

const family = (prefix: string, properties: readonly string[], values: Scale) =>
  Object.entries(values).map(
    ([key, value]) =>
      [
        key ? `${prefix}-${key}` : prefix,
        Object.fromEntries(properties.map((property) => [property, value])),
      ] as const,
  );

const keywords = (property: string, values: Scale) =>
  Object.entries(values).map(([name, value]) => [name, { [property]: value }] as const);

const range = (length: number, value: (n: number) => string): Scale =>
  Object.fromEntries(Array.from({ length }, (_, index) => [index + 1, value(index + 1)]));

const alignment = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
};

const distribution = {
  ...alignment,
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
  stretch: "stretch",
};

const logicalSides = (prefix: string, property: string, values: Scale) => [
  ...family(prefix, [property], values),
  ...family(`${prefix}x`, [`${property}-inline`], values),
  ...family(`${prefix}y`, [`${property}-block`], values),
  ...family(`${prefix}s`, [`${property}-inline-start`], values),
  ...family(`${prefix}e`, [`${property}-inline-end`], values),
  ...family(`${prefix}bs`, [`${property}-block-start`], values),
  ...family(`${prefix}be`, [`${property}-block-end`], values),
];

const typeStyles = (tokens: TokenTree) =>
  entriesOf(tokens.typography)
    .filter(([role, value]) => typeof value === "object" && role !== "family")
    .map(([role]) => {
      const token = (property: string) => `var(${cssVar(`typography.${role}.${property}`)})`;
      return [
        `type-${role}`,
        {
          "font-family": token("family"),
          "font-size": token("size"),
          "line-height": token("line-height"),
          "font-weight": token("weight"),
          "letter-spacing": token("tracking"),
        },
      ] as const;
    });

export function createUtilities(tokens: TokenTree): Utilities {
  const color = scale(tokens, "color");
  const space = scale(tokens, "space");
  const radius = scale(tokens, "radius");
  const size = {
    ...space,
    auto: "auto",
    full: "100%",
    fit: "fit-content",
    min: "min-content",
    max: "max-content",
  };

  return new Map<string, Declarations>([
    ...logicalSides("p", "padding", space),
    ...logicalSides("m", "margin", { ...space, auto: "auto" }),
    ...family("gap", ["gap"], space),
    ...family("gap-x", ["column-gap"], space),
    ...family("gap-y", ["row-gap"], space),

    ...family("w", ["inline-size"], { ...size, screen: "100dvw" }),
    ...family("h", ["block-size"], { ...size, screen: "100dvh" }),
    ...family("min-w", ["min-inline-size"], size),
    ...family("min-h", ["min-block-size"], size),
    ...family("max-w", ["max-inline-size"], { ...size, none: "none" }),
    ...family("max-h", ["max-block-size"], { ...size, none: "none" }),
    ...family("size", ["inline-size", "block-size"], size),

    ...family("bg", ["background-color"], color),
    ...family("text", ["color"], color),
    ...family("border", ["border-color"], color),
    ["border", { "border-width": "1px", "border-style": "solid" }],
    ["border-0", { "border-width": "0" }],

    ...family("rounded", ["border-radius"], radius),
    ...family("rounded-s", ["border-start-start-radius", "border-end-start-radius"], radius),
    ...family("rounded-e", ["border-start-end-radius", "border-end-end-radius"], radius),
    ...family("rounded-bs", ["border-start-start-radius", "border-start-end-radius"], radius),
    ...family("rounded-be", ["border-end-start-radius", "border-end-end-radius"], radius),
    ...family("rounded-ss", ["border-start-start-radius"], radius),
    ...family("rounded-se", ["border-start-end-radius"], radius),
    ...family("rounded-es", ["border-end-start-radius"], radius),
    ...family("rounded-ee", ["border-end-end-radius"], radius),

    ...family("shadow", ["box-shadow"], scale(tokens, "elevation")),

    ...typeStyles(tokens),
    ...family("font", ["font-family"], scale(tokens, "typography.family")),

    ...keywords("display", {
      block: "block",
      "inline-block": "inline-block",
      inline: "inline",
      flex: "flex",
      "inline-flex": "inline-flex",
      grid: "grid",
      "inline-grid": "inline-grid",
      contents: "contents",
      hidden: "none",
    }),
    ...family("flex", ["flex-direction"], {
      row: "row",
      "row-reverse": "row-reverse",
      col: "column",
      "col-reverse": "column-reverse",
    }),
    ...family("flex", ["flex-wrap"], {
      wrap: "wrap",
      "wrap-reverse": "wrap-reverse",
      nowrap: "nowrap",
    }),
    ...family("flex", ["flex"], {
      1: "1 1 0%",
      auto: "1 1 auto",
      initial: "0 1 auto",
      none: "none",
    }),
    ...family("grow", ["flex-grow"], { "": "1", 0: "0" }),
    ...family("shrink", ["flex-shrink"], { "": "1", 0: "0" }),
    ...family("items", ["align-items"], { ...alignment, baseline: "baseline", stretch: "stretch" }),
    ...family("justify", ["justify-content"], distribution),
    ...family("self", ["align-self"], {
      auto: "auto",
      ...alignment,
      baseline: "baseline",
      stretch: "stretch",
    }),
    ...family("content", ["align-content"], distribution),

    ...family("grid-cols", ["grid-template-columns"], {
      ...range(12, (n) => `repeat(${n}, minmax(0, 1fr))`),
      none: "none",
    }),
    ...family("grid-rows", ["grid-template-rows"], {
      ...range(6, (n) => `repeat(${n}, minmax(0, 1fr))`),
      none: "none",
    }),
    ...family("col-span", ["grid-column"], {
      ...range(12, (n) => `span ${n} / span ${n}`),
      full: "1 / -1",
    }),
    ...family("row-span", ["grid-row"], {
      ...range(6, (n) => `span ${n} / span ${n}`),
      full: "1 / -1",
    }),
    ...family("grid-flow", ["grid-auto-flow"], {
      row: "row",
      col: "column",
      dense: "dense",
      "row-dense": "row dense",
      "col-dense": "column dense",
    }),
  ]);
}
