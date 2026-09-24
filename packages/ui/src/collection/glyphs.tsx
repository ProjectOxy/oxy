import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  glyph: {
    display: "block",
    flexShrink: 0,
    inlineSize: "var(--oxy-icon-size, 24px)",
    blockSize: "var(--oxy-icon-size, 24px)",
    fill: "currentColor",
  },
  mirrored: {
    transform: { default: null, ":dir(rtl)": "scaleX(-1)" },
  },
});

const paths = {
  check: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  arrowDropDown: "m7 10 5 5 5-5z",
  arrowUpward: "M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z",
  chevronForward: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  expandMore: "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z",
  close:
    "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  remove: "M19 13H5v-2h14z",
  dragIndicator:
    "M9 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4m6 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4",
};

const mirroredGlyphs = new Set<Glyph>(["chevronForward"]);

export type Glyph = keyof typeof paths;

export function GlyphIcon({ glyph }: { glyph: Glyph }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      {...stylex.props(styles.glyph, mirroredGlyphs.has(glyph) && styles.mirrored)}
    >
      <path d={paths[glyph]} />
    </svg>
  );
}
