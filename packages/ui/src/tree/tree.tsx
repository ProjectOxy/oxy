import { duration, easing } from "@oxy/motion/motion.stylex";
import { tree } from "@oxy/tokens/component.stylex";
import { color } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type ReactNode, type Ref } from "react";
import {
  Tree as AriaTree,
  TreeHeader as AriaTreeHeader,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  type TreeItemContentProps as AriaTreeItemContentProps,
  type TreeItemContentRenderProps,
  type TreeItemProps as AriaTreeItemProps,
  type TreeItemRenderProps,
  TreeLoadMoreItem as AriaTreeLoadMoreItem,
  type TreeLoadMoreItemProps as AriaTreeLoadMoreItemProps,
  type TreeLoadMoreItemRenderProps,
  type TreeProps as AriaTreeProps,
  type TreeRenderProps,
  TreeSection as AriaTreeSection,
  composeRenderProps,
  type GridListHeaderProps as AriaTreeHeaderProps,
} from "react-aria-components";
import {
  controlStyles,
  DragHandle,
  ExpandChevron,
  SelectionCheckbox,
} from "../collection/controls.tsx";
import { listContainer, listItemReset, listItemStyles, listParts } from "../collection/list.ts";
import { listItem } from "../collection/list.stylex.ts";
import { useStaticClassName, type StaticStyledProps } from "../collection/static.ts";
import { typeScale } from "../collection/type.ts";
import type { Styles } from "../core/parts.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { densities } from "../styles/density.ts";
import { focusRing, stateLayerStyles } from "../styles/interaction.ts";

const indent = `calc((var(--tree-item-level, 1) - 1) * ${tree["--oxy-tree-indent"]})`;

const expand = stylex.keyframes({
  from: { opacity: 0, transform: "translateY(-25%)" },
});

const styles = stylex.create({
  tree: {
    [listItem.height]: tree["--oxy-tree-item-height"],
    [listItem.paddingInline]: tree["--oxy-tree-item-padding-inline"],
    [listItem.gap]: tree["--oxy-tree-item-gap"],
    [listItem.iconSize]: tree["--oxy-tree-item-icon-size"],
    [listItem.radius]: tree["--oxy-tree-item-radius"],
    [listItem.edgeRadius]: tree["--oxy-tree-item-radius"],
    [listItem.selectedRadius]: tree["--oxy-tree-item-radius"],
    [listItem.selectedContainer]: color["--oxy-color-secondary-container"],
    [listItem.selectedContent]: color["--oxy-color-on-secondary-container"],
    [listItem.supporting]: color["--oxy-color-on-surface-variant"],
    backgroundColor: color["--oxy-color-surface"],
  },
  dropTarget: {
    outlineStyle: "solid",
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: color["--oxy-color-primary"],
  },
  item: {
    paddingInlineStart: `calc(${listItem.paddingInline} + ${indent})`,
    animationName: { default: null, ":not([data-level='1'])": expand },
    animationDuration: duration.spatialDefault,
    animationTimingFunction: easing.spatialDefault,
  },
  chevronSpacer: {
    flexShrink: 0,
    inlineSize: listItem.iconSize,
  },
  loader: {
    paddingInlineStart: `calc(${listItem.paddingInline} + ${indent})`,
  },
});

export const treeVariants = defineVariants(
  { density: ["comfortable", "compact", "dense"] },
  { density: "comfortable" },
);

export type TreeVariants = VariantSelection<typeof treeVariants.groups>;

export interface TreeProps<T>
  extends Omit<AriaTreeProps<T>, "className">, StyledProps<TreeRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const treeStyles = ({ density }: TreeVariants, { isDropTarget }: TreeRenderProps) => [
  listContainer.root,
  typeScale.bodyLarge,
  focusRing.root,
  listContainer.insetRing,
  densities[density],
  styles.tree,
  isDropTarget && styles.dropTarget,
];

export function Tree<T extends object>({
  className,
  classNames,
  unstyled,
  ...props
}: TreeProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: treeVariants, styles: treeStyles, reset: [listContainer.reset] },
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaTree {...props} className={styled.className} />
    </UnstyledScope>
  );
}

export type TreeItemSlot = "stateLayer" | "dragHandle" | "selection" | "chevron" | "content";

type SlotResolver = (
  slot: TreeItemSlot,
  state: TreeItemRenderProps,
  styles: Styles,
) => string | undefined;

interface TreeItemParts {
  slot: SlotResolver;
  unstyled?: boolean;
}

const TreeItemPartsContext = createContext<TreeItemParts>({
  slot: (_, __, slotStyles) => stylex.props(slotStyles).className,
});

export interface TreeItemProps<T>
  extends Omit<AriaTreeItemProps<T>, "className">, StyledProps<TreeItemRenderProps, TreeItemSlot> {
  ref?: Ref<HTMLDivElement>;
}

const treeItemVariants = defineVariants({}, {});

export function TreeItem<T extends object>({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: TreeItemProps<T>) {
  const isActionable = props.onAction !== undefined || props.href !== undefined;
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: treeItemVariants,
      styles: (_, state: TreeItemRenderProps) => [
        listItemStyles(
          state,
          isActionable || state.selectionMode !== "none" || state.hasChildItems,
        ),
        styles.item,
      ],
      reset: [listItemReset],
    },
  );

  return (
    <AriaTreeItem {...props} className={styled.className}>
      <TreeItemPartsContext value={{ slot: styled.slot, unstyled }}>
        {children}
      </TreeItemPartsContext>
    </AriaTreeItem>
  );
}

export type TreeItemContentProps = AriaTreeItemContentProps;

function treeItemLayers(
  { slot, unstyled }: TreeItemParts,
  state: TreeItemContentRenderProps,
  children: ReactNode,
) {
  const stateLayer = slot("stateLayer", state, stateLayerStyles(state));
  const content = slot("content", state, [listParts.label]);
  const showsCheckbox = state.selectionMode !== "none" && state.selectionBehavior === "toggle";

  return (
    <>
      {stateLayer !== undefined && (
        <span aria-hidden data-slot="state-layer" className={stateLayer} />
      )}
      {state.allowsDragging && (
        <DragHandle className={slot("dragHandle", state, controlStyles.dragHandle)} />
      )}
      {showsCheckbox && (
        <SelectionCheckbox
          unstyled={unstyled}
          className={slot("selection", state, controlStyles.selection)}
        />
      )}
      {state.hasChildItems ? (
        <ExpandChevron
          unstyled={unstyled}
          isExpanded={state.isExpanded}
          className={slot("chevron", state, controlStyles.chevron)}
        />
      ) : (
        stateLayer !== undefined && <span aria-hidden {...stylex.props(styles.chevronSpacer)} />
      )}
      {content === undefined ? (
        children
      ) : (
        <span data-slot="content" className={content}>
          {children}
        </span>
      )}
    </>
  );
}

export function TreeItemContent({ children }: TreeItemContentProps) {
  const parts = useContext(TreeItemPartsContext);
  return (
    <AriaTreeItemContent>
      {composeRenderProps(children, (children, state) => treeItemLayers(parts, state, children))}
    </AriaTreeItemContent>
  );
}

type AriaTreeSectionProps<T> = Omit<Parameters<typeof AriaTreeSection<T>>[0], "className">;

export interface TreeSectionProps<T> extends AriaTreeSectionProps<T>, StaticStyledProps {}

export function TreeSection<T extends object>({
  className,
  unstyled,
  ...props
}: TreeSectionProps<T>) {
  return (
    <AriaTreeSection
      {...props}
      className={useStaticClassName({ className, unstyled }, [listParts.section])}
    />
  );
}

export interface TreeHeaderProps extends AriaTreeHeaderProps, StaticStyledProps {
  ref?: Ref<HTMLDivElement>;
}

export function TreeHeader({ className, unstyled, ...props }: TreeHeaderProps) {
  return (
    <AriaTreeHeader
      {...props}
      className={useStaticClassName({ className, unstyled }, [
        listParts.header,
        typeScale.titleSmall,
      ])}
    />
  );
}

export interface TreeLoadMoreItemProps
  extends Omit<AriaTreeLoadMoreItemProps, "className">, StyledProps<TreeLoadMoreItemRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

export function TreeLoadMoreItem({
  className,
  classNames,
  unstyled,
  ...props
}: TreeLoadMoreItemProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: treeItemVariants,
      styles: () => [listParts.loader, styles.loader],
      reset: [],
    },
  );

  return <AriaTreeLoadMoreItem {...props} className={styled.className} />;
}
