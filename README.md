# Oxy UI

React component library on top of [React Aria Components](https://react-spectrum.adobe.com/react-aria/), styled with [StyleX](https://stylexjs.com) to look like Material Design 3 Expressive out of the box and fully re-skinnable through tokens, variant classes, utilities, slots and an unstyled mode.

## Packages

| Package               | Purpose                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- |
| `@oxy/tokens`         | Primitive, semantic and component tokens, `createTheme`, build-time contrast check    |
| `@oxy/material-theme` | Material Design 3 Expressive theme built on the tokens (`createTheme`)                |
| `@oxy/motion`         | Motion helpers for StyleX, spring → `linear()`, Motion gestures (`/gestures`)         |
| `@oxy/icons`          | Material Symbols `Icon`, one export per symbol, Vite font-subsetting plugin (`/vite`) |
| `@oxy/utilities`      | Token-driven utility class layer                                                      |
| `@oxy/ui`             | Components and M3 compositions, one entry per component (`@oxy/ui/button`)            |

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
bun run test         # vitest across all packages
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

## Storybook

Stories live next to their component (`packages/*/src/**/*.stories.tsx`); foundation stories that belong to no package live in `tools/storybook/stories`. The toolbar exposes four globals that every story is wrapped in:

| Global      | Values                              | Effect                                                                                    |
| ----------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `theme`     | `light`, `dark`                     | Color scheme: `dark` applies `materialDarkTheme` from `@oxy/material-theme`               |
| `direction` | `ltr`, `rtl`                        | `dir` on `<html>` and on the story frame, so logical properties and portals flip together |
| `seed`      | Baseline, Ocean, Forest, …          | Seed color of the Material scheme; non-baseline seeds are generated on the fly            |
| `locale`    | `en-US`, `de-DE`, `ru-RU`, `ar-EG`… | Passed to React Aria `I18nProvider`; RTL locales also flip React Aria keyboard behaviour  |

`tools/storybook/src/oxy-provider.tsx` is a stand-in for the `OxyProvider` planned in `@oxy/ui` (theme on a subtree + `I18nProvider`). It keeps the same props (`locale`, `scheme`, `seed`) so the decorator only needs its import swapped once the core lands; seed-based schemes come from `@material/material-color-utilities` and are turned into a theme with `createTheme` from `@oxy/tokens`, whose `vars` are applied inline on the subtree.

Tag a story with `no-visual` to keep it out of the screenshot suite (for example, stories that depend on timers or randomness).

## Visual regressions

`tools/storybook/visual` renders every story from `storybook-static/index.json` in four combinations, theme × direction, and compares each against a baseline in `tools/storybook/visual/__screenshots__`. Baselines are committed and rendered inside `mcr.microsoft.com/playwright:<version>-noble`, the same image the `visual-regression` job runs in, so fonts and Chromium match byte for byte. Run `bun run visual:update` (requires Docker) after an intentional visual change and commit the updated PNGs; bump the image tag in `.github/workflows/ci.yml` together with `@playwright/test`. The HTML report of a failed run is uploaded as the `visual-regression-report` artifact.

## CI checks

- **rac-coverage** compares the component exports of the installed `react-aria-components` with the exports of `@oxy/ui`. Contexts, hooks, layout classes and `UNSTABLE_*` exports are skipped automatically; deliberate exclusions (providers, `Collection`, `Virtualizer`, …) live in `tools/checks/rac-coverage.config.ts`. Until the component groups of stage 4 exist the job reports the missing list as a warning instead of failing: flip `enforce: true` in the config (or run with `--strict`) to make it red. The config also fails when an ignored name stops being exported or gets wrapped, so the exclusion list cannot go stale.
- **token-contrast** runs `checkContrast` from `@oxy/tokens` over the themes listed in `tools/checks/contrast.config.ts` (the default theme and `materialDarkTheme` today; add new themes there) and fails when any `on-X` / `X` pair is below WCAG AA (4.5:1).
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
- `@oxy/icons` renders Material Symbols from the variable font, so `icon.fill`, `icon.weight`, `icon.grade` and `icon.optical-size` tokens drive the `FILL`, `wght`, `GRAD` and `opsz` axes on any themed subtree. Every symbol is its own export (`arrowBack`, `_3dRotation`, `delete_`) carrying its codepoint, so bundles keep only the symbols they import. `bun run --cwd packages/icons generate` rebuilds `symbols.ts` from the `material-symbols` font; a test fails when it is stale.
- `materialSymbols()` from `@oxy/icons/vite` serves the full font in dev and, on build, emits a woff2 subset with only the codepoints left in the bundle; import `virtual:oxy/material-symbols.css` once for the `@font-face`. Rounded and sharp styles come from `materialSymbols({ style })` together with the `icon.font-family` token.
- `Icon` flips directional symbols (arrows, chevrons, back/forward, undo/redo, …) inside an RTL locale from React Aria's `I18nProvider`; `mirrorInRtl` overrides the per-symbol default.
- Styles are written with logical properties so RTL needs no separate theme.
- Cascade order is fixed with CSS layers: StyleX layers (`oxy.priority*`) hold component base styles and variants, `utilities` comes last so utility classes always win.
- Shared StyleX compiler options live in `stylex.config.ts`; `vp pack` compiles each package, and `tools/css` collects the CSS of all packages into one file.
