import { isMotionEnabled, springVar } from "@oxy/motion";
import { duration, easing } from "@oxy/motion/motion.stylex";
import { progress } from "@oxy/tokens/component.stylex";
import { color, space } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import type { Styles } from "../core/parts.ts";
import { tone } from "../styles/vars.stylex.ts";

export type IndicatorSlot = "indicator" | "track" | "activeIndicator";

export interface SlotProps {
  className?: string;
  style?: CSSProperties;
}

export interface IndicatorProps {
  variant: "linear" | "circular" | "loading";
  isWavy: boolean;
  isContained: boolean;
  percentage: number | undefined;
  slot: (name: IndicatorSlot, styles: Styles) => SlotProps | undefined;
}

const thickness = progress["--oxy-progress-track-height"];
const amplitude = progress["--oxy-progress-wave-amplitude"];
const waveTile =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 10' preserveAspectRatio='none'%3E%3Cpath d='M-20 5Q-10 11 0 5T20 5T40 5T60 5' fill='none' stroke='%23000' stroke-width='4'/%3E%3C/svg%3E\")";

const travel = stylex.keyframes({
  "0%": { insetInlineStart: "0%", inlineSize: "0%" },
  "50%": { insetInlineStart: "25%", inlineSize: "50%" },
  "100%": { insetInlineStart: "100%", inlineSize: "0%" },
});

const wave = stylex.keyframes({
  from: { maskPosition: "0 0" },
  to: { maskPosition: `${progress["--oxy-progress-wave-length"]} 0` },
});

const spin = stylex.keyframes({
  from: { rotate: "0deg" },
  to: { rotate: "360deg" },
});

const arc = stylex.keyframes({
  "0%": { strokeDasharray: "1 100", strokeDashoffset: 0 },
  "50%": { strokeDasharray: "70 100", strokeDashoffset: -15 },
  "100%": { strokeDasharray: "1 100", strokeDashoffset: -99 },
});

const styles = stylex.create({
  linear: {
    position: "relative",
    display: "block",
    gridColumn: "1 / -1",
    blockSize: thickness,
    "::after": {
      content: "''",
      position: "absolute",
      insetInlineEnd: 0,
      insetBlockStart: "50%",
      translate: "0 -50%",
      inlineSize: progress["--oxy-progress-stop-size"],
      blockSize: progress["--oxy-progress-stop-size"],
      borderRadius: "50%",
      backgroundColor: tone.color,
    },
  },
  linearWavy: {
    blockSize: `calc(${thickness} + 2 * ${amplitude})`,
  },
  linearIndeterminate: {
    "::after": { content: "none" },
  },
  linearTrack: {
    position: "absolute",
    insetInlineEnd: 0,
    insetBlockStart: "50%",
    translate: "0 -50%",
    blockSize: thickness,
    borderRadius: `calc(${thickness} / 2)`,
    backgroundColor: color["--oxy-color-secondary-container"],
    transition: `inset-inline-start ${duration.spatialDefault} ${easing.spatialDefault}`,
  },
  trackFrom: (start: string) => ({ insetInlineStart: start }),
  linearActive: {
    position: "absolute",
    insetBlock: 0,
    insetInlineStart: 0,
    borderRadius: `calc(${thickness} / 2)`,
    backgroundColor: tone.color,
    transition: `inline-size ${duration.spatialDefault} ${easing.spatialDefault}`,
  },
  flatActive: {
    insetBlock: "auto",
    insetBlockStart: "50%",
    translate: "0 -50%",
    blockSize: thickness,
  },
  wavyActive: {
    borderRadius: 0,
    maskImage: waveTile,
    maskSize: `${progress["--oxy-progress-wave-length"]} 100%`,
    maskRepeat: "repeat-x",
    animationName: wave,
    animationDuration: duration.extraLong4,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  activeSize: (size: string) => ({ inlineSize: size }),
  traveling: {
    insetInlineStart: "25%",
    inlineSize: "50%",
    animationName: travel,
    animationDuration: `calc(2 * ${duration.extraLong4})`,
    animationTimingFunction: easing.standard,
    animationIterationCount: "infinite",
  },
  travelingWavy: {
    animationName: `${travel}, ${wave}`,
    animationDuration: `calc(2 * ${duration.extraLong4}), ${duration.extraLong4}`,
    animationTimingFunction: `${easing.standard}, linear`,
  },
  lagging: {
    inlineSize: 0,
    animationDelay: duration.extraLong4,
  },
  circular: {
    display: "block",
    inlineSize: progress["--oxy-progress-circular-size"],
    blockSize: progress["--oxy-progress-circular-size"],
    rotate: "-90deg",
    fill: "none",
    strokeWidth: progress["--oxy-progress-circular-track-width"],
    strokeLinecap: "round",
  },
  circularSpinning: {
    animationName: spin,
    animationDuration: `calc(1.5 * ${duration.extraLong4})`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  circularTrack: {
    stroke: color["--oxy-color-secondary-container"],
    transition: `stroke-dasharray ${duration.spatialDefault} ${easing.spatialDefault}, stroke-dashoffset ${duration.spatialDefault} ${easing.spatialDefault}`,
  },
  circularActive: {
    stroke: tone.color,
    transition: `stroke-dasharray ${duration.spatialDefault} ${easing.spatialDefault}`,
  },
  arc: {
    strokeDasharray: "25 100",
    animationName: arc,
    animationDuration: `calc(1.5 * ${duration.extraLong4})`,
    animationTimingFunction: easing.standard,
    animationIterationCount: "infinite",
  },
  dash: (array: string, offset: string) => ({ strokeDasharray: array, strokeDashoffset: offset }),
  loading: {
    position: "relative",
    display: "grid",
    placeItems: "center",
    inlineSize: progress["--oxy-progress-loading-size"],
    blockSize: progress["--oxy-progress-loading-size"],
    borderRadius: "50%",
    color: tone.color,
  },
  loadingContained: {
    backgroundColor: tone.container,
    color: tone.onContainer,
  },
  loadingShape: {
    inlineSize: progress["--oxy-progress-loading-indicator-size"],
    blockSize: progress["--oxy-progress-loading-indicator-size"],
    backgroundColor: "currentColor",
    animationName: spin,
    animationDuration: `calc(4.55 * ${duration.extraLong4})`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
});

export const progressStyles = stylex.create({
  linear: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    columnGap: space["--oxy-space-md"],
    rowGap: space["--oxy-space-xs"],
    minInlineSize: 0,
  },
  round: {
    display: "inline-flex",
    alignItems: "center",
    gap: space["--oxy-space-md"],
    verticalAlign: "middle",
  },
});

const circleSize = 40;
const circleRadius = 18;
const wavyRadius = 16;
const waveCount = 9;
const arcGap = 7;

const wavyCircle = (() => {
  const steps = 180;
  const point = (step: number) => {
    const angle = (step / steps) * 2 * Math.PI;
    const radius = wavyRadius + 1.5 * Math.sin(waveCount * angle);
    const x = circleSize / 2 + radius * Math.cos(angle);
    const y = circleSize / 2 + radius * Math.sin(angle);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  };
  return `M${Array.from({ length: steps }, (_, step) => point(step)).join("L")}Z`;
})();

const shapePoints = 48;

function shape(radius: (angle: number) => number) {
  const angles = Array.from(
    { length: shapePoints },
    (_, index) => (index / shapePoints) * 2 * Math.PI,
  );
  const radii = angles.map(radius);
  const scale = 50 / Math.max(...radii);
  const points = angles.map((angle, index) => {
    const x = 50 + radii[index]! * scale * Math.cos(angle);
    const y = 50 + radii[index]! * scale * Math.sin(angle);
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
  });
  return `polygon(${points.join(", ")})`;
}

const scallop = (lobes: number, depth: number) => (angle: number) =>
  1 - depth + depth * Math.cos(lobes * angle);

const roundedPolygon = (sides: number, rounding: number) => (angle: number) => {
  const sector = (2 * Math.PI) / sides;
  const offset = ((((angle + Math.PI / 2) % sector) + sector) % sector) - sector / 2;
  const flat = Math.cos(Math.PI / sides) / Math.cos(offset);
  return flat * (1 - rounding) + rounding;
};

const ellipse = (ratio: number, tilt: number) => (angle: number) =>
  ratio / Math.hypot(ratio * Math.cos(angle - tilt), Math.sin(angle - tilt));

const loadingShapes = [
  shape(scallop(10, 0.12)),
  shape(scallop(9, 0.08)),
  shape(roundedPolygon(5, 0.3)),
  shape(ellipse(0.6, Math.PI / 4)),
  shape(scallop(8, 0.06)),
  shape(scallop(4, 0.14)),
  shape(ellipse(0.78, -Math.PI / 4)),
];

function useShapeMorph() {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.clipPath = loadingShapes[0]!;
    if (!element.animate || !isMotionEnabled(element)) return;
    const easingCurve = getComputedStyle(element)
      .getPropertyValue(springVar("spatial", "slow", "easing"))
      .trim();
    const animation = element.animate(
      [...loadingShapes, loadingShapes[0]].map((clipPath) => ({
        clipPath,
        easing: easingCurve || "ease-in-out",
      })),
      { duration: 650 * loadingShapes.length, iterations: Infinity },
    );
    return () => animation.cancel();
  }, []);

  return ref;
}

function LoadingIndicator({ isContained, slot }: Pick<IndicatorProps, "isContained" | "slot">) {
  const ref = useShapeMorph();
  const indicator = slot("indicator", [styles.loading, isContained && styles.loadingContained]);
  const active = slot("activeIndicator", styles.loadingShape);
  if (indicator === undefined) return null;
  return (
    <span aria-hidden data-slot="indicator" {...indicator}>
      {active !== undefined && <span ref={ref} data-slot="active-indicator" {...active} />}
    </span>
  );
}

function CircularIndicator({
  isWavy,
  percentage,
  slot,
}: Omit<IndicatorProps, "variant" | "isContained">) {
  const isIndeterminate = percentage === undefined;
  const indicator = slot("indicator", [
    styles.circular,
    isIndeterminate && styles.circularSpinning,
  ]);
  const track = isIndeterminate
    ? undefined
    : slot("track", [
        styles.circularTrack,
        styles.dash(
          `${Math.max(0, 100 - percentage - 2 * arcGap)} 100`,
          `${-(percentage + arcGap)}`,
        ),
      ]);
  const active = slot("activeIndicator", [
    styles.circularActive,
    isIndeterminate ? styles.arc : styles.dash(`${percentage} 100`, "0"),
  ]);
  const center = circleSize / 2;
  if (indicator === undefined) return null;

  return (
    <svg
      aria-hidden
      data-slot="indicator"
      {...indicator}
      viewBox={`0 0 ${circleSize} ${circleSize}`}
    >
      {track !== undefined && (
        <circle
          data-slot="track"
          {...track}
          cx={center}
          cy={center}
          r={circleRadius}
          pathLength={100}
        />
      )}
      {active !== undefined &&
        (isWavy ? (
          <path data-slot="active-indicator" {...active} d={wavyCircle} pathLength={100} />
        ) : (
          <circle
            data-slot="active-indicator"
            {...active}
            cx={center}
            cy={center}
            r={circleRadius}
            pathLength={100}
          />
        ))}
    </svg>
  );
}

function LinearIndicator({
  isWavy,
  percentage,
  slot,
}: Omit<IndicatorProps, "variant" | "isContained">) {
  const isIndeterminate = percentage === undefined;
  const indicator = slot("indicator", [
    styles.linear,
    isWavy && styles.linearWavy,
    isIndeterminate && styles.linearIndeterminate,
  ]);
  const gap = progress["--oxy-progress-gap"];
  const track = slot("track", [
    styles.linearTrack,
    styles.trackFrom(percentage ? `calc(${percentage}% + ${gap})` : "0%"),
  ]);
  const activeBase = [styles.linearActive, isWavy ? styles.wavyActive : styles.flatActive];
  const actives = isIndeterminate
    ? [
        slot("activeIndicator", [
          activeBase,
          isWavy ? [styles.traveling, styles.travelingWavy] : styles.traveling,
        ]),
        slot("activeIndicator", [
          activeBase,
          isWavy ? [styles.traveling, styles.travelingWavy] : styles.traveling,
          styles.lagging,
        ]),
      ]
    : [slot("activeIndicator", [activeBase, styles.activeSize(`${percentage}%`)])];
  if (indicator === undefined) return null;

  return (
    <span aria-hidden data-slot="indicator" {...indicator}>
      {track !== undefined && <span data-slot="track" {...track} />}
      {actives.map(
        (active, index) =>
          active !== undefined && <span key={index} data-slot="active-indicator" {...active} />,
      )}
    </span>
  );
}

export function ProgressIndicator({ variant, isContained, ...props }: IndicatorProps) {
  if (variant === "loading")
    return <LoadingIndicator isContained={isContained} slot={props.slot} />;
  if (variant === "circular") return <CircularIndicator {...props} />;
  return <LinearIndicator {...props} />;
}
