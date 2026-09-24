export type Modifiers = Record<string, string>;

export const stateModifiers: Modifiers = {
  hover: "&[data-hovered]",
  pressed: "&[data-pressed]",
  "focus-visible": "&[data-focus-visible]",
  selected: "&[data-selected]",
  disabled: "&[data-disabled]",
  invalid: "&[data-invalid]",
};

export const schemeModifiers: Modifiers = {
  dark: '@scope ([data-scheme="dark"]) to ([data-scheme="light"])',
  rtl: "&:dir(rtl)",
};

export const breakpoints: Record<string, string> = {
  medium: "600px",
  expanded: "840px",
  large: "1200px",
  "extra-large": "1600px",
};

export const breakpointModifiers = (widths: Record<string, string>): Modifiers =>
  Object.fromEntries(
    Object.entries(widths).map(([name, width]) => [name, `@media (width >= ${width})`]),
  );
