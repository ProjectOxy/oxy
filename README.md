# Oxy UI

React component library on top of [React Aria Components](https://react-spectrum.adobe.com/react-aria/), styled with [StyleX](https://stylexjs.com) to look like Material Design 3 Expressive out of the box and fully re-skinnable through tokens, variant classes, utilities, slots and an unstyled mode.

## Packages

| Package               | Purpose                                                                            |
| --------------------- | ---------------------------------------------------------------------------------- |
| `@oxy/tokens`         | Primitive, semantic and component tokens, `createTheme`, build-time contrast check |
| `@oxy/material-theme` | M3 Expressive theme from a seed color (`createMaterialTheme`) and a neutral base   |
| `@oxy/motion`         | Motion helpers for StyleX, spring → `linear()`, Motion gestures (`/gestures`)      |
| `@oxy/icons`          | Material Symbols icon component                                                    |
| `@oxy/utilities`      | Token-driven utility class layer                                                   |
| `@oxy/ui`             | Components and M3 compositions, one entry per component (`@oxy/ui/button`)         |

Private workspaces under `tools/`:

| Workspace         | Purpose                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `tools/css`       | Compiles the StyleX output of every package into a single static file, `dist/oxy.css`     |
| `tools/storybook` | Storybook (Vite builder) for every component plus the Playwright visual regression suite  |
| `tools/checks`    | CI checks: React Aria coverage of `@oxy/ui` and WCAG contrast of the semantic color pairs |

## Requirements

- [Bun](https://bun.sh) 1.4 (package manager and workspaces)
- Node.js 24 (runtime for the [Vite+](https://viteplus.dev) toolchain)

## Development

```sh
bun install          # install all workspaces
bun run check        # oxfmt formatting + oxlint (type-aware) checks
bun run fmt          # format the repository
bun run lint         # lint only
bun run typecheck    # tsc -b over the project references
bun run test         # vitest across all packages (browser tests need Chromium, see below)
bun run build        # build every package (vp pack) and dist/oxy.css
bun run ready        # everything the verify job runs, in order

bun run storybook        # Storybook dev server on http://localhost:6006
bun run storybook:build  # static Storybook in tools/storybook/storybook-static
bun run visual           # visual regressions against the static build (needs the Playwright image, see below)
bun run visual:update    # rebuild Storybook and re-render every baseline inside the Playwright Docker image
bun run rac-coverage     # which react-aria-components components still lack an @oxy/ui wrapper
bun run contrast         # WCAG AA check of the semantic on-X / X color pairs
```

Inside a package, `vp pack` builds it and `vp pack --watch` rebuilds on change.

Tests named `*.browser.test.ts` run in headless Chromium through Vitest browser mode (`packages/*/vite.browser.config.ts`). Install the browser once with `packages/utilities/node_modules/.bin/playwright install chromium`.

## Storybook

Stories live next to their component (`packages/*/src/**/*.stories.tsx`); foundation stories that belong to no package live in `tools/storybook/stories`. The toolbar exposes four globals that every story is wrapped in:

| Global      | Values                              | Effect                                                                                    |
| ----------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `theme`     | `light`, `dark`                     | Color scheme passed to `createMaterialTheme` from `@oxy/material-theme`                   |
| `direction` | `ltr`, `rtl`                        | `dir` on `<html>` and on the story frame, so logical properties and portals flip together |
| `seed`      | Baseline, Ocean, Forest, …          | Seed color of the Material scheme, generated on the fly                                   |
| `locale`    | `en-US`, `de-DE`, `ru-RU`, `ar-EG`… | Passed to React Aria `I18nProvider`; RTL locales also flip React Aria keyboard behaviour  |

`tools/storybook/src/oxy-provider.tsx` is a stand-in for the `OxyProvider` planned in `@oxy/ui` (theme on a subtree + `I18nProvider`). It keeps the same props (`locale`, `scheme`, `seed`) so the decorator only needs its import swapped once the core lands; the theme comes from `createMaterialTheme` and its `vars` are applied inline on the subtree.

Tag a story with `no-visual` to keep it out of the screenshot suite (for example, stories that depend on timers or randomness).

## Utility classes

`@oxy/utilities` generates atomic classes from the same token source as the components. Every class reads a token variable, so a theme on any subtree changes the utilities too.

| Group      | Classes                                                                                                                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spacing    | `p-*`, `px-*`, `py-*`, `ps-*`, `pe-*`, `pbs-*`, `pbe-*`, the same for `m-*` (plus `auto`), `gap-*`, `gap-x-*`, `gap-y-*` over `space.*`                                                                                     |
| Sizing     | `w-*`, `h-*`, `min-w-*`, `max-w-*`, `min-h-*`, `max-h-*`, `size-*` over `space.*` and `auto`, `full`, `fit`, `min`, `max` (`w-screen` = `100dvw`)                                                                           |
| Color      | `bg-*`, `text-*`, `border-*` over `color.*`; `border`, `border-0` set the width                                                                                                                                             |
| Shape      | `rounded-*`, `rounded-{s,e,bs,be}-*`, `rounded-{ss,se,es,ee}-*` over `radius.*`; `shadow-*` over `elevation.*`                                                                                                              |
| Typography | `type-{role}` sets family, size, line height, weight and tracking of `typography.{role}` (`type-body-large`, `type-title-medium-emphasized`); `font-*`                                                                      |
| Layout     | `flex`, `grid`, `hidden`, …; `flex-row`, `flex-col`, `flex-wrap`, `flex-1`, `grow`, `shrink-0`, `items-*`, `justify-*`, `self-*`, `content-*`; `grid-cols-1…12`, `col-span-*`, `grid-rows-1…6`, `row-span-*`, `grid-flow-*` |

Spacing and radius sides are logical: `s`/`e` are inline start/end, `bs`/`be` block start/end, so utilities flip with the direction like the components do.

A modifier prefix applies a class in one state: `hover:`, `pressed:`, `focus-visible:`, `selected:`, `disabled:`, `invalid:` follow the React Aria `data-*` attributes; `dark:` applies inside the closest `[data-scheme="dark"]` subtree (a nested `[data-scheme="light"]` ends it); `rtl:` uses `:dir(rtl)`; `medium:`, `expanded:`, `large:`, `extra-large:` are mobile-first `min-width` breakpoints at the M3 window size classes (600, 840, 1200, 1600px). Modifiers do not stack.

### Cascade order

Priority is fixed with cascade layers, not with load order or specificity:

```css
@layer oxy.components, oxy.utilities;
```

- `oxy.components` holds everything StyleX emits (`useCSSLayers: stylexLayers` in `stylex.config.ts`, so StyleX writes `oxy.components.priority1…N`). A component's base styles and its variant classes are both StyleX styles merged with `stylex.props(base, ...variants)`, where the later style wins per property, so variants beat the base inside this layer.
- `oxy.utilities` holds the utility classes and comes after `oxy.components`, so a utility beats any component style, including StyleX pseudo-class and media-query layers.
- Both the StyleX CSS and the utilities CSS start by declaring this order, so it holds whichever file loads first. Unlayered CSS of the app still beats both layers.

Wrappers in `@oxy/ui` keep to this: base and variants in StyleX, never in the utilities layer. Consumers who compile Oxy with their own StyleX setup pass `stylexLayers` from `@oxy/utilities` to `useCSSLayers`.

### Generator

- `@oxy/utilities/utilities.css` is the prebuilt full set for the default tokens.
- The Vite plugin serves the set as a virtual module:

  ```ts
  // vite.config.ts
  import { oxyUtilities } from "@oxy/utilities/vite";
  export default {
    plugins: [oxyUtilities({ tokens: { color: { brand: "#ff0066" } }, content: ["src/**/*.tsx"] })],
  };

  // entry
  import "virtual:oxy/utilities.css";
  ```

- The CLI writes the same CSS: `oxy-utilities --config oxy.utilities.config.ts --out src/utilities.css` (the config module default-exports the same object; `--content <glob>` may be repeated).
- `generateUtilities(config, used?)` from `@oxy/utilities` is the API behind both.

`tokens` extends the default token tree. A new token (`color.brand`) gets its classes (`bg-brand`, `hover:bg-brand`, …) and a `:root` declaration of its variable; values may reference other tokens with `{color.primary}`. Tokens that already exist are declared by the StyleX token modules and themes, so passing a whole `theme.tokens` redeclares nothing. `breakpoints` replaces the breakpoint set and `modifiers` adds or overrides modifiers: a template with `&` is a selector (`"&[data-open]"`), one starting with `@` wraps the rules (`"@media (hover: hover)"`).

The full set is about 700 KB (70 KB gzip). With `content` globs the CLI and `vite build` emit only the classes found in those files; the Vite dev server always serves the full set.

## Visual regressions

`tools/storybook/visual` renders every story from `storybook-static/index.json` in four combinations, theme × direction, and compares each against a baseline in `tools/storybook/visual/__screenshots__`. Baselines are committed and rendered inside `mcr.microsoft.com/playwright:<version>-noble`, the same image the `visual-regression` job runs in, so fonts and Chromium match byte for byte. Run `bun run visual:update` (requires Docker) after an intentional visual change and commit the updated PNGs; bump the image tag in `.github/workflows/ci.yml` together with `@playwright/test`. The HTML report of a failed run is uploaded as the `visual-regression-report` artifact.

## CI checks

- **rac-coverage** compares the component exports of the installed `react-aria-components` with the exports of `@oxy/ui`. Contexts, hooks, layout classes and `UNSTABLE_*` exports are skipped automatically; deliberate exclusions (providers, `Collection`, `Virtualizer`, …) live in `tools/checks/rac-coverage.config.ts`. Until the component groups of stage 4 exist the job reports the missing list as a warning instead of failing: flip `enforce: true` in the config (or run with `--strict`) to make it red. The config also fails when an ignored name stops being exported or gets wrapped, so the exclusion list cannot go stale.
- **token-contrast** runs `checkContrast` from `@oxy/tokens` over the themes listed in `tools/checks/contrast.config.ts` (the default theme plus the Material and neutral themes in light/dark × every contrast level; add new themes there) and fails when any `on-X` / `X` pair is below WCAG AA (4.5:1).
- **Pages** (`.github/workflows/pages.yml`) publishes the static Storybook to GitHub Pages on every push to `main`.

## Architecture notes

- ESM only. Every package sets `sideEffects: false` and exposes one export per component so consumers tree-shake at the component level.
- `exports` maps point to source files while developing (`devExports`); `publishConfig.exports` swaps them to `dist` on publish. `vp pack` keeps both in sync.
- Tokens have one typed source in `packages/tokens/src`: `primitives.ts` (palettes, scales), `semantic.ts` and `component.ts`. Values may alias other semantic or component tokens with `{color.primary}`, which becomes `var(--oxy-color-primary)`.
- `bun run --cwd packages/tokens generate` writes `semantic.stylex.ts` and `component.stylex.ts` (`stylex.defineVars` with explicit names like `--oxy-color-primary`, stable across builds). A test fails when they are stale, and the build fails when an `on-X` / `X` color pair is below WCAG AA.
- Components import only `@oxy/tokens/semantic.stylex` and `@oxy/tokens/component.stylex`; primitives are plain values in `@oxy/tokens/primitives` for theme authors and never become CSS variables.
- `createTheme(overrides, base?)` returns `vars` to set as inline style on any subtree. It re-declares every token aliasing an override, so component tokens follow the theme, and nested themes inherit what they do not override.
- Motion tokens (`motion.duration.*`, `motion.easing.*`, `motion.spring.*`, `motion.enabled`) live in `@oxy/tokens`. `bun run --cwd packages/motion generate` writes `motion.stylex.ts`: `duration` and `easing` consts for StyleX, springs converted to CSS `linear()` easings, and `--oxy-motion-allowed`, which drops to `0` under `prefers-reduced-motion`. Every `duration` const is multiplied by `--oxy-motion-enabled` and `--oxy-motion-allowed`, so `createTheme({ motion: { enabled: "0" } })` or the user's reduced-motion setting turns motion off on any subtree. Themes that override springs add `springVars(theme.tokens.motion.spring)` to their vars.
- `presence.fade`, `presence.scale` and `presence.slide` animate React Aria `data-entering` / `data-exiting`. Motion is an optional peer used only by `@oxy/motion/gestures` (`springTransition`, `animateSpring`) for gesture physics, so it never reaches bundles that skip that entry point.
- `createMaterialTheme({ seed, scheme, contrast, overrides })` builds the color roles from a seed with `@material/material-color-utilities` (2025 spec, tonal spot; `contrast` is `standard`, `medium` or `high`), adds the M3 Expressive motion scheme and applies `overrides` last. `createNeutralTheme({ scheme, contrast, overrides })` is the brand-from-scratch base: a monochrome scheme, system font, small radii, flat shadows and non-bouncy springs. Both declare every semantic token plus the spring curves, so either one is complete on any subtree, including one nested inside the other.
- Styles are written with logical properties so RTL needs no separate theme.
- Cascade order is fixed with CSS layers: `oxy.components` (all StyleX output: component base styles, then variants) comes before `oxy.utilities`, so utility classes always win whatever the load order (see [Cascade order](#cascade-order)).
- Shared StyleX compiler options live in `stylex.config.ts`; `vp pack` compiles each package, and `tools/css` collects the CSS of all packages into one file.
