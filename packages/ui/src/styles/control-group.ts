import { color, space, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Part, Styles } from "../core/parts.ts";
import type { FieldParts } from "../field/parts.ts";

export const controlGroup = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  horizontal: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: space["--oxy-space-lg"],
  },
  label: {
    marginBlockEnd: space["--oxy-space-xs"],
  },
  fullRow: {
    flexBasis: "100%",
  },
  supporting: {
    marginBlockStart: space["--oxy-space-xs"],
    color: color["--oxy-color-on-surface-variant"],
    fontFamily: typography["--oxy-typography-body-small-family"],
    fontSize: typography["--oxy-typography-body-small-size"],
    lineHeight: typography["--oxy-typography-body-small-line-height"],
    fontWeight: typography["--oxy-typography-body-small-weight"],
    letterSpacing: typography["--oxy-typography-body-small-tracking"],
  },
  error: {
    color: color["--oxy-color-error"],
  },
});

export const controlGroupParts = (
  part: (name: "label" | "description" | "fieldError", styles: Styles) => Part,
  isHorizontal = false,
): FieldParts => ({
  label: part("label", [controlGroup.label, isHorizontal && controlGroup.fullRow]),
  description: part("description", [controlGroup.supporting, isHorizontal && controlGroup.fullRow]),
  fieldError: part("fieldError", [
    controlGroup.supporting,
    controlGroup.error,
    isHorizontal && controlGroup.fullRow,
  ]),
});
