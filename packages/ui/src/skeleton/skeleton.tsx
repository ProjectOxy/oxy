import { duration } from "@oxy/motion/motion.stylex";
import { skeleton } from "@oxy/tokens/component.stylex";
import { radius } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useLocale } from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";

export const skeletonVariants = defineVariants(
  {
    shape: ["text", "rect", "circle"],
    animation: ["pulse", "wave", "still"],
  },
  { shape: "text", animation: "pulse" },
);

export type SkeletonVariants = VariantSelection<typeof skeletonVariants.groups>;
export type SkeletonSlot = "content";

export interface SkeletonRenderProps {
  hasContent: boolean;
}

export interface SkeletonProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, "className" | "children">,
    StyledProps<SkeletonRenderProps, SkeletonSlot> {
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

const pulse = stylex.keyframes({
  "50%": { opacity: 0.4 },
});

const waveForward = stylex.keyframes({
  from: { backgroundPosition: "100% 0" },
  to: { backgroundPosition: "-100% 0" },
});

const waveBackward = stylex.keyframes({
  from: { backgroundPosition: "-100% 0" },
  to: { backgroundPosition: "100% 0" },
});

const cycle = `calc(2 * ${duration.extraLong4})`;

const styles = stylex.create({
  reset: {
    display: "block",
  },
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "block",
    maxInlineSize: "100%",
    backgroundColor: skeleton["--oxy-skeleton-color"],
    pointerEvents: "none",
    userSelect: "none",
    animationDuration: cycle,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },
  text: {
    inlineSize: "100%",
    blockSize: "1em",
    marginBlock: "calc((1lh - 1em) / 2)",
    borderRadius: skeleton["--oxy-skeleton-text-radius"],
  },
  rect: {
    inlineSize: "100%",
    minBlockSize: "1lh",
    borderRadius: skeleton["--oxy-skeleton-rect-radius"],
  },
  circle: {
    inlineSize: skeleton["--oxy-skeleton-circle-size"],
    aspectRatio: "1",
    flexShrink: 0,
    borderRadius: radius["--oxy-radius-full"],
  },
  fitContent: {
    inlineSize: "fit-content",
    blockSize: "auto",
    marginBlock: 0,
    aspectRatio: "auto",
  },
  pulse: {
    animationName: pulse,
  },
  wave: {
    backgroundImage: `linear-gradient(90deg, transparent 25%, ${skeleton["--oxy-skeleton-highlight-color"]} 50%, transparent 75%)`,
    backgroundSize: "200% 100%",
    animationName: waveForward,
    animationTimingFunction: "linear",
  },
  waveRtl: {
    animationName: waveBackward,
  },
  still: {},
  content: {
    visibility: "hidden",
  },
});

export function Skeleton({ className, classNames, unstyled, children, ...props }: SkeletonProps) {
  const { direction } = useLocale();
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: skeletonVariants,
      styles: ({ shape, animation }, { hasContent }: SkeletonRenderProps) => [
        styles.root,
        styles[shape],
        hasContent && styles.fitContent,
        styles[animation],
        animation === "wave" && direction === "rtl" && styles.waveRtl,
      ],
      reset: [styles.reset],
    },
  );

  const state = { hasContent: children != null };

  return (
    <span
      aria-hidden
      {...props}
      className={styled.className({ ...state, defaultClassName: undefined })}
    >
      {state.hasContent && (
        <span data-slot="content" inert className={styled.slot("content", state, [styles.content])}>
          {children}
        </span>
      )}
    </span>
  );
}
