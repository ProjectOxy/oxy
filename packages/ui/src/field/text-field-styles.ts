import { duration, easing } from "@oxy/motion/motion.stylex";
import { searchField, textField } from "@oxy/tokens/component.stylex";
import { color, state, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Part, Styles } from "../core/parts.ts";
import { densities } from "../styles/density.ts";
import { tones } from "../styles/tone.ts";
import { density, tone } from "../styles/vars.stylex.ts";
import { field, fieldMarker } from "./field.stylex.ts";
import type { FieldPartName, FieldParts } from "./parts.ts";

export const fieldVariantGroups = {
  tone: ["primary", "secondary", "tertiary", "error"],
  density: ["comfortable", "compact", "dense"],
} as const;

type Tone = (typeof fieldVariantGroups.tone)[number];
type Density = (typeof fieldVariantGroups.density)[number];
type FieldVariant = "filled" | "outlined" | "bar";

export interface TextFieldStyleState {
  isDisabled: boolean;
  isInvalid: boolean;
  isPopulated: boolean;
}

const hovered = ":not(:focus-within):hover";
const hasLeadingElement = ":has(> [role=group] > :first-child:not(input, textarea))";

const onSurface = color["--oxy-color-on-surface"];
const mixOnSurface = (amount: string) =>
  `color-mix(in srgb, ${onSurface} calc(${amount} * 100%), transparent)`;
const disabledContent = mixOnSurface(state["--oxy-state-disabled-content"]);
const disabledContainer = mixOnSurface(state["--oxy-state-disabled-container"]);
const hoverLayer = mixOnSurface(field.hoverOpacity);

const body = (property: "family" | "size" | "line-height" | "weight" | "tracking") =>
  typography[`--oxy-typography-body-large-${property}`];
const small = (property: "family" | "size" | "line-height" | "weight" | "tracking") =>
  typography[`--oxy-typography-body-small-${property}`];

const filledLabel = {
  [field.labelFloatCenter]: `calc(${textField["--oxy-text-field-label-inset"]} - ${density.offset} / 2 + ${small("line-height")} / 2)`,
  [field.labelShift]: { default: "0px", ":has(> label)": `calc(${small("line-height")} / 2)` },
};

const root = stylex.create({
  base: {
    position: "relative",
    display: "inline-flex",
    flexDirection: "column",
    verticalAlign: "top",
    minInlineSize: 0,
    [field.height]: `calc(${textField["--oxy-text-field-height"]} - ${density.offset})`,
    [field.paddingInline]: textField["--oxy-text-field-padding-inline"],
    [field.indicatorWidth]: {
      default: textField["--oxy-text-field-indicator-width"],
      ":focus-within": textField["--oxy-text-field-focus-indicator-width"],
    },
    [field.labelColor]: {
      default: color["--oxy-color-on-surface-variant"],
      [hovered]: onSurface,
      ":focus-within": tone.color,
    },
    [field.hoverOpacity]: { default: "0", ":hover": state["--oxy-state-hover"] },
    [field.contentColor]: onSurface,
    [field.supportingColor]: color["--oxy-color-on-surface-variant"],
    [field.labelOffset]: {
      default: "0px",
      [hasLeadingElement]: `calc(${textField["--oxy-text-field-icon-size"]} + ${textField["--oxy-text-field-gap"]})`,
    },
  },
  filled: {
    ...filledLabel,
    [field.startRadius]: textField["--oxy-text-field-radius"],
    [field.containerColor]: textField["--oxy-text-field-container-color"],
    [field.indicator]: {
      default: color["--oxy-color-on-surface-variant"],
      [hovered]: onSurface,
      ":focus-within": tone.color,
    },
    [field.containerShadow]: `inset 0 calc(-1 * ${field.indicatorWidth}) 0 0 ${field.indicator}`,
  },
  outlined: {
    [field.startRadius]: textField["--oxy-text-field-radius"],
    [field.endRadius]: textField["--oxy-text-field-radius"],
    [field.indicator]: {
      default: color["--oxy-color-outline"],
      [hovered]: onSurface,
      ":focus-within": tone.color,
    },
    [field.containerShadow]: `inset 0 0 0 ${field.indicatorWidth} ${field.indicator}`,
    [field.labelBackground]: color["--oxy-color-surface"],
  },
  bar: {
    ...filledLabel,
    [field.height]: `calc(${searchField["--oxy-search-field-height"]} - ${density.offset})`,
    [field.startRadius]: searchField["--oxy-search-field-radius"],
    [field.endRadius]: searchField["--oxy-search-field-radius"],
    [field.containerColor]: searchField["--oxy-search-field-container-color"],
  },
  invalid: {
    [tone.color]: color["--oxy-color-error"],
    [field.indicator]: {
      default: color["--oxy-color-error"],
      [hovered]: color["--oxy-color-on-error-container"],
      ":focus-within": color["--oxy-color-error"],
    },
    [field.labelColor]: {
      default: color["--oxy-color-error"],
      [hovered]: color["--oxy-color-on-error-container"],
      ":focus-within": color["--oxy-color-error"],
    },
    [field.supportingColor]: color["--oxy-color-error"],
  },
  disabled: {
    [field.indicator]: disabledContent,
    [field.labelColor]: disabledContent,
    [field.contentColor]: disabledContent,
    [field.supportingColor]: disabledContent,
    [field.hoverOpacity]: "0",
  },
  disabledFilled: {
    [field.containerColor]: mixOnSurface("0.04"),
  },
  disabledOutlined: {
    [field.indicator]: disabledContainer,
  },
  disabledBar: {
    [field.containerColor]: disabledContainer,
  },
});

const parts = stylex.create({
  label: {
    position: "absolute",
    zIndex: 1,
    insetInlineStart: `calc(${field.paddingInline} + ${field.labelOffset} - 4px)`,
    insetBlockStart: {
      default: `calc(${field.height} / 2)`,
      [stylex.when.ancestor(":focus-within", fieldMarker)]: field.labelFloatCenter,
      [stylex.when.ancestor(":has(:placeholder-shown)", fieldMarker)]: field.labelFloatCenter,
    },
    translate: "0 -50%",
    boxSizing: "border-box",
    maxInlineSize: `calc(100% - 2 * ${field.paddingInline} - ${field.labelOffset} + 8px)`,
    paddingInline: 4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    color: field.labelColor,
    backgroundColor: {
      default: "transparent",
      [stylex.when.ancestor(":focus-within", fieldMarker)]: field.labelBackground,
      [stylex.when.ancestor(":has(:placeholder-shown)", fieldMarker)]: field.labelBackground,
    },
    fontFamily: body("family"),
    fontWeight: body("weight"),
    fontSize: {
      default: body("size"),
      [stylex.when.ancestor(":focus-within", fieldMarker)]: small("size"),
      [stylex.when.ancestor(":has(:placeholder-shown)", fieldMarker)]: small("size"),
    },
    lineHeight: {
      default: body("line-height"),
      [stylex.when.ancestor(":focus-within", fieldMarker)]: small("line-height"),
      [stylex.when.ancestor(":has(:placeholder-shown)", fieldMarker)]: small("line-height"),
    },
    letterSpacing: {
      default: body("tracking"),
      [stylex.when.ancestor(":focus-within", fieldMarker)]: small("tracking"),
      [stylex.when.ancestor(":has(:placeholder-shown)", fieldMarker)]: small("tracking"),
    },
    transitionProperty: "inset-block-start, font-size, line-height, color",
    transitionDuration: `${duration.spatialFast}, ${duration.spatialFast}, ${duration.spatialFast}, ${duration.effectsFast}`,
    transitionTimingFunction: `${easing.spatialFast}, ${easing.spatialFast}, ${easing.spatialFast}, ${easing.effectsFast}`,
  },
  labelFloated: {
    insetBlockStart: field.labelFloatCenter,
    backgroundColor: field.labelBackground,
    fontSize: small("size"),
    lineHeight: small("line-height"),
    letterSpacing: small("tracking"),
  },
  container: {
    position: "relative",
    boxSizing: "border-box",
    minBlockSize: field.height,
    paddingInline: field.paddingInline,
    borderStyle: "none",
    borderStartStartRadius: field.startRadius,
    borderStartEndRadius: field.startRadius,
    borderEndStartRadius: field.endRadius,
    borderEndEndRadius: field.endRadius,
    backgroundColor: field.containerColor,
    backgroundImage: `linear-gradient(${hoverLayer}, ${hoverLayer})`,
    boxShadow: field.containerShadow,
    transitionProperty: "background-color, box-shadow",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  input: {
    appearance: "none",
    flexGrow: 1,
    minInlineSize: 0,
    boxSizing: "border-box",
    margin: 0,
    paddingBlockStart: `calc((${field.height} - ${body("line-height")}) / 2 + ${field.labelShift})`,
    paddingBlockEnd: `calc((${field.height} - ${body("line-height")}) / 2 - ${field.labelShift})`,
    paddingInline: 0,
    borderWidth: 0,
    outlineStyle: "none",
    backgroundColor: "transparent",
    color: field.contentColor,
    caretColor: tone.color,
    fontFamily: body("family"),
    fontSize: body("size"),
    lineHeight: body("line-height"),
    fontWeight: body("weight"),
    letterSpacing: body("tracking"),
    "::placeholder": { color: color["--oxy-color-on-surface-variant"], opacity: 1 },
  },
  searchInput: {
    "::-webkit-search-cancel-button": { appearance: "none" },
    "::-webkit-search-decoration": { appearance: "none" },
  },
  group: {
    display: "flex",
    alignItems: "center",
    gap: textField["--oxy-text-field-gap"],
    color: color["--oxy-color-on-surface-variant"],
    cursor: "text",
    "--oxy-icon-size": textField["--oxy-text-field-icon-size"],
  },
  supporting: {
    display: "block",
    paddingInline: field.paddingInline,
    marginBlockStart: textField["--oxy-text-field-supporting-gap"],
    color: field.supportingColor,
    fontFamily: small("family"),
    fontSize: small("size"),
    lineHeight: small("line-height"),
    fontWeight: small("weight"),
    letterSpacing: small("tracking"),
  },
  error: {
    color: color["--oxy-color-error"],
  },
});

const disabledVariant = {
  filled: root.disabledFilled,
  outlined: root.disabledOutlined,
  bar: root.disabledBar,
} as const;

export function textFieldStyles(
  variant: FieldVariant,
  toneName: Tone,
  densityName: Density,
  { isDisabled, isInvalid }: TextFieldStyleState,
): Styles {
  return [
    root.base,
    fieldMarker,
    tones[toneName],
    densities[densityName],
    root[variant],
    isInvalid && root.invalid,
    isDisabled && root.disabled,
    isDisabled && disabledVariant[variant],
  ];
}

export function textFieldParts(
  part: (name: FieldPartName, styles: Styles) => Part,
  { isPopulated }: TextFieldStyleState,
  inputStyles: Styles = parts.input,
): FieldParts {
  return {
    label: part("label", [parts.label, isPopulated && parts.labelFloated]),
    container: part("container", parts.container),
    input: part("input", inputStyles),
    description: part("description", parts.supporting),
    fieldError: part("fieldError", [parts.supporting, parts.error]),
  };
}

export const textFieldPartStyles = parts;

const standalone = stylex.create({
  outlined: {
    [field.startRadius]: textField["--oxy-text-field-radius"],
    [field.endRadius]: textField["--oxy-text-field-radius"],
    [field.contentColor]: onSurface,
    [field.indicator]: {
      default: color["--oxy-color-outline"],
      ":hover": onSurface,
      ":focus": tone.color,
      ":is([data-invalid])": color["--oxy-color-error"],
    },
    [field.indicatorWidth]: {
      default: textField["--oxy-text-field-indicator-width"],
      ":focus": textField["--oxy-text-field-focus-indicator-width"],
    },
    [field.containerShadow]: `inset 0 0 0 ${field.indicatorWidth} ${field.indicator}`,
  },
  disabled: {
    [field.contentColor]: disabledContent,
    [field.indicator]: disabledContainer,
  },
});

export const standaloneInputStyles = (isDisabled: boolean): Styles => [
  parts.input,
  parts.container,
  standalone.outlined,
  isDisabled && standalone.disabled,
];

export const mergeParts = (...merged: (Part | undefined)[]): Part => ({
  styles: merged.map((part) => part?.styles),
  className:
    merged
      .map((part) => part?.className)
      .filter(Boolean)
      .join(" ") || undefined,
});
