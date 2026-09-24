import { flattenTokens, tokenEntries, tokens as baseTokens, type TokenTree } from "@oxy/tokens";
import { layerOrder, layers } from "./layers.ts";
import {
  breakpointModifiers,
  breakpoints,
  schemeModifiers,
  stateModifiers,
  type Modifiers,
} from "./modifiers.ts";
import { createUtilities, type Utilities } from "./utilities.ts";

export interface UtilitiesConfig {
  tokens?: TokenTree;
  breakpoints?: Record<string, string>;
  modifiers?: Modifiers;
  content?: string[];
}

function extend(base: TokenTree, extension: TokenTree): TokenTree {
  const merged: Record<string, string | TokenTree> = { ...base };
  for (const [key, value] of Object.entries(extension)) {
    const current = merged[key];
    merged[key] =
      typeof value === "object" && typeof current === "object" ? extend(current, value) : value;
  }
  return merged;
}

export const escapeClassName = (name: string) =>
  name.replace(/[^\w-]/g, "\\$&").replace(/^\d/, (digit) => `\\3${digit} `);

const block = (declarations: Record<string, string>) =>
  Object.entries(declarations)
    .map(([property, value]) => `${property}:${value}`)
    .join(";");

export const extractCandidates = (source: string) => new Set(source.match(/[\w:-]+/g));

function rules(
  utilities: Utilities,
  used: ReadonlySet<string> | undefined,
  [modifier, template]: [name: string, template: string] = ["", "&"],
) {
  const nested = template.startsWith("@");
  const lines = Array.from(utilities).flatMap(([utility, declarations]) => {
    const className = modifier ? `${modifier}:${utility}` : utility;
    if (used && !used.has(className)) return [];
    const selector = `.${escapeClassName(className)}`;
    return `${nested ? selector : template.replaceAll("&", selector)}{${block(declarations)}}`;
  });
  return nested && lines.length ? [`${template}{`, ...lines, "}"] : lines;
}

export function generateUtilities(
  config: UtilitiesConfig = {},
  used?: ReadonlySet<string>,
): string {
  const tokens = config.tokens ? extend(baseTokens, config.tokens) : baseTokens;
  const known = flattenTokens(baseTokens);
  const customTokens = tokenEntries(config.tokens ?? {}).filter(({ path }) => !known.has(path));
  const modifiers = {
    ...stateModifiers,
    ...schemeModifiers,
    ...config.modifiers,
    ...breakpointModifiers(config.breakpoints ?? breakpoints),
  };
  const utilities = createUtilities(tokens);

  const body = [
    ...(customTokens.length
      ? [
          `:root{${block(Object.fromEntries(customTokens.map((token) => [token.cssVar, token.value])))}}`,
        ]
      : []),
    ...rules(utilities, used),
    ...Object.entries(modifiers).flatMap((modifier) => rules(utilities, used, modifier)),
  ];
  return `${layerOrder}\n@layer ${layers.utilities}{\n${body.join("\n")}\n}\n`;
}
