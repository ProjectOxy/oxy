import { duration, easing } from "@oxy/motion/motion.stylex";
import { focusRing as focusRingToken, list, menu } from "@oxy/tokens/component.stylex";
import { color, space, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { focusRing, type InteractionState } from "../styles/interaction.ts";
import { density } from "../styles/vars.stylex.ts";
import { listItem } from "./list.stylex.ts";

const insetRing = `calc(-1 * ${focusRingToken["--oxy-focus-ring-width"]})`;

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

export const listContainer = stylex.create({
  reset: {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minInlineSize: 0,
    margin: 0,
    padding: 0,
    color: color["--oxy-color-on-surface"],
    overflow: "auto",
  },
  standard: {
    backgroundColor: color["--oxy-color-surface"],
  },
  segmented: {
    gap: list["--oxy-list-segmented-gap"],
    [listItem.container]: color["--oxy-color-surface-container-low"],
    [listItem.radius]: list["--oxy-list-segmented-item-radius"],
    [listItem.edgeRadius]: list["--oxy-list-segmented-radius"],
    [listItem.selectedRadius]: list["--oxy-list-segmented-radius"],
  },
  grid: {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${list["--oxy-list-grid-min-column-width"]}), 1fr))`,
    gap: space["--oxy-space-sm"],
    [listItem.container]: color["--oxy-color-surface-container-low"],
    [listItem.radius]: list["--oxy-list-segmented-radius"],
    [listItem.edgeRadius]: list["--oxy-list-segmented-radius"],
    [listItem.selectedRadius]: list["--oxy-list-segmented-radius"],
  },
  menu: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: menu["--oxy-menu-padding"],
    color: color["--oxy-color-on-surface"],
    outlineStyle: "none",
    overflow: "auto",
    maxBlockSize: "inherit",
    [listItem.height]: menu["--oxy-menu-item-height"],
    [listItem.paddingInline]: menu["--oxy-menu-item-padding-inline"],
    [listItem.gap]: menu["--oxy-menu-item-gap"],
    [listItem.iconSize]: menu["--oxy-menu-item-icon-size"],
    [listItem.radius]: menu["--oxy-menu-item-radius"],
    [listItem.edgeRadius]: menu["--oxy-menu-item-edge-radius"],
    [listItem.selectedRadius]: menu["--oxy-menu-selected-item-radius"],
    [listItem.selectedContainer]: color["--oxy-color-tertiary-container"],
    [listItem.selectedContent]: color["--oxy-color-on-tertiary-container"],
  },
  insetRing: {
    outlineOffset: insetRing,
  },
});

export const surface = stylex.create({
  root: {
    boxSizing: "border-box",
    minInlineSize: menu["--oxy-menu-min-width"],
    borderRadius: menu["--oxy-menu-radius"],
    backgroundColor: color["--oxy-color-surface-container"],
    outlineStyle: "none",
  },
  bounded: {
    maxInlineSize: `min(${menu["--oxy-menu-max-width"]}, 100vw)`,
  },
  elevated: {
    boxShadow: menu["--oxy-menu-elevation"],
  },
  vibrant: {
    backgroundColor: color["--oxy-color-tertiary-container"],
    color: color["--oxy-color-on-tertiary-container"],
    [listItem.selectedContainer]: color["--oxy-color-tertiary"],
    [listItem.selectedContent]: color["--oxy-color-on-tertiary"],
    [listItem.supporting]: color["--oxy-color-on-tertiary-container"],
  },
  popover: {
    outlineStyle: "none",
    transformOrigin: "var(--trigger-anchor-point)",
  },
});

const firstChild = ":first-child";
const lastChild = ":last-child";
const edge = (position: string) => ({
  default: listItem.radius,
  [position]: listItem.edgeRadius,
});

const item = stylex.create({
  reset: {
    color: "inherit",
    textDecorationLine: "none",
  },
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: listItem.gap,
    minBlockSize: `calc(${listItem.height} - ${density.offset})`,
    paddingInline: listItem.paddingInline,
    paddingBlock: space["--oxy-space-sm"],
    borderStartStartRadius: edge(firstChild),
    borderStartEndRadius: edge(firstChild),
    borderEndStartRadius: edge(lastChild),
    borderEndEndRadius: edge(lastChild),
    backgroundColor: listItem.container,
    color: "inherit",
    textDecorationLine: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "default",
    "--oxy-icon-size": listItem.iconSize,
    transitionProperty: "background-color, color, border-radius",
    transitionDuration: `${duration.effectsDefault}, ${duration.effectsDefault}, ${duration.spatialFast}`,
    transitionTimingFunction: `${easing.effectsDefault}, ${easing.effectsDefault}, ${easing.spatialFast}`,
  },
  interactive: {
    cursor: "pointer",
  },
  selected: {
    borderStartStartRadius: listItem.selectedRadius,
    borderStartEndRadius: listItem.selectedRadius,
    borderEndStartRadius: listItem.selectedRadius,
    borderEndEndRadius: listItem.selectedRadius,
    backgroundColor: listItem.selectedContainer,
    color: listItem.selectedContent,
  },
  disabled: {
    color: disabledContent,
    cursor: "default",
    [listItem.supporting]: disabledContent,
  },
  dragging: {
    opacity: state["--oxy-state-disabled-content"],
  },
  dropTarget: {
    outlineStyle: "solid",
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: color["--oxy-color-primary"],
  },
});

export const listItemReset = item.reset;

export const listParts = stylex.create({
  icon: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    inlineSize: listItem.iconSize,
    blockSize: listItem.iconSize,
    color: listItem.supporting,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minInlineSize: 0,
  },
  label: {
    flexGrow: 1,
    minInlineSize: 0,
    overflowWrap: "anywhere",
  },
  description: {
    color: listItem.supporting,
  },
  trailing: {
    flexShrink: 0,
    color: listItem.supporting,
  },
  indicator: {
    display: "inline-flex",
    flexShrink: 0,
    color: "inherit",
  },
  leading: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    inlineSize: listItem.iconSize,
    blockSize: listItem.iconSize,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--oxy-color-outline-variant"],
    borderBlockStartWidth: { default: 0, ":not(:first-child)": 1 },
    marginBlockStart: { default: 0, ":not(:first-child)": space["--oxy-space-xs"] },
    paddingBlockStart: { default: 0, ":not(:first-child)": space["--oxy-space-xs"] },
  },
  header: {
    boxSizing: "border-box",
    paddingInline: listItem.paddingInline,
    paddingBlock: space["--oxy-space-sm"],
    color: color["--oxy-color-on-surface-variant"],
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minBlockSize: `calc(${listItem.height} - ${density.offset})`,
    color: listItem.supporting,
  },
});

export interface ListItemState extends InteractionState {
  isSelected?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
}

export const listItemStyles = (
  { isSelected, isDisabled, isDragging, isDropTarget }: ListItemState,
  isInteractive: boolean,
) => [
  item.root,
  focusRing.root,
  listContainer.insetRing,
  isInteractive && !isDisabled && item.interactive,
  isSelected && item.selected,
  isDisabled && item.disabled,
  isDragging && item.dragging,
  isDropTarget && item.dropTarget,
];
