import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Text } from "react-aria-components";
import { stateLayerStyles, type InteractionState } from "../styles/interaction.ts";
import { GlyphIcon, type Glyph } from "./glyphs.tsx";
import { listParts } from "./list.ts";
import { typeScale } from "./type.ts";

export type ListItemSlot =
  | "stateLayer"
  | "leading"
  | "icon"
  | "content"
  | "label"
  | "description"
  | "trailing"
  | "indicator";

export interface ListItemContentProps {
  icon?: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
}

type SlotResolver<State> = (
  slot: ListItemSlot,
  state: State,
  styles: StyleXStyles,
) => string | undefined;

export interface ListItemLayout {
  leading?: ReactNode;
  startIndicator?: Glyph | null;
  endIndicator?: Glyph | null;
  textSlots: "label" | "description";
}

export function listItemLayers<State extends InteractionState>(
  slot: SlotResolver<State>,
  state: State,
  { icon, description, trailing }: ListItemContentProps,
  { leading, startIndicator, endIndicator, textSlots }: ListItemLayout,
  children: ReactNode,
) {
  const stateLayer = slot("stateLayer", state, stateLayerStyles(state));
  const indicator = (glyph: Glyph | null | undefined) => {
    const className = glyph ? slot("indicator", state, [listParts.indicator]) : undefined;
    return (
      glyph &&
      className !== undefined && (
        <span aria-hidden data-slot="indicator" className={className}>
          <GlyphIcon glyph={glyph} />
        </span>
      )
    );
  };
  const labelClassName = slot("label", state, [listParts.label]);
  const label =
    textSlots === "label" ? (
      <Text slot="label" data-slot="label" className={labelClassName}>
        {children}
      </Text>
    ) : (
      <span data-slot="label" className={labelClassName}>
        {children}
      </span>
    );

  return (
    <>
      {stateLayer !== undefined && (
        <span aria-hidden data-slot="state-layer" className={stateLayer} />
      )}
      {leading != null && (
        <span data-slot="leading" className={slot("leading", state, [listParts.leading])}>
          {leading}
        </span>
      )}
      {indicator(startIndicator)}
      {icon != null && (
        <span aria-hidden data-slot="icon" className={slot("icon", state, [listParts.icon])}>
          {icon}
        </span>
      )}
      {description == null ? (
        label
      ) : (
        <span data-slot="content" className={slot("content", state, [listParts.content])}>
          {label}
          <Text
            slot="description"
            data-slot="description"
            className={slot("description", state, [listParts.description, typeScale.bodyMedium])}
          >
            {description}
          </Text>
        </span>
      )}
      {trailing != null && (
        <span data-slot="trailing" className={slot("trailing", state, [listParts.trailing])}>
          {trailing}
        </span>
      )}
      {indicator(endIndicator)}
    </>
  );
}

export const textValueOf = (textValue: string | undefined, children: unknown) =>
  textValue ?? (typeof children === "string" ? children : undefined);
