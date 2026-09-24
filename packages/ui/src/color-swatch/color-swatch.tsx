import { colorSwatch } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type Ref } from "react";
import {
  ColorSwatch as AriaColorSwatch,
  type ColorSwatchProps as AriaColorSwatchProps,
  type ColorSwatchRenderProps,
} from "react-aria-components";
import type { Part } from "../core/parts.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { checkerboard } from "../styles/checkerboard.ts";

export const colorSwatchVariants = defineVariants(
  {
    size: ["xs", "sm", "md", "lg", "xl"],
    shape: ["round", "square"],
  },
  { size: "sm", shape: "round" },
);

export type ColorSwatchVariants = VariantSelection<typeof colorSwatchVariants.groups>;

export interface ColorSwatchProps
  extends Omit<AriaColorSwatchProps, "className">, StyledProps<ColorSwatchRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export const ColorSwatchPartContext = createContext<Part | undefined>(undefined);

const outline = `inset 0 0 0 ${colorSwatch["--oxy-color-swatch-outline-width"]} ${colorSwatch["--oxy-color-swatch-outline-color"]}`;

const colorSwatchSizes = stylex.create({
  xs: {
    inlineSize: colorSwatch["--oxy-color-swatch-xs-size"],
    blockSize: colorSwatch["--oxy-color-swatch-xs-size"],
  },
  sm: {
    inlineSize: colorSwatch["--oxy-color-swatch-sm-size"],
    blockSize: colorSwatch["--oxy-color-swatch-sm-size"],
  },
  md: {
    inlineSize: colorSwatch["--oxy-color-swatch-md-size"],
    blockSize: colorSwatch["--oxy-color-swatch-md-size"],
  },
  lg: {
    inlineSize: colorSwatch["--oxy-color-swatch-lg-size"],
    blockSize: colorSwatch["--oxy-color-swatch-lg-size"],
  },
  xl: {
    inlineSize: colorSwatch["--oxy-color-swatch-xl-size"],
    blockSize: colorSwatch["--oxy-color-swatch-xl-size"],
  },
});

const colorSwatchShapes = stylex.create({
  round: { borderRadius: "50%" },
  square: { borderRadius: colorSwatch["--oxy-color-swatch-square-radius"] },
});

const styles = stylex.create({
  root: {
    display: "inline-block",
    flexShrink: 0,
    boxSizing: "border-box",
    verticalAlign: "middle",
    boxShadow: outline,
  },
});

export function ColorSwatch({ className, unstyled, style, ...props }: ColorSwatchProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: colorSwatchVariants,
      styles: ({ size, shape }) => [
        styles.root,
        checkerboard.fill,
        colorSwatchSizes[size],
        colorSwatchShapes[shape],
      ],
      reset: [],
      part: useContext(ColorSwatchPartContext),
    },
  );

  return (
    <AriaColorSwatch
      {...props}
      className={styled.className}
      style={
        styled.isUnstyled
          ? style
          : (state) => ({
              ...state.defaultStyle,
              color: state.color.toString("css"),
              ...(typeof style === "function" ? style(state) : style),
            })
      }
    />
  );
}
