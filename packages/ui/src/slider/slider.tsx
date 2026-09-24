import { animateSpring } from "@oxy/motion/gestures";
import { duration, easing } from "@oxy/motion/motion.stylex";
import { slider } from "@oxy/tokens/component.stylex";
import { color, space, state, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { mergeRefs } from "react-aria/mergeRefs";
import {
  composeRenderProps,
  Slider as AriaSlider,
  SliderFill as AriaSliderFill,
  SliderOutput as AriaSliderOutput,
  SliderStateContext,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  useLocale,
  type SliderFillProps as AriaSliderFillProps,
  type SliderFillRenderProps,
  type SliderOutputProps as AriaSliderOutputProps,
  type SliderProps as AriaSliderProps,
  type SliderRenderProps,
  type SliderThumbProps as AriaSliderThumbProps,
  type SliderThumbRenderProps,
  type SliderTrackProps as AriaSliderTrackProps,
  type SliderTrackRenderProps,
} from "react-aria-components";
import { joinClassNames, resolveClassName } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { FieldPartsContext } from "../field/parts.ts";
import { focusRing, touchTarget } from "../styles/interaction.ts";
import { tones } from "../styles/tone.ts";
import { tone } from "../styles/vars.stylex.ts";
import { sliderSize } from "./slider.stylex.ts";

export const sliderVariants = defineVariants(
  {
    size: ["xs", "sm", "md", "lg", "xl"],
    tone: ["primary", "secondary", "tertiary", "error"],
    fill: ["standard", "centered"],
    stops: ["no-stops", "stops"],
    valueLabel: ["unlabeled", "labeled"],
  },
  { size: "xs", tone: "primary", fill: "standard", stops: "no-stops", valueLabel: "unlabeled" },
);

export type SliderVariants = VariantSelection<typeof sliderVariants.groups>;
export type SliderSlot =
  | "label"
  | "output"
  | "track"
  | "fill"
  | "thumb"
  | "stop"
  | "valueIndicator";

export interface SliderProps<T = number | number[]>
  extends Omit<AriaSliderProps<T>, "className">, StyledProps<SliderRenderProps, SliderSlot> {
  ref?: Ref<HTMLDivElement>;
}

export interface SliderTrackProps
  extends Omit<AriaSliderTrackProps, "className">, StyledProps<SliderTrackRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export interface SliderFillProps
  extends Omit<AriaSliderFillProps, "className">, StyledProps<SliderFillRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export interface SliderThumbProps
  extends Omit<AriaSliderThumbProps, "className">, StyledProps<SliderThumbRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export interface SliderOutputProps
  extends Omit<AriaSliderOutputProps, "className">, StyledProps<SliderRenderProps> {
  ref?: Ref<HTMLOutputElement>;
}

type SliderState = SliderRenderProps["state"];

interface SliderStyle {
  variants: SliderVariants;
  classNames: Partial<Record<SliderSlot, string>>;
  Track?: ComponentType<SliderTrackProps>;
}

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;
export const SliderStyleContext = createContext<SliderStyle>({
  variants: sliderVariants.defaults,
  classNames: {},
});

const gap = `calc(${slider["--oxy-slider-handle-width"]} / 2 + ${slider["--oxy-slider-handle-gap"]})`;
const innerRadius = slider["--oxy-slider-inner-radius"];
const gapRadius = `calc(${gap} + ${innerRadius}) ${innerRadius}`;
const gapRadiusVertical = `${innerRadius} calc(${gap} + ${innerRadius})`;
const disabledTrack = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} 12%, transparent)`;
const spatial = `${duration.spatialFast} ${easing.spatialFast}`;
const effects = `${duration.effectsFast} ${easing.effectsFast}`;

const sizes = stylex.create({
  xs: {
    [sliderSize.trackHeight]: slider["--oxy-slider-xs-track-height"],
    [sliderSize.handleHeight]: slider["--oxy-slider-xs-handle-height"],
    [sliderSize.trackRadius]: slider["--oxy-slider-xs-track-radius"],
  },
  sm: {
    [sliderSize.trackHeight]: slider["--oxy-slider-sm-track-height"],
    [sliderSize.handleHeight]: slider["--oxy-slider-sm-handle-height"],
    [sliderSize.trackRadius]: slider["--oxy-slider-sm-track-radius"],
  },
  md: {
    [sliderSize.trackHeight]: slider["--oxy-slider-md-track-height"],
    [sliderSize.handleHeight]: slider["--oxy-slider-md-handle-height"],
    [sliderSize.trackRadius]: slider["--oxy-slider-md-track-radius"],
  },
  lg: {
    [sliderSize.trackHeight]: slider["--oxy-slider-lg-track-height"],
    [sliderSize.handleHeight]: slider["--oxy-slider-lg-handle-height"],
    [sliderSize.trackRadius]: slider["--oxy-slider-lg-track-radius"],
  },
  xl: {
    [sliderSize.trackHeight]: slider["--oxy-slider-xl-track-height"],
    [sliderSize.handleHeight]: slider["--oxy-slider-xl-handle-height"],
    [sliderSize.trackRadius]: slider["--oxy-slider-xl-track-radius"],
  },
});

const styles = stylex.create({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    columnGap: space["--oxy-space-md"],
    rowGap: space["--oxy-space-sm"],
    minInlineSize: 0,
  },
  vertical: {
    display: "inline-grid",
    gridTemplateColumns: "auto",
    justifyItems: "center",
  },
  output: {
    justifySelf: "end",
    color: color["--oxy-color-on-surface-variant"],
    fontFamily: typography["--oxy-typography-label-large-family"],
    fontSize: typography["--oxy-typography-label-large-size"],
    lineHeight: typography["--oxy-typography-label-large-line-height"],
    fontWeight: typography["--oxy-typography-label-large-weight"],
    letterSpacing: typography["--oxy-typography-label-large-tracking"],
    fontVariantNumeric: "tabular-nums",
  },
  track: {
    position: "relative",
    gridColumn: "1 / -1",
    alignSelf: "stretch",
    blockSize: sliderSize.trackHeight,
    marginBlock: `calc((${sliderSize.handleHeight} - ${sliderSize.trackHeight}) / 2)`,
    touchAction: "none",
    "::before": {
      content: "''",
      position: "absolute",
      inset: 0,
      borderRadius: sliderSize.trackRadius,
      backgroundColor: color["--oxy-color-secondary-container"],
      maskComposite: "intersect",
    },
  },
  trackVertical: {
    alignSelf: "auto",
    inlineSize: sliderSize.trackHeight,
    blockSize: slider["--oxy-slider-vertical-length"],
    marginBlock: 0,
    marginInline: `calc((${sliderSize.handleHeight} - ${sliderSize.trackHeight}) / 2)`,
  },
  trackDisabled: {
    "::before": { backgroundColor: disabledTrack },
  },
  mask: (image: string) => ({
    "::before": { maskImage: image },
  }),
  fill: {
    boxSizing: "border-box",
    borderStyle: "solid",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: sliderSize.trackRadius,
    backgroundColor: tone.color,
    backgroundClip: "padding-box",
  },
  fillDisabled: {
    backgroundColor: disabledContent,
  },
  gapLeft: {
    borderLeftWidth: gap,
    borderTopLeftRadius: gapRadius,
    borderBottomLeftRadius: gapRadius,
  },
  gapRight: {
    borderRightWidth: gap,
    borderTopRightRadius: gapRadius,
    borderBottomRightRadius: gapRadius,
  },
  gapTop: {
    borderTopWidth: gap,
    borderTopLeftRadius: gapRadiusVertical,
    borderTopRightRadius: gapRadiusVertical,
  },
  gapBottom: {
    borderBottomWidth: gap,
    borderBottomLeftRadius: gapRadiusVertical,
    borderBottomRightRadius: gapRadiusVertical,
  },
  stop: {
    position: "absolute",
    inlineSize: slider["--oxy-slider-stop-size"],
    blockSize: slider["--oxy-slider-stop-size"],
    borderRadius: "50%",
    translate: "-50% -50%",
    backgroundColor: color["--oxy-color-on-secondary-container"],
    pointerEvents: "none",
  },
  stopActive: {
    backgroundColor: tone.onColor,
  },
  stopHorizontal: (position: string) => ({ left: position, top: "50%" }),
  stopVertical: (position: string) => ({ top: position, left: "50%" }),
  thumb: {
    zIndex: 1,
    top: "50%",
    boxSizing: "border-box",
    inlineSize: slider["--oxy-slider-handle-width"],
    blockSize: sliderSize.handleHeight,
    borderRadius: `calc(${slider["--oxy-slider-handle-width"]} / 2)`,
    backgroundColor: tone.color,
    cursor: "grab",
    transition: `inline-size ${spatial}, block-size ${spatial}`,
  },
  thumbVertical: {
    top: "auto",
    left: "50%",
    inlineSize: sliderSize.handleHeight,
    blockSize: slider["--oxy-slider-handle-width"],
  },
  thumbDragging: {
    inlineSize: `calc(${slider["--oxy-slider-handle-width"]} / 2)`,
    cursor: "grabbing",
  },
  thumbDraggingVertical: {
    inlineSize: sliderSize.handleHeight,
    blockSize: `calc(${slider["--oxy-slider-handle-width"]} / 2)`,
  },
  thumbDisabled: {
    backgroundColor: disabledContent,
    cursor: "default",
  },
  valueIndicator: {
    position: "absolute",
    bottom: `calc(100% + ${space["--oxy-space-xs"]})`,
    left: "50%",
    translate: "-50% 0",
    display: "grid",
    placeItems: "center",
    boxSizing: "border-box",
    minInlineSize: slider["--oxy-slider-value-indicator-height"],
    blockSize: slider["--oxy-slider-value-indicator-height"],
    paddingInline: space["--oxy-space-lg"],
    borderRadius: `calc(${slider["--oxy-slider-value-indicator-height"]} / 2)`,
    backgroundColor: color["--oxy-color-inverse-surface"],
    color: color["--oxy-color-inverse-on-surface"],
    fontFamily: typography["--oxy-typography-label-large-family"],
    fontSize: typography["--oxy-typography-label-large-size"],
    lineHeight: typography["--oxy-typography-label-large-line-height"],
    fontWeight: typography["--oxy-typography-label-large-weight"],
    letterSpacing: typography["--oxy-typography-label-large-tracking"],
    whiteSpace: "nowrap",
    pointerEvents: "none",
    opacity: 0,
    scale: 0.5,
    transformOrigin: "bottom",
    transition: `opacity ${effects}, scale ${spatial}`,
  },
  valueIndicatorVertical: {
    bottom: "auto",
    left: `calc(100% + ${space["--oxy-space-xs"]})`,
    top: "50%",
    translate: "0 -50%",
    transformOrigin: "left",
  },
  valueIndicatorShown: {
    opacity: 1,
    scale: 1,
  },
});

const thumbVar = (index: number) => `--oxy-slider-thumb-${index}`;

// React Aria places thumbs with physical `left`/`top`, mirrored for RTL locales and vertical
// sliders, so the track, fill and stops share that physical axis.
function useAxis(state: SliderState) {
  const { direction } = useLocale();
  const isVertical = state.orientation === "vertical";
  const isMirrored = isVertical || direction === "rtl";
  return {
    isVertical,
    position: (percent: number) => (isMirrored ? 100 - percent * 100 : percent * 100),
  };
}

const thumbPosition = (index: number, fallback: number) => `var(${thumbVar(index)}, ${fallback})`;

type StyleProp<State> =
  | CSSProperties
  | ((state: State & { defaultStyle: CSSProperties }) => CSSProperties | undefined)
  | undefined;

const composeStyle =
  <State,>(style: StyleProp<State>, own: CSSProperties | undefined) =>
  (state: State & { defaultStyle: CSSProperties }) => ({
    ...state.defaultStyle,
    ...own,
    ...(typeof style === "function" ? style(state) : style),
  });

function fillOffset(state: SliderState, variants: SliderVariants) {
  return variants.fill === "centered"
    ? (state.getThumbMinValue(0) + state.getThumbMaxValue(state.values.length - 1)) / 2
    : state.getThumbMinValue(0);
}

function useThumbSprings(state: SliderState, positions: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = state.values.some((_, index) => state.isThumbDragging(index));
  const key = positions.join(" ");

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const animations = positions.map((position, index) => {
      const name = thumbVar(index);
      const current = element.style.getPropertyValue(name);
      if (isDragging || current === "" || Number(current) === position) {
        element.style.setProperty(name, String(position));
        return undefined;
      }
      return animateSpring(element, { [name]: [Number(current), position] }, { speed: "fast" });
    });
    return () => {
      for (const animation of animations) animation?.stop();
    };
  }, [key, isDragging]);

  return ref;
}

export function Slider<T extends number | number[]>({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: SliderProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: sliderVariants,
      styles: ({ size, tone: toneName }, { orientation }) => [
        styles.root,
        orientation === "vertical" && styles.vertical,
        tones[toneName],
        sizes[size],
      ],
      reset: [],
    },
  );

  return (
    <AriaSlider {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const slot = (name: SliderSlot) => resolveClassName(classNames?.[name], state);
        return (
          <UnstyledScope unstyled={unstyled}>
            <FieldPartsContext value={{ label: styled.part("label", state, []) }}>
              <SliderStyleContext
                value={{
                  variants: styled.variants(state) ?? sliderVariants.defaults,
                  classNames: {
                    output: slot("output"),
                    track: slot("track"),
                    fill: slot("fill"),
                    thumb: slot("thumb"),
                    stop: slot("stop"),
                    valueIndicator: slot("valueIndicator"),
                  },
                }}
              >
                {children}
              </SliderStyleContext>
            </FieldPartsContext>
          </UnstyledScope>
        );
      })}
    </AriaSlider>
  );
}

export const sliderOutputVariants = defineVariants({}, {});

export function SliderOutput({ className, unstyled, ...props }: SliderOutputProps) {
  const { classNames } = useContext(SliderStyleContext);
  const styled = useStyled(
    { className, unstyled },
    {
      variants: sliderOutputVariants,
      styles: () => styles.output,
      reset: [],
      part: { className: classNames.output },
    },
  );
  return <AriaSliderOutput {...props} className={styled.className} />;
}

export const sliderTrackVariants = defineVariants({}, {});

export function SliderTrack(props: SliderTrackProps) {
  const { Track = StandardSliderTrack } = useContext(SliderStyleContext);
  return <Track {...props} />;
}

function StandardSliderTrack({
  className,
  unstyled,
  style,
  children,
  ref,
  ...props
}: SliderTrackProps) {
  const state = useContext(SliderStateContext)!;
  const { variants, classNames } = useContext(SliderStyleContext);
  const { isVertical, position } = useAxis(state);
  const positions = state.values.map((_, index) => position(state.getThumbPercent(index)));
  const springRef = useThumbSprings(state, positions);

  const edge = isVertical ? "to bottom" : "to right";
  const mask = styles.mask(
    positions
      .map((fallback, index) => {
        const at = `calc(${thumbPosition(index, fallback)} * 1%`;
        return `linear-gradient(${edge}, #000 ${at} - ${gap}), #0000 0 ${at} + ${gap}), #000 0)`;
      })
      .join(", "),
  );

  const styled = useStyled(
    { className, unstyled },
    {
      variants: sliderTrackVariants,
      styles: (_, { isDisabled }) => [
        styles.track,
        isVertical && styles.trackVertical,
        isDisabled && styles.trackDisabled,
        mask,
      ],
      reset: [],
      part: { className: classNames.track },
    },
  );

  const offset = fillOffset(state, variants);
  const [low, high] =
    state.values.length > 1
      ? [Math.min(...state.values), Math.max(...state.values)]
      : [Math.min(offset, state.values[0]!), Math.max(offset, state.values[0]!)];
  const min = state.getThumbMinValue(0);
  const stopCount = (state.getThumbMaxValue(state.values.length - 1) - min) / state.step + 1;
  const stops =
    !styled.isUnstyled && variants.stops === "stops" && stopCount <= 101
      ? Array.from({ length: Math.floor(stopCount) }, (_, index) => min + index * state.step)
      : [];

  return (
    <AriaSliderTrack
      {...props}
      ref={mergeRefs(ref, springRef)}
      className={styled.className}
      style={styled.isUnstyled ? style : composeStyle(style, stylex.props(mask).style)}
    >
      {composeRenderProps(children, (children: ReactNode) => (
        <>
          {children}
          {stops.map((value) => {
            const at = `${position(state.getValuePercent(value))}%`;
            const stop = stylex.props(
              styles.stop,
              value >= low && value <= high && styles.stopActive,
              isVertical ? styles.stopVertical(at) : styles.stopHorizontal(at),
            );
            return (
              <span
                key={value}
                aria-hidden
                data-slot="stop"
                {...stop}
                className={joinClassNames(stop.className, classNames.stop)}
              />
            );
          })}
        </>
      ))}
    </AriaSliderTrack>
  );
}

export const sliderFillVariants = defineVariants({}, {});

export function SliderFill({ className, unstyled, style, offset, ...props }: SliderFillProps) {
  const state = useContext(SliderStateContext)!;
  const { variants, classNames } = useContext(SliderStyleContext);
  const { isVertical, position } = useAxis(state);
  const fillOffsetValue = offset ?? fillOffset(state, variants);
  const last = state.values.length - 1;
  const isRange = last > 0;
  const end = position(state.getThumbPercent(last));
  const start = isRange
    ? position(state.getThumbPercent(0))
    : position(state.getValuePercent(fillOffsetValue));
  const endAt = thumbPosition(last, end);
  const startAt = isRange ? thumbPosition(0, start) : String(start);
  const lowIsThumb = isRange || end < start;
  const highIsThumb = isRange || end >= start;

  const styled = useStyled(
    { className, unstyled },
    {
      variants: sliderFillVariants,
      styles: (_, { isDisabled }) => [
        styles.fill,
        lowIsThumb && (isVertical ? styles.gapTop : styles.gapLeft),
        highIsThumb && (isVertical ? styles.gapBottom : styles.gapRight),
        isDisabled && styles.fillDisabled,
      ],
      reset: [],
      part: { className: classNames.fill },
    },
  );

  const lowEdge = `calc(min(${startAt}, ${endAt}) * 1%)`;
  const length = `calc((max(${startAt}, ${endAt}) - min(${startAt}, ${endAt})) * 1%)`;
  const placement: CSSProperties = isVertical
    ? { bottom: undefined, top: lowEdge, height: length }
    : { insetInlineStart: undefined, left: lowEdge, width: length };

  return (
    <AriaSliderFill
      {...props}
      offset={fillOffsetValue}
      className={styled.className}
      style={styled.isUnstyled ? style : composeStyle(style, placement)}
    />
  );
}

export const sliderThumbVariants = defineVariants({}, {});

export function SliderThumb({
  className,
  unstyled,
  style,
  children,
  index = 0,
  ...props
}: SliderThumbProps) {
  const state = useContext(SliderStateContext)!;
  const { variants, classNames } = useContext(SliderStyleContext);
  const { isVertical, position } = useAxis(state);
  const at = `calc(${thumbPosition(index, position(state.getThumbPercent(index)))} * 1%)`;

  const styled = useStyled(
    { className, unstyled },
    {
      variants: sliderThumbVariants,
      styles: (_, { isDragging, isDisabled }) => [
        styles.thumb,
        focusRing.root,
        isVertical && styles.thumbVertical,
        isDragging && (isVertical ? styles.thumbDraggingVertical : styles.thumbDragging),
        isDisabled && styles.thumbDisabled,
      ],
      reset: [],
      part: { className: classNames.thumb },
    },
  );

  return (
    <AriaSliderThumb
      {...props}
      index={index}
      className={styled.className}
      style={styled.isUnstyled ? style : composeStyle(style, { [isVertical ? "top" : "left"]: at })}
    >
      {composeRenderProps(children, (children: ReactNode, thumbState) => {
        if (styled.isUnstyled) return children;
        const indicator = stylex.props(
          styles.valueIndicator,
          isVertical && styles.valueIndicatorVertical,
          (thumbState.isDragging || thumbState.isFocusVisible) && styles.valueIndicatorShown,
        );
        return (
          <>
            <span data-slot="touch-target" {...stylex.props(touchTarget.root)} />
            {variants.valueLabel === "labeled" && (
              <span
                aria-hidden
                data-slot="value-indicator"
                className={joinClassNames(indicator.className, classNames.valueIndicator)}
              >
                {state.getThumbValueLabel(index)}
              </span>
            )}
            {children}
          </>
        );
      })}
    </AriaSliderThumb>
  );
}
