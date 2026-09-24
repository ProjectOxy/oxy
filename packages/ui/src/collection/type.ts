import { typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

type TypeRole =
  | "headline-large"
  | "title-large"
  | "body-large"
  | "body-medium"
  | "body-small"
  | "label-large"
  | "label-medium"
  | "label-small"
  | "title-medium"
  | "title-small";

const role = (name: TypeRole) => ({
  fontFamily: typography[`--oxy-typography-${name}-family`],
  fontSize: typography[`--oxy-typography-${name}-size`],
  lineHeight: typography[`--oxy-typography-${name}-line-height`],
  fontWeight: typography[`--oxy-typography-${name}-weight`],
  letterSpacing: typography[`--oxy-typography-${name}-tracking`],
});

export const typeScale = stylex.create({
  bodyLarge: role("body-large"),
  bodyMedium: role("body-medium"),
  bodySmall: role("body-small"),
  labelLarge: role("label-large"),
  labelMedium: role("label-medium"),
  labelSmall: role("label-small"),
  headlineLarge: role("headline-large"),
  titleLarge: role("title-large"),
  titleMedium: role("title-medium"),
  titleSmall: role("title-small"),
});
