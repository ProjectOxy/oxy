import { buttonGroup } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonGroupRenderProps,
  composeRenderProps,
} from "react-aria-components";
import { ConnectedContext } from "../button/connected.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants, type VariantSelection } from "../core/variants.ts";

export const toggleButtonGroupVariants = defineVariants(
  {
    layout: ["connected", "standard"],
    size: ["xs", "sm", "md", "lg", "xl"],
  },
  { layout: "connected", size: "sm" },
);

export type ToggleButtonGroupVariants = VariantSelection<typeof toggleButtonGroupVariants.groups>;

export interface ToggleButtonGroupProps
  extends Omit<AriaToggleButtonGroupProps, "className">, StyledProps<ToggleButtonGroupRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "inline-flex",
    maxInlineSize: "100%",
  },
  horizontal: {
    flexDirection: "row",
    alignItems: "center",
  },
  vertical: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  connected: {
    gap: buttonGroup["--oxy-button-group-connected-gap"],
  },
});

const standardGaps = stylex.create({
  xs: { gap: buttonGroup["--oxy-button-group-xs-gap"] },
  sm: { gap: buttonGroup["--oxy-button-group-sm-gap"] },
  md: { gap: buttonGroup["--oxy-button-group-md-gap"] },
  lg: { gap: buttonGroup["--oxy-button-group-lg-gap"] },
  xl: { gap: buttonGroup["--oxy-button-group-xl-gap"] },
});

function toggleButtonGroupStyles(
  { layout, size }: ToggleButtonGroupVariants,
  { orientation }: ToggleButtonGroupRenderProps,
) {
  return [
    styles.root,
    styles[orientation],
    layout === "connected" ? styles.connected : standardGaps[size],
  ];
}

export function ToggleButtonGroup({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: ToggleButtonGroupProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: toggleButtonGroupVariants, styles: toggleButtonGroupStyles, reset: [] },
  );

  return (
    <AriaToggleButtonGroup {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <ConnectedContext
          value={styled.variants(state)?.layout === "connected" ? state.orientation : null}
        >
          {children}
        </ConnectedContext>
      ))}
    </AriaToggleButtonGroup>
  );
}
