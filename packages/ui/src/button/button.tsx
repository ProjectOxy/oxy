import { use, type Ref } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  type ButtonRenderProps,
  composeRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { ConnectedContext } from "./connected.ts";
import { buttonLayers, type ButtonLayerSlot } from "./layers.tsx";
import { buttonReset, buttonStyles, buttonVariants } from "./styles.ts";

export { buttonVariants, type ButtonVariants } from "./styles.ts";

export type ButtonSlot = ButtonLayerSlot;

export interface ButtonProps
  extends Omit<AriaButtonProps, "className">, StyledProps<ButtonRenderProps, ButtonSlot> {
  ref?: Ref<HTMLButtonElement>;
}

export function Button({ className, classNames, unstyled, children, ...props }: ButtonProps) {
  const orientation = use(ConnectedContext);
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: buttonVariants,
      styles: (variants, state: ButtonRenderProps) => buttonStyles(variants, state, orientation),
      reset: [buttonReset.root],
    },
  );

  return (
    <AriaButton {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) =>
        buttonLayers(styled.slot, state, children),
      )}
    </AriaButton>
  );
}
