import { duration, easing } from "@oxy/motion/motion.stylex";
import { snackbar } from "@oxy/tokens/component.stylex";
import { color, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, Ref } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  type ButtonRenderProps,
  composeRenderProps,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastList as AriaToastList,
  UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  UNSTABLE_ToastStateContext,
  type ToastListProps as AriaToastListProps,
  type ToastProps as AriaToastProps,
  type ToastRegionProps as AriaToastRegionProps,
  type ToastRegionRenderProps,
  type ToastRenderProps,
} from "react-aria-components";
import { buttonLayers, type ButtonLayerSlot } from "../button/layers.tsx";
import {
  buttonReset,
  buttonStyles,
  buttonVariants,
  type ButtonVariants,
} from "../button/styles.ts";
import { useStaticClassName, type StaticStyledProps } from "../collection/static.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { windowSize } from "../navigation-item/navigation-item.stylex.ts";
import { focusRing } from "../styles/interaction.ts";

export { UNSTABLE_ToastQueue as ToastQueue, UNSTABLE_ToastStateContext as ToastStateContext };
export type { QueuedToast, ToastOptions, ToastState } from "react-aria-components";

const enter = stylex.keyframes({ from: { opacity: 0, transform: "translateY(100%)" } });

const stack = stylex.create({
  region: {
    position: "fixed",
    insetInline: snackbar["--oxy-snackbar-margin"],
    insetBlockEnd: `calc(${snackbar["--oxy-snackbar-margin"]} + env(safe-area-inset-bottom, 0px))`,
    borderRadius: snackbar["--oxy-snackbar-radius"],
  },
  list: {
    display: "flex",
    flexDirection: "column-reverse",
    alignItems: { default: "stretch", [windowSize.medium]: "center" },
    gap: snackbar["--oxy-snackbar-stack-gap"],
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  listReset: {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
});

const noVariants = defineVariants({}, {});

export interface ToastRegionProps<T>
  extends Omit<AriaToastRegionProps<T>, "className">, StyledProps<ToastRegionRenderProps<T>> {
  ref?: Ref<HTMLDivElement>;
}

export function ToastRegion<T>({ className, unstyled, ...props }: ToastRegionProps<T>) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: noVariants,
      styles: () => [stack.region, stack.list, focusRing.root],
      reset: [],
    },
  );
  return <AriaToastRegion {...props} className={styled.className} />;
}

export interface ToastListProps<T>
  extends Omit<AriaToastListProps<T>, "className">, StyledProps<ToastRegionRenderProps<T>> {
  ref?: Ref<HTMLOListElement>;
}

export function ToastList<T>({ className, unstyled, ...props }: ToastListProps<T>) {
  const styled = useStyled(
    { className, unstyled },
    { variants: noVariants, styles: () => stack.list, reset: [stack.listReset] },
  );
  return <AriaToastList {...props} className={styled.className} />;
}

const styles = stylex.create({
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: snackbar["--oxy-snackbar-gap"],
    minBlockSize: snackbar["--oxy-snackbar-min-height"],
    minInlineSize: { default: 0, [windowSize.medium]: snackbar["--oxy-snackbar-min-width"] },
    maxInlineSize: snackbar["--oxy-snackbar-max-width"],
    paddingInlineStart: snackbar["--oxy-snackbar-padding-inline-start"],
    paddingInlineEnd: snackbar["--oxy-snackbar-padding-inline-end"],
    borderRadius: snackbar["--oxy-snackbar-radius"],
    backgroundColor: snackbar["--oxy-snackbar-container-color"],
    boxShadow: snackbar["--oxy-snackbar-elevation"],
    color: color["--oxy-color-inverse-on-surface"],
    fontFamily: typography["--oxy-typography-body-medium-family"],
    fontSize: typography["--oxy-typography-body-medium-size"],
    lineHeight: typography["--oxy-typography-body-medium-line-height"],
    fontWeight: typography["--oxy-typography-body-medium-weight"],
    letterSpacing: typography["--oxy-typography-body-medium-tracking"],
    animationName: enter,
    animationDuration: duration.spatialDefault,
    animationTimingFunction: easing.spatialDefault,
    "--oxy-supporting-color": "currentColor",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    flexBasis: 0,
    minInlineSize: "min(100%, 12ch)",
    paddingBlock: snackbar["--oxy-snackbar-padding-block"],
  },
  action: {
    color: snackbar["--oxy-snackbar-action-color"],
  },
});

export interface ToastProps<T>
  extends Omit<AriaToastProps<T>, "className">, StyledProps<ToastRenderProps<T>> {
  ref?: Ref<HTMLDivElement>;
}

export function Toast<T>({ className, unstyled, ...props }: ToastProps<T>) {
  const styled = useStyled(
    { className, unstyled },
    { variants: noVariants, styles: () => [styles.root, focusRing.root], reset: [] },
  );
  return <AriaToast {...props} className={styled.className} />;
}

export interface ToastContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className">, StaticStyledProps {
  ref?: Ref<HTMLDivElement>;
}

export function ToastContent({ className, unstyled, ...props }: ToastContentProps) {
  return (
    <AriaToastContent
      {...props}
      className={useStaticClassName({ className, unstyled }, styles.content)}
    />
  );
}

export const toastActionVariants = defineVariants(buttonVariants.groups, {
  ...buttonVariants.defaults,
  variant: "text",
});

export interface ToastActionProps
  extends Omit<AriaButtonProps, "className">, StyledProps<ButtonRenderProps, ButtonLayerSlot> {
  ref?: Ref<HTMLButtonElement>;
}

export function ToastAction({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: ToastActionProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: toastActionVariants,
      styles: (variants: ButtonVariants, state: ButtonRenderProps) => [
        buttonStyles(variants, state, null),
        variants.variant === "text" && !state.isDisabled && styles.action,
      ],
      reset: [buttonReset.root],
    },
  );

  return (
    <AriaButton {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) =>
        buttonLayers(styled.slot, state, children),
      )}
    </AriaButton>
  );
}
