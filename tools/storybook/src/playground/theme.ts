import {
  baselineSeed,
  type ColorScheme,
  type Contrast,
  createMaterialTheme,
  type MaterialThemeOptions,
} from "@oxy/material-theme";
import { flattenTokens, type Theme, type ThemeOverrides, tokens } from "@oxy/tokens";

export type TokenValues = Readonly<Record<string, string>>;

export interface PlaygroundOptions {
  seed: string;
  scheme: ColorScheme;
  contrast: Contrast;
  tokens: TokenValues;
}

export const defaultPlaygroundOptions: PlaygroundOptions = {
  seed: baselineSeed,
  scheme: "light",
  contrast: "standard",
  tokens: {},
};

export const tokenGroups = Object.keys(tokens) as (keyof typeof tokens)[];

type TokenBranch = { [key: string]: string | TokenBranch };

export function nestTokens(values: TokenValues): ThemeOverrides {
  const root: TokenBranch = {};
  for (const [path, value] of Object.entries(values)) {
    const keys = path.split(".");
    const leaf = keys.pop() as string;
    const branch = keys.reduce<TokenBranch>((node, key) => (node[key] ??= {}) as TokenBranch, root);
    branch[leaf] = value;
  }
  return root as ThemeOverrides;
}

export const materialThemeOptions = ({
  tokens,
  ...options
}: PlaygroundOptions): Required<MaterialThemeOptions> => ({
  ...options,
  overrides: nestTokens(tokens),
});

export const playgroundTheme = (options: PlaygroundOptions) =>
  createMaterialTheme(materialThemeOptions(options));

const defaultTokens = flattenTokens(tokens);

export const themeOverrides = (theme: Theme) =>
  nestTokens(
    Object.fromEntries(
      [...flattenTokens(theme.tokens)].filter(([path, value]) => defaultTokens.get(path) !== value),
    ),
  );

export interface Playground {
  options: PlaygroundOptions;
  theme: Theme;
}

export const exportFormats = {
  createMaterialTheme: ({ options }: Playground) => materialThemeOptions(options),
  createTheme: ({ theme }: Playground) => themeOverrides(theme),
};

export type ExportFormat = keyof typeof exportFormats;

export const exportTheme = (format: ExportFormat, playground: Playground) =>
  JSON.stringify(exportFormats[format](playground), null, 2);
