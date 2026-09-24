import { duration, easing } from "@oxy/motion/motion.stylex";
import { list } from "@oxy/tokens/component.stylex";
import { color, state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode, Ref } from "react";
import {
  Button,
  Checkbox,
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
import { GlyphIcon } from "../collection/glyphs.tsx";
import {
  listItemLayers,
  textValueOf,
  type ListItemContentProps,
  type ListItemSlot,
} from "../collection/item.tsx";
import { listContainer, listItemReset, listItemStyles, listParts } from "../collection/list.ts";
import { listItem } from "../collection/list.stylex.ts";
import { useStaticClassName, type StaticStyledProps } from "../collection/static.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { densities } from "../styles/density.ts";
import { useUnstyled } from "../provider/context.ts";
import { focusRing } from "../styles/interaction.ts";
import { typeScale } from "../collection/type.ts";

const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

const styles = stylex.create({
  dropTarget: {
    outlineStyle: "solid",
    outlineWidth: 2,
    outlineOffset: -2,
    outlineColor: color["--oxy-color-primary"],
  },
  control: {
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    inlineSize: listItem.iconSize,
    blockSize: listItem.iconSize,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: list["--oxy-list-selection-radius"],
    backgroundColor: "transparent",
    color: listItem.supporting,
    outlineOffset: 0,
    cursor: "pointer",
  },
  dragHandle: {
    cursor: "grab",
  },
  box: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    inlineSize: list["--oxy-list-selection-size"],
    blockSize: list["--oxy-list-selection-size"],
    borderStyle: "solid",
    borderWidth: list["--oxy-list-selection-outline-width"],
    borderRadius: list["--oxy-list-selection-radius"],
    borderColor: color["--oxy-color-on-surface-variant"],
    color: color["--oxy-color-on-primary"],
    "--oxy-icon-size": list["--oxy-list-selection-size"],
    transitionProperty: "background-color, border-color",
    transitionDuration: duration.effectsFast,
    transitionTimingFunction: easing.effectsFast,
  },
  boxSelected: {
    borderColor: color["--oxy-color-primary"],
    backgroundColor: color["--oxy-color-primary"],
  },
  boxDisabled: {
    borderColor: disabledContent,
  },
  boxSelectedDisabled: {
    borderColor: "transparent",
    backgroundColor: disabledContent,
    color: color["--oxy-color-surface"],
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
  const isUnstyled = useUnstyled(unstyled);
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
              <Button
                slot="drag"
                data-slot="drag-handle"
                className={styled.slot("dragHandle", state, [
                  styles.control,
                  focusRing.root,
                  styles.dragHandle,
                ])}
              >
                <GlyphIcon glyph="dragIndicator" />
              </Button>
            )}
            {showsCheckbox && (
              <Checkbox
                slot="selection"
                data-slot="selection"
                className={styled.slot("selection", state, [styles.control, focusRing.root])}
              >
                {({ isSelected, isDisabled }) =>
                  !isUnstyled && (
                    <span
                      aria-hidden
                      {...stylex.props(
                        styles.box,
                        isSelected && styles.boxSelected,
                        isDisabled &&
                          (isSelected ? styles.boxSelectedDisabled : styles.boxDisabled),
                      )}
                    >
                      {isSelected && <GlyphIcon glyph="check" />}
                    </span>
                  )
                }
              </Checkbox>
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
