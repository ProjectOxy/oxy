# Oxy UI

React component library on top of [React Aria Components](https://react-spectrum.adobe.com/react-aria/), styled with [StyleX](https://stylexjs.com) to look like Material Design 3 Expressive out of the box and fully re-skinnable through tokens, variant classes, utilities, slots and an unstyled mode.

## Packages

| Package               | Purpose                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- |
| `@oxy/tokens`         | Primitive, semantic and component tokens, `createTheme`, build-time contrast check    |
| `@oxy/material-theme` | M3 Expressive theme from a seed color (`createMaterialTheme`) and a neutral base      |
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

The decorator wraps every story in `OxyProvider` from `@oxy/ui`; `tools/storybook/src/seed-theme.ts` turns the `seed` and `theme` globals into a theme with `createMaterialTheme` from `@oxy/material-theme`.

Tag a story with `no-visual` to keep it out of the screenshot suite (for example, stories that depend on timers or randomness).

### Token playground

**Foundations/Token playground** renders the whole library next to a theme editor. The panel changes the seed, scheme and contrast, and edits any token (raw values or `{references}`), with a color picker for color tokens. Every change rebuilds the theme and reaches every component at once. The preview lists one story per component from `packages/ui/src/*/*.stories.tsx` (`Trigger`, `Inline`, `Variants` or `Default`, whichever exists first), so a new component appears there without extra code. Export copies or downloads the result in one of two forms: options for `createMaterialTheme` (seed, scheme, contrast and the edited tokens as `overrides`), or overrides for `createTheme` (every token that differs from the defaults). The playground is tagged `no-visual`, because each component story already has its own screenshots.

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

## Components

Every `@oxy/ui` component wraps a React Aria component and keeps its whole API. On top it adds:

- **Variants in `className`.** `<Button className="tonal lg secondary square dense px-xl">`: names the component declares (variant, size, tone, shape, density) become StyleX styles, everything else stays in `className` as utility classes. `className` may also be a function of the React Aria render state; its result is parsed the same way.
- **Slots.** `classNames={{ stateLayer, touchTarget }}` styles the inner parts; each value is a string or a function of the render state. Compound components pass the slots of their React Aria children too: `<TextField classNames={{ label, container, input, description, fieldError }}>` styles the `Label`, `Input` or `Group`, `Text` and `FieldError` inside it.
- **Unstyled mode.** `unstyled` on a component or on `OxyProvider` drops the theme styles, keeps behaviour and a minimal reset, and passes `className` through untouched.
- **`OxyProvider`.** `theme` (a `createTheme` result) and `scheme` on any subtree, `locale` for React Aria `I18nProvider` plus `lang`/`dir`, `strings` to override the library's own strings (`useStrings`, plural forms through `Intl.PluralRules`) and `unstyled`. Overlays of the subtree render inside it, so they get its theme and direction.

### Selection and collections

- **`ListBox`, `GridList`, `Menu`, `TagGroup`** mirror the React Aria composition (`ListBoxItem`, `ListBoxSection` + `Header`, `GridListItem`, `MenuSection`, `SubmenuTrigger`, `TagList` + `Tag`). Items add `icon`, `description` and `trailing` props next to their children, and expose the `stateLayer`, `icon`, `label`, `description`, `trailing` and `indicator` slots. Lists take `standard`/`segmented` and a density; menus `standard`/`vibrant`.
- **`Menu`** renders its own popover when it sits in a `MenuTrigger` or `SubmenuTrigger` (`classNames.popover`, `placement`, `offset`) and renders in place anywhere else, for example inside `Autocomplete`.
- **`Select` and `ComboBox`** are M3 text fields (`filled`/`outlined`, tone, density) that own their parts: `label`, `description`, `errorMessage` and `items` are props, children render the options (`{(item) => <ListBoxItem>}`), and `classNames` reaches `label`, `trigger`/`field`, `value`, `input`, `indicator`, `description`, `fieldError`, `popover` and `listbox`. `SelectValue` and `ComboBoxValue` style the value inside hand-built React Aria compositions.
- **`Tag`** chips are `assist`, `filter`, `input` or `suggestion`, `flat` or `elevated`. The group picks the default from its behaviour (`onRemove` → input, a selection mode → filter, otherwise assist); a class on `TagGroup` sets it for every chip and a class on a `Tag` overrides it.
- `unstyled` on a collection or a field reaches its items and parts.

### Table and Tree

- **`Table`** keeps the React Aria composition (`TableHeader`, `Column`, `TableBody`, `Row`, `Cell`, `TableFooter`, `TableLoadMoreItem`) and takes `standard`/`outlined` and a density. `TableHeader` and `Row` add the drag handle and selection checkbox columns themselves when the table allows dragging or toggle selection (`classNames={{ selection, dragHandle }}`); sortable `Column`s show a `sortIndicator` slot. `ResizableTableContainer` with `ColumnResizer` resizes columns, a `treeColumn` renders expandable rows with a `chevron`, and React Aria's `Virtualizer` with `TableLayout` virtualizes rows.
- **`Tree`** items (`TreeItem` + `TreeItemContent`, `TreeSection` + `TreeHeader`, `TreeLoadMoreItem`) are M3 list items indented by level, with the `stateLayer`, `dragHandle`, `selection`, `chevron` and `content` slots set on the `TreeItem`. The chevron turns and new children slide in on expand.

### Color

- **`ColorArea`, `ColorSlider` and `ColorWheel`** keep the React Aria composition and share one `ColorThumb`: a 24px circle filled with the current color, with a `color-thumb.border-color` rim, an elevation shadow, the M3 focus ring, a 48px touch target, and growth to 32px on a spatial spring while it is dragged. The parent styles its thumb through `classNames.thumb`, which may be a function of the parent state. Disabled controls fade to `state.disabled-content` and lose their saturation.
- **`ColorArea`** is a square, `color-area.size` (256px) wide but never wider than its container, with `color-area.radius` corners.
- **`ColorSlider`** takes the same `Label`, `SliderOutput` and `SliderTrack` as `Slider` (`classNames` covers `label`, `output`, `track` and `thumb`). Inside a color slider, `SliderTrack` is a `color-slider.track-height` pill with the channel gradient and a checkerboard under transparent colors. Vertical sliders are `color-slider.vertical-length` tall.
- **`ColorWheel`** defaults `outerRadius` to 96 and `innerRadius` to 68 (a 192px ring) and keeps both as props; `ColorWheelTrack` takes the `track` slot.
- **`ColorSwatch`** is `xs`–`xl` (24–64px) and `round`/`square`, with a hairline `color-swatch.outline-color` edge and a checkerboard under transparent colors. `className` and `style` functions receive the `color`.
- **`ColorSwatchPicker`** sets the size and shape of every swatch in it (`sm round` by default) and follows `layout` (`grid` wraps, `stack` stacks). The selected swatch gets a `color-swatch.selected-ring-color` inner ring and items shrink while pressed; `classNames.item` and `classNames.swatch` are resolved against each item's state.
- **`ColorField`** is an M3 text field (`filled`/`outlined`, tone, density) for a hex value or one `channel`, with the `TextField` slots.
- **`ColorPicker`** is React Aria's, re-exported: it renders no element and keeps every color control inside it in sync.

### Navigation and structure

- **`Tabs`** keep the React Aria composition (`TabList`, `Tab`, `TabPanels`, `TabPanel`). `TabList` takes `primary`/`secondary` and `fixed`/`scrollable`; `Tab` adds an `icon` and the `stateLayer`, `content`, `icon` and `indicator` slots. The indicator is a React Aria `SelectionIndicator` that slides between tabs on a spatial spring; panels inside `TabPanels` switch with an M3 shared-axis transition that follows the direction of travel and the text direction. `SelectionIndicator` is also exported on its own.
- **`Disclosure`** is `plain`, `filled`, `outlined` or `segmented`; `DisclosureTitle` renders the heading with the trigger button and chevron, `DisclosurePanel` animates its height through React Aria's `--disclosure-panel-height`. `classNames` on the disclosure reaches `heading`, `trigger`, `stateLayer`, `indicator`, `panel` and `content`. A class on `DisclosureGroup` sets the variant of every disclosure in it (`segmented` by default: joined items with small inner corners, an open item rounds fully).
- **`Breadcrumbs`** style the `Link`s inside each `Breadcrumb` (slot `link`) and add a chevron `separator` that mirrors in RTL. **`Separator`** is an M3 divider: `full-width`, `inset` or `middle-inset`, horizontal or vertical, also as a collection separator in menus and lists.
- **M3 navigation** is built on `NavigationItem`, a React Aria `Link` with `icon`, `badge` (`true` for a dot) and the `touchTarget`, `indicator`, `stateLayer`, `focusRing`, `icon`, `badge` and `label` slots; mark the current destination with `aria-current="page"`. The container decides the item layout: `NavigationBar` (`adaptive` by default: stacked items in compact windows, side-by-side items from 600px; or `vertical`/`horizontal`), `NavigationRail` (`collapsed`/`expanded`), `NavigationDrawer` and `ModalNavigationDrawer` (React Aria `ModalOverlay` + `Dialog`, slides in from the inline start), with `NavigationSection` for headlines.
- **`AppBar`** is an M3 top app bar with `title`, `subtitle`, `leading` and `trailing`: `small`/`medium`/`large`, `start`/`center` and `scrolled` for the on-scroll container color.

### Dates and time

- **`Calendar` and `RangeCalendar`** render the M3 layout by default: a header with the month (`heading`) and the `previous`/`next` buttons, one `grid` per month of `visibleDuration`, and an `errorMessage` prop shown while invalid. They take a tone and a density; `classNames` reaches `header`, `heading`, `previous`, `next`, `months`, `grid`, `errorMessage` and `cell` (a function of the cell state). Selected days fill a circle in the tone color, today is outlined, a range bands the days between its ends. Passing children keeps the React Aria composition: `CalendarGrid` (default cells when it has no children), `CalendarGridHeader`, `CalendarHeaderCell`, `CalendarGridBody`, `CalendarCell` (with a `day` slot), `CalendarHeading`, and `CalendarMonthPicker`/`CalendarYearPicker`, which render an M3 `Select` unless given a render function.
- **`DateField`, `TimeField`, `DatePicker` and `DateRangePicker`** are M3 text fields like `Select`: `label`, `description` and `errorMessage` are props, the label stays floated over the segment placeholders, and `classNames` reaches `label`, `field`, `segment`, `description` and `fieldError`, plus `input`, `trigger`, `popover`, `dialog`, `calendar` (and `separator` for ranges) on the pickers. The pickers open a docked calendar that inherits their tone and density. `DateInput` and `DateSegment` style hand-built React Aria compositions. Calendars and formats follow the locale of the nearest `OxyProvider` (`fa-IR-u-ca-persian`, `ar-SA-u-ca-islamic-umalqura`, `th-TH-u-ca-buddhist`, …).

### Overlays

- **`Modal` and `ModalOverlay`** keep the React Aria composition with `DialogTrigger` and `Dialog`. `Modal` is the M3 dialog container: `basic` (default) is a centered `surface-container-high` card with a 28px radius, 280–560px wide; `fullscreen` fills compact windows and turns into a basic dialog from 600px. A `Modal` outside a `ModalOverlay` adds the scrim itself (slot `overlay`); both animate on `data-entering`/`data-exiting`.
- **`Dialog`** lays out the content with the dialog padding: `Heading slot="title"` (headline-small, the container picks the size), `Text`, `DialogHeader` for a close button + headline + action row and `DialogActions` for end-aligned buttons. `Button slot="close"` or **`CloseButton`** (an M3 icon button with a localized label) close it.
- **`Popover`** is a `surface-container` card with a 16px radius that scales from its trigger; **`OverlayArrow`** draws an arrow in the color of the overlay it sits in (slot `arrow`). **`PreviewTrigger`** opens a popover on hover, focus or long press.
- **`Tooltip`** is `plain` (inverse surface, body-small) or `rich` (surface-container card with a title-small `Heading`), 4px from the trigger; `TooltipTrigger` as in React Aria.
- **`Toast`** is an M3 snackbar on the React Aria toast queue: `ToastRegion` (bottom, full width in compact windows, centered from 600px), `ToastList`, `Toast`, `ToastContent`, `ToastAction` (an inverse-primary text button) and `ToastQueue`.
- **`BottomSheet`** and **`SideSheet`** are M3 modal sheets built on `ModalOverlay` + `Modal` + `Dialog`. The bottom sheet is anchored to the bottom edge (640px at most) and closes when its drag handle is tapped or dragged down far or fast enough, springing back otherwise (`@oxy/motion/gestures`); slots `scrim`, `handle`, `dialog`. The side sheet slides in at the inline end with an optional `headline` and close button; slots `scrim`, `dialog`, `header`, `closeButton`, `content`.

### Display

- **`Icon`** from `@oxy/icons` is re-exported as `@oxy/ui/icon`. Components size the icons inside them through `--oxy-icon-size` (buttons, FABs, avatars, navigation items, empty states), and the `icon.*` tokens set fill, weight, grade and optical size on any themed subtree.
- **`Card`** is `elevated` (default), `filled` or `outlined`, with the `card.*` tokens for padding, radius, elevation and container colors; `p-none` makes room for full-bleed media.
- **`Avatar`** shows `src` once it loads and its children (initials or an `Icon`) while loading or after an error; `data-status` and the `className` function carry `none`/`loading`/`loaded`/`error`. `xs`–`xl`, `round`/`square` and the four tones; slots `image` and `fallback`. With `alt` it is a labelled `img`.
- **`Badge`** is a 6px dot without a `value` and a 16px count with one, formatted for the locale and capped at `max` (`999+`). Children become the anchor: `<Badge value={3}><Icon icon={mail} /></Badge>` places the badge on the icon's top-end corner, mirrored in RTL (slot `anchor`). `error` by default, or any tone.
- **`Keyboard`** wraps React Aria's `<kbd>`: a `keycap` by default or `plain` text for menu shortcuts. Inside a `MenuItem` React Aria links it to the item as its keyboard shortcut.
- **`Skeleton`** is a `text` line (1em high, centered in the line), a `rect` or a `circle`, animated with `pulse` (default), `wave` (runs with the reading direction) or `still`. The cycle is `2 × motion.duration.extra-long4`, so it stops with `motion.enabled` and reduced motion. Children size the placeholder and stay hidden and inert.
- **`EmptyState`** takes `icon`, `headline` (a React Aria `Heading`, `headingLevel` 2 by default), `description` and actions as children; tones color the icon container, `start` aligns it to the reading direction. Mobile-first: an 88px icon container and `title-large` headline, 120px and `headline-small` from 600px.
- **`Divider`** is `Separator` under its M3 name.

[CONTRIBUTING.md](CONTRIBUTING.md) walks through wrapping a React Aria component, with `Button` as the reference.

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
- `@oxy/icons` renders Material Symbols from the variable font, so `icon.fill`, `icon.weight`, `icon.grade` and `icon.optical-size` tokens drive the `FILL`, `wght`, `GRAD` and `opsz` axes on any themed subtree. Every symbol is its own export (`arrowBack`, `_3dRotation`, `delete_`) carrying its codepoint, so bundles keep only the symbols they import. `bun run --cwd packages/icons generate` rebuilds `symbols.ts` from the `material-symbols` font; a test fails when it is stale.
- `materialSymbols()` from `@oxy/icons/vite` serves the full font in dev and, on build, emits a woff2 subset with only the codepoints left in the bundle; import `virtual:oxy/material-symbols.css` once for the `@font-face`. Rounded and sharp styles come from `materialSymbols({ style })` together with the `icon.font-family` token.
- `Icon` flips directional symbols (arrows, chevrons, back/forward, undo/redo, …) inside an RTL locale from React Aria's `I18nProvider`; `mirrorInRtl` overrides the per-symbol default.
- Styles are written with logical properties so RTL needs no separate theme.
- Cascade order is fixed with CSS layers: `oxy.components` (all StyleX output: component base styles, then variants) comes before `oxy.utilities`, so utility classes always win whatever the load order (see [Cascade order](#cascade-order)).
- Shared StyleX compiler options live in `stylex.config.ts`; `vp pack` compiles each package, and `tools/css` collects the CSS of all packages into one file.
