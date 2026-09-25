# Contributing

## Wrapping a React Aria component

Every `@oxy/ui` component follows the same recipe. `packages/ui/src/button` is the reference; copy its shape.

### 1. Files

```
packages/ui/src/<name>/
  <name>.tsx            component, variants and styles
  <name>.stylex.ts      local StyleX variables, only if the component needs them
  <name>.stories.tsx    Storybook stories
  index.ts              public exports of the entry point
```

Register the entry point in three places: `export * from "./<name>/index.ts"` in `src/index.ts`, and `"./<name>"` in both `exports` and `publishConfig.exports` of `packages/ui/package.json`.

### 2. Tokens

Components read only semantic tokens (`@oxy/tokens/semantic.stylex`) and component tokens (`@oxy/tokens/component.stylex`). Measurements that a theme may want to change (heights, paddings, radii per size) become component tokens in `packages/tokens/src/component.ts`; alias semantic tokens with `{space.lg}` where one fits. Run `bun run --cwd packages/tokens generate` afterwards.

Colors come from semantic roles. Toned components set the shared `tone` variables with `tones[tone]` from `src/styles/tone.ts` and read `tone.color`, `tone.onColor`, `tone.container` and `tone.onContainer`, so one set of variant styles serves every tone.

### 3. Variants

Declare the modifiers the component accepts in `className`:

```ts
export const buttonVariants = defineVariants(
  {
    variant: ["filled", "tonal", "outlined", "text", "elevated"],
    size: ["xs", "sm", "md", "lg", "xl"],
    tone: ["primary", "secondary", "tertiary", "error"],
    shape: ["round", "square"],
    density: ["comfortable", "compact", "dense"],
  },
  { variant: "filled", size: "sm", tone: "primary", shape: "round", density: "comfortable" },
);
```

- Use the M3 names. A name may belong to one group only (`defineVariants` throws otherwise), and it must not be the name of a utility class: variants are bare words (`tonal`), utilities always carry a prefix (`bg-…`, `px-…`).
- Defaults describe the M3 default look, so `<Button>` with no classes is an M3 filled button.
- Reuse the shared groups where they apply: tones (`primary`, `secondary`, `tertiary`, `error`), densities (`comfortable`, `compact`, `dense`) and sizes `xs`–`xl`.

### 4. Styles

All styles are StyleX, written with logical properties (`paddingInline`, `insetBlock`, `borderStartStartRadius`).

```ts
const styles = stylex.create({
  reset: { … },   // unstyled mode: remove UA chrome, keep behaviour and the native focus outline
  root: { … },    // base styles shared by every variant
  filled: { … },  // one style per variant name
  xs: { … },
  …
});

function buttonStyles(variants: ButtonVariants, state: ButtonRenderProps) {
  return [
    styles.root,
    focusRing.root,
    tones[variants.tone],
    densities[variants.density],
    styles[variants.size],
    styles[variants.shape],
    styles[variants.variant],
    state.isDisabled && styles.disabled,
  ];
}
```

- Order is priority. `stylex.props` lets the later style win per property, so the list goes base → shared styles → variants → state. Utility classes live in the later `oxy.utilities` cascade layer and beat all of it; never emulate a utility inside a component.
- State comes either from the render state passed to the style function or from React Aria data attributes as StyleX conditions (`":is([data-pressed])"`). Use the attribute when a CSS transition has to run between states, as with the shape morph on press.
- Motion uses `duration` and `easing` from `@oxy/motion/motion.stylex`: spatial springs for size and shape, effects springs for color and opacity. These already honour `prefers-reduced-motion` and the `motion.enabled` token.
- Shared building blocks live in `src/styles`: `focusRing` (mandatory M3 focus ring on `data-focus-visible`), `stateLayerStyles` (hover, focus and pressed overlays), `touchTarget` (48px minimum in comfortable density), `tones`, `densities`.
- Anything that looks like a common button builds on `src/button/styles.ts` (`buttonVariants`, `buttonStyles`) and `buttonLayers`, as `ToggleButton` does. A container that joins buttons (connected `ToggleButtonGroup`, `SplitButton`) provides its orientation through `ConnectedContext`; the buttons then swap their inner corners for the size's `inner-radius` and turn fully round while selected or expanded.

### 5. The component

```tsx
export interface ButtonProps
  extends Omit<AriaButtonProps, "className">, StyledProps<ButtonRenderProps, ButtonSlot> {
  ref?: Ref<HTMLButtonElement>;
}

export function Button({ className, classNames, unstyled, children, ...props }: ButtonProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: buttonVariants, styles: buttonStyles, reset: [styles.reset] },
  );

  return (
    <AriaButton {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const stateLayer = styled.slot("stateLayer", state, stateLayerStyles(state));
        return (
          <>
            {stateLayer !== undefined && (
              <span aria-hidden data-slot="state-layer" className={stateLayer} />
            )}
            {children}
          </>
        );
      })}
    </AriaButton>
  );
}
```

`useStyled` does the plumbing:

- `styled.className` is handed to React Aria as a render-prop function. It resolves the user's `className` (a string or a function of the render state), splits it into variants and the remaining utility classes, and returns the StyleX classes followed by the utilities. In unstyled mode it returns the reset plus the user's classes untouched.
- `styled.slot(name, state, styles)` returns the classes of an inner part: its StyleX styles plus `classNames[name]`, which may also be a function of the render state. In unstyled mode it returns only the user's classes, or `undefined` when there are none; render the part only when the result is defined.

Keep the React Aria API whole:

- Spread every other prop onto the React Aria component and accept `ref`. Do not rename or drop props, data attributes or render props.
- Pass `children` through `composeRenderProps` so function children keep working.
- Slot names are camelCase in `classNames` and kebab-case in `data-slot` on the element.
- Do not consume React Aria contexts yourself; the wrapped component already does, so slot contexts (`<ButtonContext value={{ slots: … }}>`) keep working.

### 6. Compound components

Fields, groups and sliders are compositions of React Aria parts (`<TextField><Label /><Input /><Text slot="description" /><FieldError /></TextField>`). The parent owns the look of its parts and hands it down through a context, so the composition API stays exactly React Aria's:

- The parent renders its children through `composeRenderProps` and wraps them in `FieldPartsContext` with `styled.part(slot, state, styles)` for each part (`label`, `container`, `input`, `description`, `fieldError`). A part carries the parent's StyleX styles plus its `classNames` slot, resolved against the parent's render state.
- The part component passes the context entry to `useStyled` as `part`. It is merged into the same `stylex.props` call after the part's own styles, so the parent wins per property and utilities still win over both.
- State the parent knows (focus within, invalid, disabled) reaches the parts as StyleX variables set on the parent (`src/field/field.stylex.ts`) or as `stylex.when.ancestor(…, fieldMarker)` conditions. Write `when` calls inline in `stylex.create`; the compiler does not follow them through constants.
- Wrap the children in `UnstyledScope` with the parent's `unstyled` prop, so an unstyled parent unstyles every part.
- `styled.variants(state)` returns the parsed modifiers for children that depend on them; `styled.slotProps(slot, state, styles)` returns `className` and `style` for inner elements with dynamic StyleX styles.
- A part used on its own falls back to its standalone look: an `Input` outside a field is an outlined M3 input.

### 7. Tests

Tests live in `packages/ui/tests`:

- **Unit** tests for any new non-trivial logic.
- **Integration** tests in jsdom (`<name>.test.tsx`), using Testing Library: the React Aria API still works (events, refs, render-prop children, slot contexts), variant classes are consumed and utility classes are kept, the `className` function receives the render state, slots accept static and state-driven classes, and unstyled mode, both as a prop and from `OxyProvider`.
- **Browser** tests in real Chromium (`<name>.browser.test.tsx`) for anything that depends on the cascade: computed sizes and colors per variant, a utility beating base and variant styles with either CSS file loaded first, focus ring, touch target, RTL layout. Wrap renders in an `OxyProvider` with `createTheme({ motion: { enabled: "0" } })` so transitions do not blur computed values.

Run `bun run test` (both environments) and `bun run check`.

### 8. Stories and visual baselines

Write a `Default` story plus one story per axis the component has (variants × tones, sizes × shapes, density, utilities overriding the base, slots, `className` function, unstyled, RTL). Every story is screenshotted in light/dark × LTR/RTL; regenerate baselines with `bun run visual:update`, which runs Playwright inside the same Docker image CI uses.

### Checklist

- [ ] Entry point exported from `src/index.ts` and `package.json` (`exports` and `publishConfig.exports`).
- [ ] Only semantic and component tokens; new measurements added as component tokens.
- [ ] Variants declared with `defineVariants`, M3 defaults.
- [ ] Logical properties only; motion from `@oxy/motion`.
- [ ] Focus ring and, for interactive parts, state layer and touch target.
- [ ] Full React Aria API: props, `ref`, render props, data attributes, slot contexts.
- [ ] Unit, integration and browser tests; stories; visual baselines updated.
- [ ] A changeset (`bun run changeset`) describing the change for the `@oxy/ui` changelog; raise the size budgets in `tools/checks/.size-limit.ts` in the same PR if the component grows past them.
