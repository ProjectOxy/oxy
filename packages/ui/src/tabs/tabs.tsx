import { duration, easing } from "@oxy/motion/motion.stylex";
import { focusRing as focusRingToken, tabs } from "@oxy/tokens/component.stylex";
import { color, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { createContext, use, useState, type ReactNode, type Ref } from "react";
import {
  composeRenderProps,
  type Key,
  SelectionIndicator as AriaSelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
  type TabListRenderProps,
  TabListStateContext,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabPanelRenderProps,
  TabPanels as AriaTabPanels,
  type TabPanelsProps as AriaTabPanelsProps,
  type TabProps as AriaTabProps,
  type TabRenderProps,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
  type TabsRenderProps,
  useLocale,
} from "react-aria-components";
import type { Orientation } from "../button/connected.ts";
import { typeScale } from "../collection/type.ts";
import { joinClassNames } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { useUnstyled } from "../provider/context.ts";
import { focusRing, stateLayerStyles } from "../styles/interaction.ts";
import { tab, tabPanels } from "./tabs.stylex.ts";

const OrientationContext = createContext<Orientation>("horizontal");
const TabPanelsContext = createContext(false);

const insetRing = `calc(-1 * ${focusRingToken["--oxy-focus-ring-width"]})`;
const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

const tabsVariants = defineVariants({}, {});

export interface TabsProps extends Omit<AriaTabsProps, "className">, StyledProps<TabsRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const layout = stylex.create({
  tabs: {
    display: "flex",
    flexDirection: "column",
    minInlineSize: 0,
  },
  verticalTabs: {
    flexDirection: "row",
  },
});

export function Tabs({ className, unstyled, children, ...props }: TabsProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: tabsVariants,
      styles: (_, { orientation }: TabsRenderProps) => [
        layout.tabs,
        orientation === "vertical" && layout.verticalTabs,
      ],
      reset: [],
    },
  );

  return (
    <AriaTabs {...props} className={styled.className}>
      {composeRenderProps(children, (children, { orientation }) => (
        <UnstyledScope unstyled={unstyled}>
          <OrientationContext value={orientation}>{children}</OrientationContext>
        </UnstyledScope>
      ))}
    </AriaTabs>
  );
}

export const tabListVariants = defineVariants(
  {
    variant: ["primary", "secondary"],
    layout: ["fixed", "scrollable"],
  },
  { variant: "primary", layout: "fixed" },
);

export type TabListVariants = VariantSelection<typeof tabListVariants.groups>;

export interface TabListProps<T>
  extends Omit<AriaTabListProps<T>, "className">, StyledProps<TabListRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const list = stylex.create({
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    minInlineSize: 0,
    backgroundColor: color["--oxy-color-surface"],
    borderStyle: "solid",
    borderWidth: 0,
    borderColor: color["--oxy-color-outline-variant"],
  },
  horizontal: {
    flexDirection: "row",
    borderBlockEndWidth: tabs["--oxy-tabs-divider-width"],
  },
  vertical: {
    flexDirection: "column",
    borderInlineEndWidth: tabs["--oxy-tabs-divider-width"],
    [tab.contentPosition]: "static",
  },
  primary: {},
  secondary: {
    [tab.selectedColor]: color["--oxy-color-on-surface"],
    [tab.iconHeight]: tabs["--oxy-tabs-height"],
    [tab.contentDirection]: "row",
    [tab.contentGap]: tabs["--oxy-tabs-inline-gap"],
    [tab.contentPosition]: "static",
    [tab.indicatorThickness]: tabs["--oxy-tabs-secondary-indicator-thickness"],
    [tab.indicatorRadius]: "0px",
    [tab.indicatorMinLength]: "0px",
  },
  fixed: {},
  scrollable: {
    [tab.flex]: "0 0 auto",
    overflow: "auto",
    scrollbarWidth: "none",
  },
  scrollableHorizontal: {
    paddingInlineStart: tabs["--oxy-tabs-scrollable-inset"],
  },
});

function tabListStyles(
  { variant, layout: layoutName }: TabListVariants,
  { orientation }: TabListRenderProps,
) {
  return [
    list.root,
    list[orientation],
    list[variant],
    list[layoutName],
    layoutName === "scrollable" && orientation === "horizontal" && list.scrollableHorizontal,
  ];
}

export function TabList<T extends object>({
  className,
  classNames,
  unstyled,
  ...props
}: TabListProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: tabListVariants, styles: tabListStyles, reset: [] },
  );

  return <AriaTabList {...props} className={styled.className} />;
}

const tabVariants = defineVariants({}, {});

export type TabSlot = "stateLayer" | "content" | "icon" | "indicator";

export interface TabProps
  extends Omit<AriaTabProps, "className">, StyledProps<TabRenderProps, TabSlot> {
  icon?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const tabStyles = stylex.create({
  reset: {
    color: "inherit",
    textDecorationLine: "none",
    cursor: "default",
  },
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    flex: tab.flex,
    minBlockSize: tabs["--oxy-tabs-height"],
    paddingInline: tabs["--oxy-tabs-padding-inline"],
    color: color["--oxy-color-on-surface-variant"],
    textDecorationLine: "none",
    whiteSpace: "nowrap",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    transitionProperty: "color",
    transitionDuration: duration.effectsDefault,
    transitionTimingFunction: easing.effectsDefault,
  },
  insetRing: {
    outlineOffset: insetRing,
  },
  withIcon: {
    minBlockSize: tab.iconHeight,
  },
  vertical: {
    flex: "0 0 auto",
    justifyContent: "flex-start",
  },
  selected: {
    color: tab.selectedColor,
  },
  disabled: {
    color: disabledContent,
    cursor: "default",
  },
  content: {
    position: tab.contentPosition,
    display: "flex",
    flexDirection: tab.contentDirection,
    alignItems: "center",
    justifyContent: "center",
    gap: tab.contentGap,
  },
  icon: {
    display: "inline-flex",
    "--oxy-icon-size": tabs["--oxy-tabs-icon-size"],
    fontSize: tabs["--oxy-tabs-icon-size"],
  },
  indicator: {
    position: "absolute",
    backgroundColor: tab.selectedColor,
    transitionProperty: "translate, inline-size, block-size",
    transitionDuration: duration.spatialDefault,
    transitionTimingFunction: easing.spatialDefault,
  },
  horizontalIndicator: {
    insetBlockEnd: 0,
    insetInlineStart: 0,
    inlineSize: "100%",
    minInlineSize: tab.indicatorMinLength,
    blockSize: tab.indicatorThickness,
    borderStartStartRadius: tab.indicatorRadius,
    borderStartEndRadius: tab.indicatorRadius,
  },
  verticalIndicator: {
    insetBlockStart: 0,
    insetInlineEnd: 0,
    blockSize: "100%",
    inlineSize: tab.indicatorThickness,
    borderStartStartRadius: tab.indicatorRadius,
    borderEndStartRadius: tab.indicatorRadius,
  },
});

export function Tab({ icon, className, classNames, unstyled, children, ...props }: TabProps) {
  const orientation = use(OrientationContext);
  const isVertical = orientation === "vertical";
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: tabVariants,
      styles: (_, { isSelected, isDisabled }: TabRenderProps) => [
        tabStyles.root,
        typeScale.titleSmall,
        focusRing.root,
        tabStyles.insetRing,
        icon != null && tabStyles.withIcon,
        isVertical && tabStyles.vertical,
        isSelected && tabStyles.selected,
        isDisabled && tabStyles.disabled,
      ],
      reset: [tabStyles.reset],
    },
  );

  return (
    <AriaTab {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const stateLayer = styled.slot("stateLayer", state, stateLayerStyles(state));
        const indicator = styled.slot("indicator", state, [
          tabStyles.indicator,
          isVertical ? tabStyles.verticalIndicator : tabStyles.horizontalIndicator,
        ]);
        return (
          <>
            {stateLayer !== undefined && (
              <span aria-hidden data-slot="state-layer" className={stateLayer} />
            )}
            <span
              data-slot="content"
              className={styled.slot("content", state, [tabStyles.content])}
            >
              {icon != null && (
                <span
                  aria-hidden
                  data-slot="icon"
                  className={styled.slot("icon", state, [tabStyles.icon])}
                >
                  {icon}
                </span>
              )}
              {children}
              {indicator !== undefined && (
                <AriaSelectionIndicator data-slot="indicator" className={indicator} />
              )}
            </span>
          </>
        );
      })}
    </AriaTab>
  );
}

const shift = `calc(${tabPanels.direction} * ${tabs["--oxy-tabs-panel-shift"]})`;

const slideIn = stylex.keyframes({
  from: { opacity: 0, translate: `${shift} 0` },
});

const slideOut = stylex.keyframes({
  to: { opacity: 0, translate: `calc(-1 * ${shift}) 0` },
});

const panel = stylex.create({
  root: {
    minInlineSize: 0,
    borderRadius: focusRingToken["--oxy-focus-ring-width"],
  },
  inPanels: {
    gridArea: "1 / 1",
    animationName: {
      default: null,
      ":is([data-entering])": slideIn,
      ":is([data-exiting])": slideOut,
    },
    animationDuration: {
      default: null,
      ":is([data-entering])": duration.spatialDefault,
      ":is([data-exiting])": duration.short4,
    },
    animationTimingFunction: {
      default: null,
      ":is([data-entering])": easing.spatialDefault,
      ":is([data-exiting])": easing.emphasizedAccelerate,
    },
    animationFillMode: "both",
    pointerEvents: { default: null, ":is([data-exiting])": "none" },
  },
  panels: {
    display: "grid",
    minInlineSize: 0,
    overflowX: "clip",
  },
  direction: (direction: number) => ({
    [tabPanels.direction]: String(direction),
  }),
});

const tabPanelVariants = defineVariants({}, {});

export interface TabPanelProps
  extends Omit<AriaTabPanelProps, "className">, StyledProps<TabPanelRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export function TabPanel({ className, unstyled, ...props }: TabPanelProps) {
  const isInPanels = use(TabPanelsContext);
  const styled = useStyled(
    { className, unstyled },
    {
      variants: tabPanelVariants,
      styles: () => [panel.root, focusRing.root, isInPanels && panel.inPanels],
      reset: [],
    },
  );

  return <AriaTabPanel {...props} className={styled.className} />;
}

export interface TabPanelsProps<T> extends Omit<AriaTabPanelsProps<T>, "className"> {
  className?: string;
  unstyled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function useTransitionDirection() {
  const state = use(TabListStateContext);
  const { direction: textDirection } = useLocale();
  const selectedKey = state?.selectedKey ?? null;
  const [previous, setPrevious] = useState({ key: selectedKey, direction: 1 });

  if (state && previous.key !== selectedKey) {
    const keys = [...state.collection.getKeys()];
    const indexOf = (key: Key | null) => (key == null ? -1 : keys.indexOf(key));
    setPrevious({
      key: selectedKey,
      direction: indexOf(selectedKey) >= indexOf(previous.key) ? 1 : -1,
    });
  }

  return textDirection === "rtl" ? -previous.direction : previous.direction;
}

export function TabPanels<T extends object>({
  className,
  unstyled,
  style,
  ...props
}: TabPanelsProps<T>) {
  const isUnstyled = useUnstyled(unstyled);
  const direction = useTransitionDirection();
  const own = stylex.props(isUnstyled ? [] : [panel.panels], panel.direction(direction));

  return (
    <TabPanelsContext value={!isUnstyled}>
      <AriaTabPanels
        {...props}
        className={joinClassNames(own.className, className)}
        style={{ ...own.style, ...style }}
      />
    </TabPanelsContext>
  );
}
