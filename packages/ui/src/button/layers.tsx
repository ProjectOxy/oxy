import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { stateLayerStyles, touchTarget, type InteractionState } from "../styles/interaction.ts";

export type ButtonLayerSlot = "touchTarget" | "stateLayer";

type SlotResolver<State> = (
  slot: ButtonLayerSlot,
  state: State,
  styles: StyleXStyles,
) => string | undefined;

export function buttonLayers<State extends InteractionState>(
  slot: SlotResolver<State>,
  state: State,
  children: ReactNode,
) {
  const touchTargetClassName = slot("touchTarget", state, [touchTarget.root]);
  const stateLayerClassName = slot("stateLayer", state, stateLayerStyles(state));
  return (
    <>
      {touchTargetClassName !== undefined && (
        <span aria-hidden data-slot="touch-target" className={touchTargetClassName} />
      )}
      {stateLayerClassName !== undefined && (
        <span aria-hidden data-slot="state-layer" className={stateLayerClassName} />
      )}
      {children}
    </>
  );
}
