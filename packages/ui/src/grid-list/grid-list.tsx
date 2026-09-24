import { color } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode, Ref } from "react";
import {
  GridList as AriaGridList,
  GridListHeader as AriaGridListHeader,
  type GridListHeaderProps as AriaGridListHeaderProps,
  GridListItem as AriaGridListItem,
  type GridListItemProps as AriaGridListItemProps,
  type GridListItemRenderProps,
  GridListLoadMoreItem as AriaGridListLoadMoreItem,
  type GridListLoadMoreItemProps as AriaGridListLoadMoreItemProps,
  type GridListProps as AriaGridListProps,
  type GridListRenderProps,
  GridListSection as AriaGridListSection,
  type GridListSectionProps as AriaGridListSectionProps,
  composeRenderProps,
} from "react-aria-components";
import { controlStyles, DragHandle, SelectionCheckbox } from "../collection/controls.tsx";
import {
  listItemLayers,
  textValueOf,
  type ListItemContentProps,
  type ListItemSlot,
} from "../collection/item.tsx";
import { listContainer, listItemReset, listItemStyles, listParts } from "../collection/list.ts";
import { useStaticClassName, type StaticStyledProps } from "../collection/static.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { densities } from "../styles/density.ts";
import { focusRing } from "../styles/interaction.ts";
import { typeScale } from "../collection/type.ts";

const styles = stylex.create({
  dropTarget: {
    outlineStyle: "solid",
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: color["--oxy-color-primary"],
  },
});

export const gridListVariants = defineVariants(
  {
    variant: ["standard", "segmented"],
    density: ["comfortable", "compact", "dense"],
  },
  { variant: "standard", density: "comfortable" },
);

export type GridListVariants = VariantSelection<typeof gridListVariants.groups>;

export interface GridListProps<T>
  extends Omit<AriaGridListProps<T>, "className">, StyledProps<GridListRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const gridListStyles = (
  { variant, density }: GridListVariants,
  { layout, isDropTarget }: GridListRenderProps,
) => [
  listContainer.root,
  typeScale.bodyLarge,
  focusRing.root,
  listContainer.insetRing,
  densities[density],
  layout === "grid" ? listContainer.grid : listContainer[variant],
  isDropTarget && styles.dropTarget,
];

export function GridList<T extends object>({
  className,
  classNames,
  unstyled,
  ...props
}: GridListProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: gridListVariants, styles: gridListStyles, reset: [listContainer.reset] },
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaGridList {...props} className={styled.className} />
    </UnstyledScope>
  );
}

const gridListItemVariants = defineVariants({}, {});

export type GridListItemSlot = ListItemSlot | "selection" | "dragHandle";

export interface GridListItemProps<T>
  extends
    Omit<AriaGridListItemProps<T>, "className">,
    StyledProps<GridListItemRenderProps, GridListItemSlot>,
    ListItemContentProps {
  ref?: Ref<HTMLDivElement>;
}

export function GridListItem<T extends object>({
  icon,
  description,
  trailing,
  className,
  classNames,
  unstyled,
  children,
  textValue,
  ...props
}: GridListItemProps<T>) {
  const isActionable = props.onAction !== undefined || props.href !== undefined;
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: gridListItemVariants,
      styles: (_, state: GridListItemRenderProps) =>
        listItemStyles(state, isActionable || state.selectionMode !== "none"),
      reset: [listItemReset],
    },
  );

  return (
    <AriaGridListItem
      {...props}
      textValue={textValueOf(textValue, children)}
      className={styled.className}
    >
      {composeRenderProps(children, (children, state) => {
        const showsCheckbox =
          state.selectionMode !== "none" && state.selectionBehavior === "toggle";
        const leading: ReactNode = (state.allowsDragging || showsCheckbox) && (
          <>
            {state.allowsDragging && (
              <DragHandle className={styled.slot("dragHandle", state, controlStyles.dragHandle)} />
            )}
            {showsCheckbox && (
              <SelectionCheckbox
                unstyled={unstyled}
                className={styled.slot("selection", state, controlStyles.selection)}
              />
            )}
          </>
        );
        return listItemLayers(
          styled.slot,
          state,
          { icon, description, trailing },
          { leading: leading || null, textSlots: "description" },
          children,
        );
      })}
    </AriaGridListItem>
  );
}

export interface GridListSectionProps<T> extends AriaGridListSectionProps<T>, StaticStyledProps {
  ref?: Ref<HTMLDivElement>;
}

export function GridListSection<T extends object>({
  className,
  unstyled,
  ...props
}: GridListSectionProps<T>) {
  return (
    <AriaGridListSection
      {...props}
      className={useStaticClassName({ className, unstyled }, [listParts.section])}
    />
  );
}

export interface GridListHeaderProps extends AriaGridListHeaderProps, StaticStyledProps {
  ref?: Ref<HTMLDivElement>;
}

export function GridListHeader({ className, unstyled, ...props }: GridListHeaderProps) {
  return (
    <AriaGridListHeader
      {...props}
      className={useStaticClassName({ className, unstyled }, [
        listParts.header,
        typeScale.titleSmall,
      ])}
    />
  );
}

export interface GridListLoadMoreItemProps
  extends AriaGridListLoadMoreItemProps, StaticStyledProps {
  ref?: Ref<HTMLDivElement>;
}

export function GridListLoadMoreItem({ className, unstyled, ...props }: GridListLoadMoreItemProps) {
  return (
    <AriaGridListLoadMoreItem
      {...props}
      className={useStaticClassName({ className, unstyled }, [listParts.loader])}
    />
  );
}
