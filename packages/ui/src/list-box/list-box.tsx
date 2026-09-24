import type { Ref } from "react";
import {
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxItemRenderProps,
  ListBoxLoadMoreItem as AriaListBoxLoadMoreItem,
  type ListBoxLoadMoreItemProps as AriaListBoxLoadMoreItemProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxRenderProps,
  ListBoxSection as AriaListBoxSection,
  type ListBoxSectionProps as AriaListBoxSectionProps,
  composeRenderProps,
} from "react-aria-components";
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

export const listBoxVariants = defineVariants(
  {
    variant: ["standard", "segmented"],
    density: ["comfortable", "compact", "dense"],
  },
  { variant: "standard", density: "comfortable" },
);

export type ListBoxVariants = VariantSelection<typeof listBoxVariants.groups>;

export interface ListBoxProps<T>
  extends Omit<AriaListBoxProps<T>, "className">, StyledProps<ListBoxRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const listBoxStyles = ({ variant, density }: ListBoxVariants, { layout }: ListBoxRenderProps) => [
  listContainer.root,
  typeScale.bodyLarge,
  focusRing.root,
  listContainer.insetRing,
  densities[density],
  layout === "grid" ? listContainer.grid : listContainer[variant],
];

export function ListBox<T extends object>({
  className,
  classNames,
  unstyled,
  ...props
}: ListBoxProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: listBoxVariants, styles: listBoxStyles, reset: [listContainer.reset] },
  );

  return (
    <UnstyledScope unstyled={unstyled}>
      <AriaListBox {...props} className={styled.className} />
    </UnstyledScope>
  );
}

const listBoxItemVariants = defineVariants({}, {});

export type ListBoxItemSlot = ListItemSlot;

export interface ListBoxItemProps<T>
  extends
    Omit<AriaListBoxItemProps<T>, "className">,
    StyledProps<ListBoxItemRenderProps, ListBoxItemSlot>,
    ListItemContentProps {
  ref?: Ref<HTMLDivElement>;
}

export function ListBoxItem<T extends object>({
  icon,
  description,
  trailing,
  className,
  classNames,
  unstyled,
  children,
  textValue,
  ...props
}: ListBoxItemProps<T>) {
  const isActionable = props.onAction !== undefined || props.href !== undefined;
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: listBoxItemVariants,
      styles: (_, state: ListBoxItemRenderProps) =>
        listItemStyles(state, isActionable || state.selectionMode !== "none"),
      reset: [listItemReset],
    },
  );

  return (
    <AriaListBoxItem
      {...props}
      textValue={textValueOf(textValue, children)}
      className={styled.className}
    >
      {composeRenderProps(children, (children, state) =>
        listItemLayers(
          styled.slot,
          state,
          { icon, description, trailing },
          { endIndicator: state.isSelected ? "check" : null, textSlots: "label" },
          children,
        ),
      )}
    </AriaListBoxItem>
  );
}

export interface ListBoxSectionProps<T> extends AriaListBoxSectionProps<T>, StaticStyledProps {
  ref?: Ref<HTMLElement>;
}

export function ListBoxSection<T extends object>({
  className,
  unstyled,
  ...props
}: ListBoxSectionProps<T>) {
  return (
    <AriaListBoxSection
      {...props}
      className={useStaticClassName({ className, unstyled }, [listParts.section])}
    />
  );
}

export interface ListBoxLoadMoreItemProps extends AriaListBoxLoadMoreItemProps, StaticStyledProps {
  ref?: Ref<HTMLDivElement>;
}

export function ListBoxLoadMoreItem({ className, unstyled, ...props }: ListBoxLoadMoreItemProps) {
  return (
    <AriaListBoxLoadMoreItem
      {...props}
      className={useStaticClassName({ className, unstyled }, [listParts.loader])}
    />
  );
}
