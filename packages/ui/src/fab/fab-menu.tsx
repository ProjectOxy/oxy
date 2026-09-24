import { presence } from "@oxy/motion";
import { duration, easing } from "@oxy/motion/motion.stylex";
import { fabMenu } from "@oxy/tokens/component.stylex";
import { color, state, typography } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode, Ref } from "react";
import {
  Menu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuItemRenderProps,
  type MenuProps,
  MenuTrigger,
  type MenuTriggerProps,
  Popover,
  type PopoverProps,
  type PopoverRenderProps,
  composeRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { focusRing, stateLayerStyles } from "../styles/interaction.ts";
import { tones } from "../styles/tone.ts";
import { tone } from "../styles/vars.stylex.ts";

export type FabMenuProps = MenuTriggerProps;

export function FabMenu(props: FabMenuProps) {
  return <MenuTrigger {...props} />;
}

export const fabMenuListVariants = defineVariants(
  { tone: ["primary", "secondary", "tertiary", "error"] },
  { tone: "primary" },
);

export type FabMenuListVariants = VariantSelection<typeof fabMenuListVariants.groups>;
export type FabMenuListSlot = "menu";

export interface FabMenuListProps<T>
  extends
    Omit<MenuProps<T>, "className">,
    Pick<PopoverProps, "placement" | "offset" | "crossOffset" | "shouldFlip">,
    StyledProps<PopoverRenderProps, FabMenuListSlot> {
  ref?: Ref<HTMLDivElement>;
}

const disabledContainer = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-container"]} * 100%), transparent)`;
const disabledContent = `color-mix(in srgb, ${color["--oxy-color-on-surface"]} calc(${state["--oxy-state-disabled-content"]} * 100%), transparent)`;

const styles = stylex.create({
  popover: {
    outlineStyle: "none",
    transformOrigin: "var(--trigger-anchor-point)",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: fabMenu["--oxy-fab-menu-gap"],
    outlineStyle: "none",
  },
  itemReset: {
    color: "inherit",
    textDecorationLine: "none",
  },
  item: {
    position: "relative",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    gap: fabMenu["--oxy-fab-menu-item-gap"],
    blockSize: fabMenu["--oxy-fab-menu-item-height"],
    paddingInline: fabMenu["--oxy-fab-menu-item-padding-inline"],
    borderRadius: `calc(${fabMenu["--oxy-fab-menu-item-height"]} / 2)`,
    backgroundColor: tone.container,
    color: tone.onContainer,
    fontFamily: typography["--oxy-typography-title-medium-family"],
    fontSize: typography["--oxy-typography-title-medium-size"],
    lineHeight: typography["--oxy-typography-title-medium-line-height"],
    fontWeight: typography["--oxy-typography-title-medium-weight"],
    letterSpacing: typography["--oxy-typography-title-medium-tracking"],
    whiteSpace: "nowrap",
    textDecorationLine: "none",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    "--oxy-icon-size": fabMenu["--oxy-fab-menu-item-icon-size"],
    transitionProperty: "background-color, color",
    transitionDuration: duration.effectsDefault,
    transitionTimingFunction: easing.effectsDefault,
  },
  itemDisabled: {
    backgroundColor: disabledContainer,
    color: disabledContent,
    cursor: "default",
  },
  icon: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    inlineSize: fabMenu["--oxy-fab-menu-item-icon-size"],
    blockSize: fabMenu["--oxy-fab-menu-item-icon-size"],
  },
});

const fabMenuListStyles = ({ tone: toneName }: FabMenuListVariants) => [
  styles.popover,
  presence.scale,
  tones[toneName],
];

export function FabMenuList<T extends object>({
  placement = "top end",
  offset,
  crossOffset,
  shouldFlip,
  className,
  classNames,
  unstyled,
  ...props
}: FabMenuListProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: fabMenuListVariants, styles: fabMenuListStyles, reset: [] },
  );

  return (
    <Popover
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      shouldFlip={shouldFlip}
      className={styled.className}
    >
      {(state) => <Menu {...props} className={styled.slot("menu", state, [styles.menu])} />}
    </Popover>
  );
}

const fabMenuItemVariants = defineVariants({}, {});

export type FabMenuItemSlot = "stateLayer" | "icon";

export interface FabMenuItemProps<T>
  extends
    Omit<AriaMenuItemProps<T>, "className">,
    StyledProps<MenuItemRenderProps, FabMenuItemSlot> {
  icon?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const fabMenuItemStyles = (_: unknown, { isDisabled }: MenuItemRenderProps) => [
  styles.item,
  focusRing.root,
  isDisabled && styles.itemDisabled,
];

export function FabMenuItem<T extends object>({
  icon,
  className,
  classNames,
  unstyled,
  children,
  ...props
}: FabMenuItemProps<T>) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: fabMenuItemVariants, styles: fabMenuItemStyles, reset: [styles.itemReset] },
  );

  return (
    <AriaMenuItem {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const stateLayerClassName = styled.slot("stateLayer", state, stateLayerStyles(state));
        return (
          <>
            {stateLayerClassName !== undefined && (
              <span aria-hidden data-slot="state-layer" className={stateLayerClassName} />
            )}
            {icon != null && (
              <span
                aria-hidden
                data-slot="icon"
                className={styled.slot("icon", state, [styles.icon])}
              >
                {icon}
              </span>
            )}
            {children}
          </>
        );
      })}
    </AriaMenuItem>
  );
}
