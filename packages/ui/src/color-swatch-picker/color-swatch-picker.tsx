import { duration, easing } from "@oxy/motion/motion.stylex";
import { colorSwatch } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type ReactNode, type Ref } from "react";
import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  composeRenderProps,
  type ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
  type ColorSwatchPickerItemRenderProps,
  type ColorSwatchPickerProps as AriaColorSwatchPickerProps,
  type ColorSwatchPickerRenderProps,
} from "react-aria-components";
import { ColorSwatchPartContext } from "../color-swatch/color-swatch.tsx";
import { joinClassNames, resolveClassName, type SlotClassNames } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { focusRing, touchTarget } from "../styles/interaction.ts";
import { swatchPicker } from "./color-swatch-picker.stylex.ts";

export const colorSwatchPickerVariants = defineVariants(
  {
    size: ["xs", "sm", "md", "lg", "xl"],
    shape: ["round", "square"],
  },
  { size: "sm", shape: "round" },
);

export type ColorSwatchPickerVariants = VariantSelection<typeof colorSwatchPickerVariants.groups>;
export type ColorSwatchPickerSlot = "item" | "swatch";

export interface ColorSwatchPickerProps
  extends
    Omit<AriaColorSwatchPickerProps, "className">,
    Omit<StyledProps<ColorSwatchPickerRenderProps>, "classNames"> {
  classNames?: SlotClassNames<ColorSwatchPickerSlot, ColorSwatchPickerItemRenderProps>;
  ref?: Ref<HTMLDivElement>;
}

export interface ColorSwatchPickerItemProps
  extends
    Omit<AriaColorSwatchPickerItemProps, "className">,
    StyledProps<ColorSwatchPickerItemRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const ItemClassNamesContext = createContext<ColorSwatchPickerProps["classNames"]>({});

const ring = colorSwatch["--oxy-color-swatch-selected-ring-width"];
const spatial = `${duration.spatialFast} ${easing.spatialFast}`;
const effects = `${duration.effectsFast} ${easing.effectsFast}`;

const sizes = stylex.create({
  xs: { [swatchPicker.size]: colorSwatch["--oxy-color-swatch-xs-size"] },
  sm: { [swatchPicker.size]: colorSwatch["--oxy-color-swatch-sm-size"] },
  md: { [swatchPicker.size]: colorSwatch["--oxy-color-swatch-md-size"] },
  lg: { [swatchPicker.size]: colorSwatch["--oxy-color-swatch-lg-size"] },
  xl: { [swatchPicker.size]: colorSwatch["--oxy-color-swatch-xl-size"] },
});

const shapes = stylex.create({
  round: { [swatchPicker.radius]: "50%" },
  square: { [swatchPicker.radius]: colorSwatch["--oxy-color-swatch-square-radius"] },
});

const styles = stylex.create({
  root: {
    display: "flex",
    flexWrap: "wrap",
    gap: colorSwatch["--oxy-color-swatch-picker-gap"],
    outlineStyle: "none",
  },
  stack: {
    flexDirection: "column",
    flexWrap: "nowrap",
  },
  item: {
    position: "relative",
    display: "inline-flex",
    borderRadius: swatchPicker.radius,
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    transition: `scale ${spatial}`,
  },
  itemPressed: {
    scale: 0.9,
  },
  itemDisabled: {
    cursor: "default",
  },
  swatch: {
    inlineSize: swatchPicker.size,
    blockSize: swatchPicker.size,
    borderRadius: swatchPicker.radius,
    transition: `box-shadow ${effects}`,
  },
  swatchSelected: {
    boxShadow: `inset 0 0 0 ${ring} ${colorSwatch["--oxy-color-swatch-selected-ring-color"]}, inset 0 0 0 calc(2 * ${ring}) ${colorSwatch["--oxy-color-swatch-selected-gap-color"]}`,
  },
});

export function ColorSwatchPicker({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: ColorSwatchPickerProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: colorSwatchPickerVariants,
      styles: ({ size, shape }, { layout }) => [
        styles.root,
        layout === "stack" && styles.stack,
        sizes[size],
        shapes[shape],
      ],
      reset: [],
    },
  );

  return (
    <AriaColorSwatchPicker {...props} className={styled.className}>
      <UnstyledScope unstyled={unstyled}>
        <ItemClassNamesContext value={classNames}>{children}</ItemClassNamesContext>
      </UnstyledScope>
    </AriaColorSwatchPicker>
  );
}

export const colorSwatchPickerItemVariants = defineVariants({}, {});

export function ColorSwatchPickerItem({
  className,
  unstyled,
  children,
  ...props
}: ColorSwatchPickerItemProps) {
  const classNames = useContext(ItemClassNamesContext);
  const styled = useStyled(
    {
      className: (state) =>
        joinClassNames(
          resolveClassName(classNames?.item, state),
          resolveClassName(className, state),
        ),
      classNames,
      unstyled,
    },
    {
      variants: colorSwatchPickerItemVariants,
      styles: (_, { isPressed, isDisabled }) => [
        styles.item,
        focusRing.root,
        isPressed && styles.itemPressed,
        isDisabled && styles.itemDisabled,
      ],
      reset: [],
    },
  );

  return (
    <AriaColorSwatchPickerItem {...props} className={styled.className}>
      {composeRenderProps(children, (children: ReactNode, state) => (
        <UnstyledScope unstyled={styled.isUnstyled || undefined}>
          <ColorSwatchPartContext
            value={styled.part("swatch", state, [
              styles.swatch,
              state.isSelected && styles.swatchSelected,
            ])}
          >
            {!styled.isUnstyled && (
              <span data-slot="touch-target" {...stylex.props(touchTarget.root)} />
            )}
            {children}
          </ColorSwatchPartContext>
        </UnstyledScope>
      ))}
    </AriaColorSwatchPickerItem>
  );
}
