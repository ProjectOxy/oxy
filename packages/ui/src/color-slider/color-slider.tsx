import { colorSlider } from "@oxy/tokens/component.stylex";
import { space } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useContext, type Ref } from "react";
import {
  ColorSlider as AriaColorSlider,
  ColorSliderStateContext,
  composeRenderProps,
  SliderTrack as AriaSliderTrack,
  type ColorSliderProps as AriaColorSliderProps,
  type ColorSliderRenderProps,
} from "react-aria-components";
import { ColorThumbPartContext } from "../color-thumb/color-thumb.tsx";
import { resolveClassName } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants } from "../core/variants.ts";
import { FieldPartsContext } from "../field/parts.ts";
import {
  SliderStyleContext,
  sliderTrackVariants,
  sliderVariants,
  type SliderTrackProps,
} from "../slider/slider.tsx";
import { checkerboard } from "../styles/checkerboard.ts";
import { disabledColorControl } from "../styles/disabled.ts";

export const colorSliderVariants = defineVariants({}, {});

export type ColorSliderSlot = "label" | "output" | "track" | "thumb";

export interface ColorSliderProps
  extends
    Omit<AriaColorSliderProps, "className">,
    StyledProps<ColorSliderRenderProps, ColorSliderSlot> {
  ref?: Ref<HTMLDivElement>;
}

const trackHeight = colorSlider["--oxy-color-slider-track-height"];

const styles = stylex.create({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    columnGap: space["--oxy-space-md"],
    rowGap: space["--oxy-space-sm"],
    minInlineSize: 0,
    isolation: "isolate",
  },
  vertical: {
    display: "inline-grid",
    gridTemplateColumns: "auto",
    justifyItems: "center",
  },
  track: {
    position: "relative",
    gridColumn: "1 / -1",
    alignSelf: "stretch",
    blockSize: trackHeight,
    borderRadius: colorSlider["--oxy-color-slider-track-radius"],
  },
  trackVertical: {
    alignSelf: "auto",
    inlineSize: trackHeight,
    blockSize: colorSlider["--oxy-color-slider-vertical-length"],
  },
  thumb: {
    top: "50%",
  },
  thumbVertical: {
    left: "50%",
  },
});

function ColorSliderTrack({ className, unstyled, ...props }: SliderTrackProps) {
  const state = useContext(ColorSliderStateContext)!;
  const { classNames } = useContext(SliderStyleContext);
  const isVertical = state.orientation === "vertical";
  const styled = useStyled(
    { className, unstyled },
    {
      variants: sliderTrackVariants,
      styles: () => [styles.track, checkerboard.underlay, isVertical && styles.trackVertical],
      reset: [],
      part: { className: classNames.track },
    },
  );
  return <AriaSliderTrack {...props} className={styled.className} />;
}

export function ColorSlider({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: ColorSliderProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: colorSliderVariants,
      styles: (_, { orientation, isDisabled }) => [
        styles.root,
        orientation === "vertical" && styles.vertical,
        isDisabled && disabledColorControl.root,
      ],
      reset: [],
    },
  );

  return (
    <AriaColorSlider {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const thumb = styled.part("thumb", state, [
          state.orientation === "vertical" ? styles.thumbVertical : styles.thumb,
        ]);
        return (
          <UnstyledScope unstyled={unstyled}>
            <FieldPartsContext value={{ label: styled.part("label", state, []) }}>
              <SliderStyleContext
                value={{
                  variants: sliderVariants.defaults,
                  classNames: {
                    output: resolveClassName(classNames?.output, state),
                    track: resolveClassName(classNames?.track, state),
                  },
                  Track: ColorSliderTrack,
                }}
              >
                <ColorThumbPartContext value={thumb}>{children}</ColorThumbPartContext>
              </SliderStyleContext>
            </FieldPartsContext>
          </UnstyledScope>
        );
      })}
    </AriaColorSlider>
  );
}
