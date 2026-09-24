import { buttonGroup } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  Group,
  type GroupProps,
  type GroupRenderProps,
  composeRenderProps,
} from "react-aria-components";
import { ConnectedContext } from "../button/connected.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { defineVariants } from "../core/variants.ts";
import { useUnstyled } from "../provider/context.ts";

export interface SplitButtonProps
  extends Omit<GroupProps, "className">, StyledProps<GroupRenderProps> {
  ref?: Ref<HTMLDivElement>;
}

const splitButtonVariants = defineVariants({}, {});

const styles = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    gap: buttonGroup["--oxy-button-group-connected-gap"],
  },
});

const splitButtonStyles = () => [styles.root];

export function SplitButton({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: SplitButtonProps) {
  const isUnstyled = useUnstyled(unstyled);
  const styled = useStyled(
    { className, classNames, unstyled: isUnstyled },
    { variants: splitButtonVariants, styles: splitButtonStyles, reset: [] },
  );

  return (
    <Group {...props} className={styled.className}>
      {composeRenderProps(children, (children) => (
        <ConnectedContext value={isUnstyled ? null : "horizontal"}>{children}</ConnectedContext>
      ))}
    </Group>
  );
}
