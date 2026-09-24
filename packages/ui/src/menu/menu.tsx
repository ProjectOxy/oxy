import { presence } from "@oxy/motion";
import type { Ref } from "react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuItemRenderProps,
  MenuLoadMoreItem as AriaMenuLoadMoreItem,
  type MenuLoadMoreItemProps as AriaMenuLoadMoreItemProps,
  type MenuProps as AriaMenuProps,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
  Popover,
  PopoverContext,
  type PopoverProps,
  type PopoverRenderProps,
  SubmenuTrigger as AriaSubmenuTrigger,
  type SubmenuTriggerProps as AriaSubmenuTriggerProps,
  composeRenderProps,
  useSlottedContext,
} from "react-aria-components";
import {
  listItemLayers,
  textValueOf,
  type ListItemContentProps,
  type ListItemSlot,
} from "../collection/item.tsx";
import {
  listContainer,
  listItemReset,
  listItemStyles,
  listParts,
  surface,
} from "../collection/list.ts";
import {
  useStaticClassName,
  usePartClassName,
  type StaticStyledProps,
} from "../collection/static.ts";
import { resolveClassName, type ClassNameValue } from "../core/class-names.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { densities } from "../styles/density.ts";
import { typeScale } from "../collection/type.ts";

export type MenuTriggerProps = AriaMenuTriggerProps;

export function MenuTrigger(props: MenuTriggerProps) {
  return <AriaMenuTrigger {...props} />;
}

export type SubmenuTriggerProps = AriaSubmenuTriggerProps & { ref?: Ref<HTMLDivElement> };

export function SubmenuTrigger(props: SubmenuTriggerProps) {
  return <AriaSubmenuTrigger {...props} />;
}

export interface MenuRenderProps {
  isEmpty: boolean;
}

export const menuVariants = defineVariants(
  {
    color: ["standard", "vibrant"],
    density: ["comfortable", "compact", "dense"],
  },
  { color: "standard", density: "comfortable" },
);

export type MenuVariants = VariantSelection<typeof menuVariants.groups>;

export interface MenuProps<T>
  extends
    Omit<AriaMenuProps<T>, "className">,
    Pick<PopoverProps, "placement" | "offset" | "crossOffset" | "shouldFlip">,
    Omit<StyledProps<MenuRenderProps>, "classNames"> {
  classNames?: { popover?: ClassNameValue<PopoverRenderProps> };
  ref?: Ref<HTMLDivElement>;
}

const popoverTriggers = new Set(["MenuTrigger", "SubmenuTrigger"]);

export function Menu<T extends object>({
  placement,
  offset,
  crossOffset,
  shouldFlip,
  className,
  classNames,
  unstyled,
  ...props
}: MenuProps<T>) {
  const popover = useSlottedContext(PopoverContext);
  const isPopover = popoverTriggers.has(popover?.trigger ?? "");
  const part = usePartClassName(unstyled);
  const styled = useStyled(
    { className, unstyled },
    {
      variants: menuVariants,
      styles: ({ color, density }: MenuVariants) => [
        listContainer.menu,
        typeScale.labelLarge,
        surface.root,
        isPopover && surface.bounded,
        isPopover && surface.elevated,
        densities[density],
        color === "vibrant" && surface.vibrant,
      ],
      reset: [listContainer.reset],
    },
  );

  const menu = (
    <UnstyledScope unstyled={unstyled}>
      <AriaMenu {...props} className={styled.className} />
    </UnstyledScope>
  );
  if (!isPopover) return menu;

  return (
    <Popover
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      shouldFlip={shouldFlip}
      className={(state) =>
        part([surface.popover, presence.scale], resolveClassName(classNames?.popover, state)) ?? ""
      }
    >
      {menu}
    </Popover>
  );
}

const menuItemVariants = defineVariants({}, {});

export type MenuItemSlot = ListItemSlot;

export interface MenuItemProps<T>
  extends
    Omit<AriaMenuItemProps<T>, "className">,
    StyledProps<MenuItemRenderProps, MenuItemSlot>,
    ListItemContentProps {
  ref?: Ref<HTMLDivElement>;
}

const menuItemStyles = (_: unknown, state: MenuItemRenderProps) => listItemStyles(state, true);

export function MenuItem<T extends object>({
  icon,
  description,
  trailing,
  className,
  classNames,
  unstyled,
  children,
  textValue,
  ...props
}: MenuItemProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: menuItemVariants, styles: menuItemStyles, reset: [listItemReset] },
  );

  return (
    <AriaMenuItem
      {...props}
      textValue={textValueOf(textValue, children)}
      className={styled.className}
    >
      {composeRenderProps(children, (children, state) =>
        listItemLayers(
          styled.slot,
          { ...state, isHovered: state.isHovered || state.isOpen },
          { icon, description, trailing },
          {
            startIndicator: state.isSelected ? "check" : null,
            endIndicator: state.hasSubmenu ? "chevronForward" : null,
            textSlots: "label",
          },
          children,
        ),
      )}
    </AriaMenuItem>
  );
}

export interface MenuSectionProps<T> extends AriaMenuSectionProps<T>, StaticStyledProps {
  ref?: Ref<HTMLElement>;
}

export function MenuSection<T extends object>({
  className,
  unstyled,
  ...props
}: MenuSectionProps<T>) {
  return (
    <AriaMenuSection
      {...props}
      className={useStaticClassName({ className, unstyled }, [listParts.section])}
    />
  );
}

export interface MenuLoadMoreItemProps extends AriaMenuLoadMoreItemProps, StaticStyledProps {
  ref?: Ref<HTMLDivElement>;
}

export function MenuLoadMoreItem({ className, unstyled, ...props }: MenuLoadMoreItemProps) {
  return (
    <AriaMenuLoadMoreItem
      {...props}
      className={useStaticClassName({ className, unstyled }, [listParts.loader])}
    />
  );
}
