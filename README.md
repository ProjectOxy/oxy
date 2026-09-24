# Oxy UI

React component library on top of [React Aria Components](https://react-spectrum.adobe.com/react-aria/), styled with [StyleX](https://stylexjs.com) to look like Material Design 3 Expressive out of the box and fully re-skinnable through tokens, variant classes, utilities, slots and an unstyled mode.

## Packages

| Package               | Purpose                                                                            |
| --------------------- | ---------------------------------------------------------------------------------- |
| `@oxy/tokens`         | Primitive, semantic and component tokens, `createTheme`, build-time contrast check |
| `@oxy/material-theme` | Material Design 3 Expressive theme built on the tokens (`createTheme`)             |
| `@oxy/motion`         | Motion helpers for StyleX, spring → `linear()`, Motion gestures (`/gestures`)      |
| `@oxy/icons`          | Material Symbols icon component                                                    |
| `@oxy/utilities`      | Token-driven utility class layer                                                   |
| `@oxy/ui`             | Components and M3 compositions, one entry per component (`@oxy/ui/button`)         |

`tools/css` is a private workspace that compiles the StyleX output of every package into a single static file, `dist/oxy.css`.

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
bun run ready        # everything CI runs, in order
```

Inside a package, `vp pack` builds it and `vp pack --watch` rebuilds on change.

## Architecture notes

- ESM only. Every package sets `sideEffects: false` and exposes one export per component so consumers tree-shake at the component level.
- `exports` maps point to source files while developing (`devExports`); `publishConfig.exports` swaps them to `dist` on publish. `vp pack` keeps both in sync.
- Tokens have one typed source in `packages/tokens/src`: `primitives.ts` (palettes, scales), `semantic.ts` and `component.ts`. Values may alias other semantic or component tokens with `{color.primary}`, which becomes `var(--oxy-color-primary)`.
- `bun run --cwd packages/tokens generate` writes `semantic.stylex.ts` and `component.stylex.ts` (`stylex.defineVars` with explicit names like `--oxy-color-primary`, stable across builds). A test fails when they are stale, and the build fails when an `on-X` / `X` color pair is below WCAG AA.
- Components import only `@oxy/tokens/semantic.stylex` and `@oxy/tokens/component.stylex`; primitives are plain values in `@oxy/tokens/primitives` for theme authors and never become CSS variables.
- `createTheme(overrides, base?)` returns `vars` to set as inline style on any subtree. It re-declares every token aliasing an override, so component tokens follow the theme, and nested themes inherit what they do not override.
- Motion tokens (`motion.duration.*`, `motion.easing.*`, `motion.spring.*`, `motion.enabled`) live in `@oxy/tokens`. `bun run --cwd packages/motion generate` writes `motion.stylex.ts`: `duration` and `easing` consts for StyleX, springs converted to CSS `linear()` easings, and `--oxy-motion-allowed`, which drops to `0` under `prefers-reduced-motion`. Every `duration` const is multiplied by `--oxy-motion-enabled` and `--oxy-motion-allowed`, so `createTheme({ motion: { enabled: "0" } })` or the user's reduced-motion setting turns motion off on any subtree. Themes that override springs add `springVars(theme.tokens.motion.spring)` to their vars.
- `presence.fade`, `presence.scale` and `presence.slide` animate React Aria `data-entering` / `data-exiting`. Motion is an optional peer used only by `@oxy/motion/gestures` (`springTransition`, `animateSpring`) for gesture physics, so it never reaches bundles that skip that entry point.
- Styles are written with logical properties so RTL needs no separate theme.
- Cascade order is fixed with CSS layers: StyleX layers (`oxy.priority*`) hold component base styles and variants, `utilities` comes last so utility classes always win.
- Shared StyleX compiler options live in `stylex.config.ts`; `vp pack` compiles each package, and `tools/css` collects the CSS of all packages into one file.
