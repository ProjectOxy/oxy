# Oxy UI

React component library on top of [React Aria Components](https://react-spectrum.adobe.com/react-aria/), styled with [StyleX](https://stylexjs.com) to look like Material Design 3 Expressive out of the box and fully re-skinnable through tokens, variant classes, utilities, slots and an unstyled mode.

## Packages

| Package               | Purpose                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- |
| `@oxy/tokens`         | Primitive, semantic and component tokens (`stylex.defineVars`), theme generator types |
| `@oxy/material-theme` | Material Design 3 Expressive theme built on the tokens (`stylex.createTheme`)         |
| `@oxy/motion`         | Motion tokens and animation helpers                                                   |
| `@oxy/icons`          | Material Symbols icon component                                                       |
| `@oxy/utilities`      | Token-driven utility class layer                                                      |
| `@oxy/ui`             | Components and M3 compositions, one entry per component (`@oxy/ui/button`)            |

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
- Tokens are declared with `stylex.defineVars` in `*.stylex.ts` files and use explicit custom-property names (`--oxy-color-primary`), so variable names stay stable across package builds and downstream StyleX compilations.
- Components reference semantic and component tokens only; themes (`stylex.createTheme`) can be applied to any subtree.
- Styles are written with logical properties so RTL needs no separate theme.
- Cascade order is fixed with CSS layers: StyleX layers (`oxy.priority*`) hold component base styles and variants, `utilities` comes last so utility classes always win.
- Shared StyleX compiler options live in `stylex.config.ts`; `vp pack` compiles each package, and `tools/css` collects the CSS of all packages into one file.
