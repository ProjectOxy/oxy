import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useUnstyled } from "../provider/context.ts";
import {
  joinClassNames,
  resolveClassName,
  type ClassNameValue,
  type SlotClassNames,
} from "./class-names.ts";
import type { VariantGroups, VariantSelection, Variants } from "./variants.ts";

export interface StyledProps<State, Slot extends string = never> {
  className?: ClassNameValue<State & { defaultClassName: string | undefined }>;
  classNames?: SlotClassNames<Slot, State>;
  unstyled?: boolean;
}

export interface StyledOptions<Groups extends VariantGroups, State> {
  variants: Variants<Groups>;
  styles: (variants: VariantSelection<Groups>, state: State) => StyleXStyles;
  reset: StyleXStyles;
}

export function useStyled<Groups extends VariantGroups, State, Slot extends string = never>(
  { className, classNames, unstyled }: StyledProps<State, Slot>,
  { variants, styles, reset }: StyledOptions<Groups, State>,
) {
  const isUnstyled = useUnstyled(unstyled);

  return {
    className: (state: State & { defaultClassName: string | undefined }) => {
      const own = resolveClassName(className, state);
      if (isUnstyled) return joinClassNames(stylex.props(reset).className, own);
      const parsed = variants.parse(own);
      return joinClassNames(
        stylex.props(styles(parsed.variants, state)).className,
        parsed.className,
      );
    },
    slot: (slot: Slot, state: State, slotStyles: StyleXStyles) => {
      const own = resolveClassName(classNames?.[slot], state);
      if (isUnstyled) return own;
      return joinClassNames(stylex.props(slotStyles).className, own);
    },
  };
}
