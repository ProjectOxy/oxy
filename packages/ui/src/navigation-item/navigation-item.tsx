import { duration, easing } from "@oxy/motion/motion.stylex";
import {
  focusRing as focusRingToken,
  navigationItem as navigationItemToken,
} from "@oxy/tokens/component.stylex";
import { color, radius, state, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { use, type ReactNode, type Ref } from "react";
import {
  composeRenderProps,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  type LinkRenderProps,
} from "react-aria-components";
import { typeScale } from "../collection/type.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { stateLayerStyles, touchTarget } from "../styles/interaction.ts";
import { NavigationContext, type NavigationLayout } from "./context.ts";
import { navigationItem, windowSize } from "./navigation-item.stylex.ts";

const indicatorWidth = navigationItemToken["--oxy-navigation-item-indicator-width"];
const indicatorHeight = navigationItemToken["--oxy-navigation-item-indicator-height"];
const labelGap = navigationItemToken["--oxy-navigation-item-label-gap"];
const badgeSize = navigationItemToken["--oxy-navigation-item-badge-size"];
const dotSize = navigationItemToken["--oxy-navigation-item-badge-dot-size"];
const verticalTop = `calc(50% - (${indicatorHeight} + ${labelGap} + ${typography["--oxy-typography-label-medium-line-height"]}) / 2)`;
const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

const styles = stylex.create({
  reset: {
    color: "inherit",
    textDecorationLine: "none",
  },
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    minInlineSize: 0,
    color: color["--oxy-color-on-surface-variant"],
    textDecorationLine: "none",
    whiteSpace: "nowrap",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    outlineStyle: "none",
  },
  bar: {
    flex: "1 1 0%",
  },
  rail: {
    alignSelf: "stretch",
  },
  drawer: {
    alignSelf: "stretch",
  },
  disabled: {
    color: disabledContent,
    cursor: "default",
  },
  vertical: {
    flexDirection: "column",
    justifyContent: "center",
    gap: labelGap,
    minBlockSize: navigationItem.verticalHeight,
  },
  horizontal: {
    flex: "0 1 auto",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: navigationItem.horizontalGap,
    minBlockSize: navigationItem.horizontalHeight,
    paddingInlineStart: navigationItemToken["--oxy-navigation-item-horizontal-padding-inline"],
    paddingInlineEnd: navigationItem.horizontalPaddingInlineEnd,
    borderRadius: radius["--oxy-radius-full"],
  },
  adaptive: {
    flex: { default: "1 1 0%", [windowSize.medium]: "0 1 auto" },
    flexDirection: { default: "column", [windowSize.medium]: "row" },
    justifyContent: "center",
    gap: { default: labelGap, [windowSize.medium]: navigationItem.horizontalGap },
    minBlockSize: {
      default: navigationItem.verticalHeight,
      [windowSize.medium]: navigationItem.horizontalHeight,
    },
    paddingInlineStart: {
      default: 0,
      [windowSize.medium]: navigationItemToken["--oxy-navigation-item-horizontal-padding-inline"],
    },
    paddingInlineEnd: {
      default: 0,
      [windowSize.medium]: navigationItem.horizontalPaddingInlineEnd,
    },
    borderRadius: { default: 0, [windowSize.medium]: radius["--oxy-radius-full"] },
  },
  layer: {
    position: "absolute",
    boxSizing: "border-box",
    borderRadius: radius["--oxy-radius-full"],
    pointerEvents: "none",
  },
  verticalLayer: {
    insetBlockStart: verticalTop,
    insetInline: 0,
    marginInline: "auto",
    inlineSize: indicatorWidth,
    blockSize: indicatorHeight,
  },
  horizontalLayer: {
    insetBlock: 0,
    insetInline: 0,
  },
  adaptiveLayer: {
    insetBlockStart: { default: verticalTop, [windowSize.medium]: 0 },
    insetBlockEnd: { default: null, [windowSize.medium]: 0 },
    insetInline: 0,
    marginInline: { default: "auto", [windowSize.medium]: 0 },
    inlineSize: { default: indicatorWidth, [windowSize.medium]: "auto" },
    blockSize: { default: indicatorHeight, [windowSize.medium]: "auto" },
  },
  indicator: {
    backgroundColor: color["--oxy-color-secondary-container"],
    opacity: 0,
    scale: "0 1",
    transitionProperty: "scale, opacity",
    transitionDuration: `${duration.spatialFast}, ${duration.effectsFast}`,
    transitionTimingFunction: `${easing.spatialFast}, ${easing.effectsFast}`,
  },
  currentIndicator: {
    opacity: 1,
    scale: "1 1",
  },
  focusRing: {
    outlineStyle: "solid",
    outlineWidth: focusRingToken["--oxy-focus-ring-width"],
    outlineOffset: focusRingToken["--oxy-focus-ring-offset"],
    outlineColor: focusRingToken["--oxy-focus-ring-color"],
  },
  icon: {
    transitionProperty: "color",
    transitionDuration: duration.effectsDefault,
    transitionTimingFunction: easing.effectsDefault,
  },
  verticalIcon: {
    position: "relative",
    display: "inline-flex",
  },
  horizontalIcon: {
    display: "contents",
  },
  adaptiveIcon: {
    position: "relative",
    display: { default: "inline-flex", [windowSize.medium]: "contents" },
  },
  glyph: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    inlineSize: navigationItemToken["--oxy-navigation-item-icon-size"],
    blockSize: navigationItemToken["--oxy-navigation-item-icon-size"],
    "--oxy-icon-size": navigationItemToken["--oxy-navigation-item-icon-size"],
    fontSize: navigationItemToken["--oxy-navigation-item-icon-size"],
  },
  currentIcon: {
    color: color["--oxy-color-on-secondary-container"],
  },
  label: {
    position: "relative",
    maxInlineSize: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transitionProperty: "color",
    transitionDuration: duration.effectsDefault,
    transitionTimingFunction: easing.effectsDefault,
  },
  verticalCurrentLabel: {
    color: color["--oxy-color-secondary"],
  },
  horizontalCurrentLabel: {
    color: color["--oxy-color-on-secondary-container"],
  },
  adaptiveCurrentLabel: {
    color: {
      default: color["--oxy-color-secondary"],
      [windowSize.medium]: color["--oxy-color-on-secondary-container"],
    },
  },
  badge: {
    position: "absolute",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    insetBlockStart: `calc(${badgeSize} / -4)`,
    insetInlineStart: "50%",
    minInlineSize: badgeSize,
    blockSize: badgeSize,
    paddingInline: `calc(${badgeSize} / 4)`,
    borderRadius: radius["--oxy-radius-full"],
    backgroundColor: color["--oxy-color-error"],
    color: color["--oxy-color-on-error"],
  },
  dot: {
    insetBlockStart: 0,
    insetInlineStart: `calc(100% - ${dotSize})`,
    minInlineSize: dotSize,
    blockSize: dotSize,
    paddingInline: 0,
  },
  horizontalBadge: {
    position: "relative",
    order: 1,
    insetBlockStart: "auto",
    insetInlineStart: "auto",
    marginInlineStart: "auto",
  },
  adaptiveBadge: {
    position: { default: "absolute", [windowSize.medium]: "relative" },
    order: { default: null, [windowSize.medium]: 1 },
    insetBlockStart: { default: `calc(${badgeSize} / -4)`, [windowSize.medium]: "auto" },
    insetInlineStart: { default: "50%", [windowSize.medium]: "auto" },
    marginInlineStart: { default: null, [windowSize.medium]: "auto" },
  },
  adaptiveDot: {
    position: { default: "absolute", [windowSize.medium]: "relative" },
    order: { default: null, [windowSize.medium]: 1 },
    insetBlockStart: { default: 0, [windowSize.medium]: "auto" },
    insetInlineStart: { default: `calc(100% - ${dotSize})`, [windowSize.medium]: "auto" },
    marginInlineStart: { default: null, [windowSize.medium]: "auto" },
  },
});

const layouts = {
  vertical: {
    root: styles.vertical,
    layer: styles.verticalLayer,
    label: styles.verticalCurrentLabel,
    icon: styles.verticalIcon,
    badge: null,
    dot: null,
  },
  horizontal: {
    root: styles.horizontal,
    layer: styles.horizontalLayer,
    label: styles.horizontalCurrentLabel,
    icon: styles.horizontalIcon,
    badge: styles.horizontalBadge,
    dot: styles.horizontalBadge,
  },
  adaptive: {
    root: styles.adaptive,
    layer: styles.adaptiveLayer,
    label: styles.adaptiveCurrentLabel,
    icon: styles.adaptiveIcon,
    badge: styles.adaptiveBadge,
    dot: styles.adaptiveDot,
  },
} satisfies Record<NavigationLayout, object>;

const navigationItemVariants = defineVariants({}, {});

export type NavigationItemSlot =
  | "touchTarget"
  | "indicator"
  | "stateLayer"
  | "focusRing"
  | "icon"
  | "badge"
  | "label";

export interface NavigationItemProps
  extends Omit<AriaLinkProps, "className">, StyledProps<LinkRenderProps, NavigationItemSlot> {
  icon?: ReactNode;
  badge?: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
}

export function NavigationItem({
  icon,
  badge,
  className,
  classNames,
  unstyled,
  children,
  ...props
}: NavigationItemProps) {
  const { container, layout, labelSize } = use(NavigationContext);
  const { root, layer, label, icon: iconLayout, badge: badgeLayout, dot } = layouts[layout];
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: navigationItemVariants,
      styles: (_, { isDisabled }: LinkRenderProps) => [
        styles.root,
        labelSize === "medium" ? typeScale.labelMedium : typeScale.labelLarge,
        styles[container],
        root,
        isDisabled && styles.disabled,
      ],
      reset: [styles.reset],
    },
  );

  const glyphClassName = styled.isUnstyled ? undefined : stylex.props(styles.glyph).className;

  return (
    <AriaLink {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const { isCurrent, isFocusVisible } = state;
        const touchTargetClassName = styled.slot("touchTarget", state, [touchTarget.root]);
        const indicator = styled.slot("indicator", state, [
          styles.layer,
          layer,
          styles.indicator,
          isCurrent && styles.currentIndicator,
        ]);
        const stateLayer = styled.slot("stateLayer", state, [
          ...stateLayerStyles(state),
          styles.layer,
          layer,
        ]);
        const focusRing = isFocusVisible
          ? styled.slot("focusRing", state, [styles.layer, layer, styles.focusRing])
          : undefined;
        const badgeClassName =
          badge == null || badge === false
            ? undefined
            : styled.slot("badge", state, [
                styles.badge,
                badge === true ? [styles.dot, dot] : [typeScale.labelSmall, badgeLayout],
              ]);
        return (
          <>
            {touchTargetClassName !== undefined && (
              <span aria-hidden data-slot="touch-target" className={touchTargetClassName} />
            )}
            {indicator !== undefined && (
              <span aria-hidden data-slot="indicator" className={indicator} />
            )}
            {stateLayer !== undefined && (
              <span aria-hidden data-slot="state-layer" className={stateLayer} />
            )}
            {focusRing !== undefined && (
              <span aria-hidden data-slot="focus-ring" className={focusRing} />
            )}
            {icon != null && (
              <span
                data-slot="icon"
                className={styled.slot("icon", state, [
                  styles.icon,
                  iconLayout,
                  isCurrent && styles.currentIcon,
                ])}
              >
                <span aria-hidden className={glyphClassName}>
                  {icon}
                </span>
                {badgeClassName !== undefined && (
                  <span
                    data-slot="badge"
                    aria-hidden={badge === true || undefined}
                    className={badgeClassName}
                  >
                    {badge === true ? null : badge}
                  </span>
                )}
              </span>
            )}
            <span
              data-slot="label"
              className={styled.slot("label", state, [styles.label, isCurrent && label])}
            >
              {children}
            </span>
          </>
        );
      })}
    </AriaLink>
  );
}
