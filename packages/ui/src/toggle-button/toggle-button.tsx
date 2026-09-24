import { use, type Ref } from "react";
import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  type ToggleButtonRenderProps,
  composeRenderProps,
} from "react-aria-components";
import { ConnectedContext } from "../button/connected.ts";
import { buttonLayers, type ButtonLayerSlot } from "../button/layers.tsx";
import {
  buttonReset,
  buttonStyles,
  buttonVariants,
  type ButtonVariants,
} from "../button/styles.ts";
import { useStyled, type StyledProps } from "../core/styled.ts";

export const toggleButtonVariants = buttonVariants;

export type ToggleButtonVariants = ButtonVariants;
export type ToggleButtonSlot = ButtonLayerSlot;

export interface ToggleButtonProps
  extends
    Omit<AriaToggleButtonProps, "className">,
    StyledProps<ToggleButtonRenderProps, ToggleButtonSlot> {
  ref?: Ref<HTMLButtonElement>;
}

export function ToggleButton({
  className,
  classNames,
  unstyled,
  children,
  ...props
}: ToggleButtonProps) {
  const orientation = use(ConnectedContext);
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: toggleButtonVariants,
      styles: (variants, state: ToggleButtonRenderProps) =>
        buttonStyles(variants, state, orientation),
      reset: [buttonReset.root],
    },
  );

  return (
    <AriaToggleButton {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) =>
        buttonLayers(styled.slot, state, children),
      )}
    </AriaToggleButton>
  );
}
