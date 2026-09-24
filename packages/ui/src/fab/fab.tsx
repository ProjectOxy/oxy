import type { Ref } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  type ButtonRenderProps,
  composeRenderProps,
} from "react-aria-components";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { stateLayerStyles } from "../styles/interaction.ts";
import { fabReset, fabStyles, fabVariants } from "./styles.ts";

export { fabVariants, type FabVariants } from "./styles.ts";

export type FabSlot = "stateLayer";

export interface FabProps
  extends Omit<AriaButtonProps, "className">, StyledProps<ButtonRenderProps, FabSlot> {
  ref?: Ref<HTMLButtonElement>;
}

export function Fab({ className, classNames, unstyled, children, ...props }: FabProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    { variants: fabVariants, styles: fabStyles, reset: [fabReset.root] },
  );

  return (
    <AriaButton {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => {
        const stateLayerClassName = styled.slot("stateLayer", state, stateLayerStyles(state));
        return (
          <>
            {stateLayerClassName !== undefined && (
              <span aria-hidden data-slot="state-layer" className={stateLayerClassName} />
            )}
            {children}
          </>
        );
      })}
    </AriaButton>
  );
}
