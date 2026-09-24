import { duration, easing } from "@oxy/motion/motion.stylex";
import { navigationRail } from "@oxy/tokens/component.stylex";
import { color } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, Ref } from "react";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { NavigationContext } from "../navigation-item/context.ts";
import { navigationItem } from "../navigation-item/navigation-item.stylex.ts";

export const navigationRailVariants = defineVariants(
  { variant: ["collapsed", "expanded"] },
  { variant: "collapsed" },
);

export type NavigationRailVariants = VariantSelection<typeof navigationRailVariants.groups>;

export interface NavigationRailProps
  extends Omit<HTMLAttributes<HTMLElement>, "className">, Omit<StyledProps<object>, "className"> {
  className?: string;
  ref?: Ref<HTMLElement>;
}

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: navigationRail["--oxy-navigation-rail-item-gap"],
    blockSize: "100%",
    paddingBlock: navigationRail["--oxy-navigation-rail-padding-block"],
    overflowX: "hidden",
    overflowY: "auto",
    backgroundColor: navigationRail["--oxy-navigation-rail-container-color"],
    color: color["--oxy-color-on-surface-variant"],
    transitionProperty: "inline-size, padding-inline",
    transitionDuration: duration.spatialDefault,
    transitionTimingFunction: easing.spatialDefault,
    [navigationItem.verticalHeight]: navigationRail["--oxy-navigation-rail-item-height"],
    [navigationItem.horizontalHeight]: navigationRail["--oxy-navigation-rail-expanded-item-height"],
  },
  collapsed: {
    alignItems: "center",
    inlineSize: navigationRail["--oxy-navigation-rail-width"],
  },
  expanded: {
    alignItems: "flex-start",
    inlineSize: navigationRail["--oxy-navigation-rail-expanded-width"],
    paddingInline: navigationRail["--oxy-navigation-rail-expanded-padding-inline"],
  },
});

const state = { defaultClassName: undefined };

export function NavigationRail({ className, unstyled, children, ...props }: NavigationRailProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: navigationRailVariants,
      styles: ({ variant }) => [styles.root, styles[variant]],
      reset: [],
    },
  );
  const isExpanded = styled.variants(state)?.variant === "expanded";

  return (
    <nav {...props} className={styled.className(state) || undefined}>
      <UnstyledScope unstyled={unstyled}>
        <NavigationContext
          value={{
            container: "rail",
            layout: isExpanded ? "horizontal" : "vertical",
            labelSize: isExpanded ? "large" : "medium",
          }}
        >
          {children}
        </NavigationContext>
      </UnstyledScope>
    </nav>
  );
}
