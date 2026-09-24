import { navigationBar } from "@oxy/tokens/component.stylex";
import { color } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { HTMLAttributes, Ref } from "react";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants, type VariantSelection } from "../core/variants.ts";
import { NavigationContext } from "../navigation-item/context.ts";
import { navigationItem, windowSize } from "../navigation-item/navigation-item.stylex.ts";

export const navigationBarVariants = defineVariants(
  { layout: ["adaptive", "vertical", "horizontal"] },
  { layout: "adaptive" },
);

export type NavigationBarVariants = VariantSelection<typeof navigationBarVariants.groups>;

export interface NavigationBarProps
  extends Omit<HTMLAttributes<HTMLElement>, "className">, Omit<StyledProps<object>, "className"> {
  className?: string;
  ref?: Ref<HTMLElement>;
}

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    inlineSize: "100%",
    minBlockSize: navigationBar["--oxy-navigation-bar-height"],
    backgroundColor: navigationBar["--oxy-navigation-bar-container-color"],
    color: color["--oxy-color-on-surface-variant"],
    [navigationItem.verticalHeight]: navigationBar["--oxy-navigation-bar-height"],
  },
  vertical: {},
  horizontal: {
    justifyContent: "center",
    gap: navigationBar["--oxy-navigation-bar-horizontal-gap"],
  },
  adaptive: {
    justifyContent: { default: null, [windowSize.medium]: "center" },
    gap: {
      default: null,
      [windowSize.medium]: navigationBar["--oxy-navigation-bar-horizontal-gap"],
    },
  },
});

const state = { defaultClassName: undefined };

export function NavigationBar({ className, unstyled, children, ...props }: NavigationBarProps) {
  const styled = useStyled(
    { className, unstyled },
    {
      variants: navigationBarVariants,
      styles: ({ layout }) => [styles.root, styles[layout]],
      reset: [],
    },
  );
  const layout = styled.variants(state)?.layout ?? "horizontal";

  return (
    <nav {...props} className={styled.className(state) || undefined}>
      <UnstyledScope unstyled={unstyled}>
        <NavigationContext value={{ container: "bar", layout, labelSize: "medium" }}>
          {children}
        </NavigationContext>
      </UnstyledScope>
    </nav>
  );
}
