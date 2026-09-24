import { componentTokens } from "./component.ts";
import { semanticTokens } from "./semantic.ts";
import {
  cssVar,
  type CssVar,
  type DeepPartial,
  flattenTokens,
  referencesOf,
  resolveTokens,
  toCssValue,
  type TokenTree,
} from "./tree.ts";

export const tokens = { ...semanticTokens, ...componentTokens };

export type Tokens = typeof tokens;
export type ThemeOverrides = DeepPartial<Tokens>;

export interface Theme {
  readonly tokens: Tokens;
  readonly vars: Readonly<Record<CssVar, string>>;
}

export const defaultTheme: Theme = { tokens, vars: {} };

function merge(base: TokenTree, overrides: object, changed: Set<string>, prefix = ""): TokenTree {
  const merged: Record<string, string | TokenTree> = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue;
    const current = base[key];
    const path = prefix + key;
    if (current === undefined) throw new Error(`Unknown token ${path}`);
    if (typeof current !== typeof value)
      throw new Error(`Token ${path} must be a ${typeof current}`);
    if (typeof value === "string") changed.add(path);
    merged[key] =
      typeof value === "string" ? value : merge(current as TokenTree, value, changed, `${path}.`);
  }
  return merged;
}

function dependentsOf(changed: Set<string>, flat: Map<string, string>): Set<string> {
  const affected = new Set(changed);
  let grew = true;
  while (grew) {
    grew = false;
    for (const [path, value] of flat) {
      if (!affected.has(path) && referencesOf(value).some((ref) => affected.has(ref))) {
        affected.add(path);
        grew = true;
      }
    }
  }
  return affected;
}

export function createTheme(overrides: ThemeOverrides, base: Theme = defaultTheme): Theme {
  const changed = new Set<string>();
  const merged = merge(base.tokens, overrides, changed) as Tokens;
  resolveTokens(merged);

  const flat = flattenTokens(merged);
  const vars: Record<CssVar, string> = { ...base.vars };
  for (const path of dependentsOf(changed, flat)) {
    vars[cssVar(path)] = toCssValue(flat.get(path) as string);
  }
  return { tokens: merged, vars };
}
