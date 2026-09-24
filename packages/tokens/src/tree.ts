export interface TokenTree {
  readonly [key: string]: string | TokenTree;
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]>;
};

export type CssVar = `--oxy-${string}`;

export interface TokenEntry {
  path: string;
  cssVar: CssVar;
  value: string;
}

const reference = /\{([^{}]+)\}/g;

export const cssVar = (path: string): CssVar => `--oxy-${path.replaceAll(".", "-")}`;

export const toCssValue = (value: string) =>
  value.replace(reference, (_, path: string) => `var(${cssVar(path)})`);

export const referencesOf = (value: string) =>
  Array.from(value.matchAll(reference), ([, path]) => path as string);

export function flattenTokens(tree: TokenTree, prefix = ""): Map<string, string> {
  const flat = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix + key;
    if (typeof value === "string") flat.set(path, value);
    else for (const entry of flattenTokens(value, `${path}.`)) flat.set(...entry);
  }
  return flat;
}

export function tokenEntries(tree: TokenTree): TokenEntry[] {
  return Array.from(flattenTokens(tree), ([path, value]) => ({
    path,
    cssVar: cssVar(path),
    value: toCssValue(value),
  }));
}

export function resolveTokens(tree: TokenTree): Map<string, string> {
  const raw = flattenTokens(tree);
  const resolved = new Map<string, string>();

  const resolve = (path: string, chain: string[]): string => {
    const known = resolved.get(path);
    if (known !== undefined) return known;
    const value = raw.get(path);
    if (value === undefined)
      throw new Error(`Unknown token reference {${path}} in ${chain.at(-1)}`);
    if (chain.includes(path))
      throw new Error(`Circular token reference: ${[...chain, path].join(" → ")}`);
    const result = value.replace(reference, (_, ref: string) => resolve(ref, [...chain, path]));
    resolved.set(path, result);
    return result;
  };

  for (const path of raw.keys()) resolve(path, []);
  return resolved;
}
