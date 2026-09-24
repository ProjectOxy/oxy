import { duration, easing } from "@oxy/motion/motion.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode, Ref } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  type ButtonRenderProps,
  composeRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { useUnstyled } from "../provider/context.ts";
import { stateLayerStyles } from "../styles/interaction.ts";
import { fabSize } from "./fab.stylex.ts";
import { fabIcon, fabReset, fabStyles, fabVariants } from "./styles.ts";

export const extendedFabVariants = defineVariants(
  { ...fabVariants.groups, layout: ["extended", "collapsed"] },
  { ...fabVariants.defaults, layout: "extended" },
);

export type ExtendedFabVariants = VariantSelection<typeof extendedFabVariants.groups>;
export type ExtendedFabSlot = "stateLayer" | "icon" | "label";

export interface ExtendedFabProps
  extends Omit<AriaButtonProps, "className">, StyledProps<ButtonRenderProps, ExtendedFabSlot> {
  icon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

const spatial = {
  transitionDuration: duration.spatialDefault,
  transitionTimingFunction: easing.spatialDefault,
};

const styles = stylex.create({
  extended: {
    paddingInline: fabSize.paddingInline,
  },
  collapsed: {
    paddingInline: `calc((${fabSize.height} - ${fabSize.iconSize}) / 2)`,
  },
  label: {
    display: "grid",
    gridTemplateColumns: "1fr",
    marginInlineStart: fabSize.gap,
    transitionProperty: "grid-template-columns, margin-inline-start, opacity",
    ...spatial,
  },
  labelWithoutIcon: {
    marginInlineStart: 0,
  },
  labelCollapsed: {
    gridTemplateColumns: "0fr",
    marginInlineStart: 0,
    opacity: 0,
  },
  labelText: {
    minInlineSize: 0,
    overflow: "hidden",
  },
});

function extendedFabStyles(variants: ExtendedFabVariants, state: ButtonRenderProps) {
  return [fabStyles(variants, state), styles[variants.layout]];
}

export function ExtendedFab({
  icon,
  className,
  classNames,
  unstyled,
  children,
  ...props
}: ExtendedFabProps) {
  const isUnstyled = useUnstyled(unstyled);
  const styled = useStyled(
    { className, classNames, unstyled: isUnstyled },
    { variants: extendedFabVariants, styles: extendedFabStyles, reset: [fabReset.root] },
  );

  return (
    <AriaButton {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const isCollapsed = styled.variants(state)?.layout === "collapsed";
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
                className={styled.slot("icon", state, [fabIcon.root])}
              >
                {icon}
              </span>
            )}
            <span
              data-slot="label"
              className={styled.slot("label", state, [
                styles.label,
                icon == null && styles.labelWithoutIcon,
                isCollapsed && styles.labelCollapsed,
              ])}
            >
              {isUnstyled ? children : <span {...stylex.props(styles.labelText)}>{children}</span>}
            </span>
          </>
        );
      })}
    </AriaButton>
  );
}
