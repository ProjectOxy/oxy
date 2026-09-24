import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type Ref } from "react";
import {
  ColorWheel as AriaColorWheel,
  ColorWheelTrack as AriaColorWheelTrack,
  composeRenderProps,
  type ColorWheelProps as AriaColorWheelProps,
  type ColorWheelRenderProps,
  type ColorWheelTrackProps as AriaColorWheelTrackProps,
  type ColorWheelTrackRenderProps,
} from "react-aria-components";
import { ColorThumbPartContext } from "../color-thumb/color-thumb.tsx";
import type { Part } from "../core/parts.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants } from "../core/variants.ts";
import { disabledColorControl } from "../styles/disabled.ts";

export const colorWheelVariants = defineVariants({}, {});

export type ColorWheelSlot = "track" | "thumb";

export interface ColorWheelProps
  extends
    Omit<AriaColorWheelProps, "className" | "outerRadius" | "innerRadius">,
    StyledProps<ColorWheelRenderProps, ColorWheelSlot> {
  outerRadius?: number;
  innerRadius?: number;
  ref?: Ref<HTMLDivElement>;
}

export interface ColorWheelTrackProps
  extends Omit<AriaColorWheelTrackProps, "className">, StyledProps<ColorWheelTrackRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const TrackPartContext = createContext<Part | undefined>(undefined);

const styles = stylex.create({
  root: {
    flexShrink: 0,
    inlineSize: "fit-content",
  },
});

export function ColorWheel({
  className,
  classNames,
  unstyled,
  children,
  outerRadius = 96,
  innerRadius = 68,
  ...props
}: ColorWheelProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: colorWheelVariants,
      styles: (_, { isDisabled }) => [styles.root, isDisabled && disabledColorControl.root],
      reset: [],
    },
  );

  return (
    <AriaColorWheel
      {...props}
      outerRadius={outerRadius}
      innerRadius={innerRadius}
      className={styled.className}
    >
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <TrackPartContext value={styled.part("track", state, [])}>
            <ColorThumbPartContext value={styled.part("thumb", state, [])}>
              {children}
            </ColorThumbPartContext>
          </TrackPartContext>
        </UnstyledScope>
      ))}
    </AriaColorWheel>
  );
}

export const colorWheelTrackVariants = defineVariants({}, {});

export function ColorWheelTrack({ className, unstyled, ...props }: ColorWheelTrackProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: colorWheelTrackVariants,
      styles: () => [],
      reset: [],
      part: useContext(TrackPartContext),
    },
  );
  return <AriaColorWheelTrack {...props} className={styled.className} />;
}
