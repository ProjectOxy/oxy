const buttonSize = (
  height: string,
  paddingInline: string,
  gap: string,
  iconSize: string,
  squareRadius: string,
  pressedRadius: string,
  outlineWidth: string,
) => ({
  height,
  "padding-inline": paddingInline,
  gap,
  "icon-size": iconSize,
  "square-radius": squareRadius,
  "pressed-radius": pressedRadius,
  "outline-width": outlineWidth,
});

export const componentTokens = {
  "focus-ring": {
    width: "3px",
    offset: "2px",
    color: "{color.secondary}",
  },
  "touch-target": {
    size: "48px",
  },
  density: {
    step: "4px",
  },
  button: {
    xs: buttonSize("32px", "{space.md}", "{space.xs}", "20px", "{radius.md}", "{radius.sm}", "1px"),
    sm: buttonSize("40px", "{space.lg}", "{space.sm}", "20px", "{radius.md}", "{radius.sm}", "1px"),
    md: buttonSize("56px", "{space.xl}", "{space.sm}", "24px", "{radius.lg}", "{radius.md}", "1px"),
    lg: buttonSize(
      "96px",
      "{space.3xl}",
      "{space.md}",
      "32px",
      "{radius.xl}",
      "{radius.lg}",
      "2px",
    ),
    xl: buttonSize("136px", "64px", "{space.lg}", "40px", "{radius.xl}", "{radius.lg}", "3px"),
  },
  card: {
    padding: "{space.lg}",
    radius: "{radius.md}",
    elevation: "{elevation.level1}",
    "container-color": "{color.surface-container-low}",
  },
};
