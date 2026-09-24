import * as stylex from "@stylexjs/stylex";
import { useUnstyled } from "../provider/context.ts";
import {
  joinClassNames,
  resolveClassName,
  type ClassNameValue,
  type SlotClassNames,
} from "./class-names.ts";
import type { Part, Styles } from "./parts.ts";
import type { VariantGroups, VariantSelection, Variants } from "./variants.ts";

export interface StyledProps<State, Slot extends string = never> {
  className?: ClassNameValue<State & { defaultClassName: string | undefined }>;
  classNames?: SlotClassNames<Slot, State>;
  unstyled?: boolean;
}

export interface StyledOptions<Groups extends VariantGroups, State> {
  variants: Variants<Groups>;
  styles: (variants: VariantSelection<Groups>, state: State) => Styles;
  reset: Styles;
  part?: Part;
}

export function useStyled<Groups extends VariantGroups, State, Slot extends string = never>(
  { className, classNames, unstyled }: StyledProps<State, Slot>,
  { variants, styles, reset, part }: StyledOptions<Groups, State>,
) {
  const isUnstyled = useUnstyled(unstyled);

  return {
    isUnstyled,
    className: (state: State & { defaultClassName: string | undefined }) => {
      const own = resolveClassName(className, state);
      if (isUnstyled) return joinClassNames(stylex.props(reset).className, part?.className, own);
      const parsed = variants.parse(own);
      return joinClassNames(
        stylex.props(styles(parsed.variants, state), part?.styles).className,
        part?.className,
        parsed.className,
      );
    },
    variants: (state: State) =>
      isUnstyled
        ? undefined
        : variants.parse(resolveClassName(className, { ...state, defaultClassName: undefined }))
            .variants,
    part: (slot: Slot, state: State, partStyles: Styles): Part => ({
      styles: isUnstyled ? undefined : partStyles,
      className: resolveClassName(classNames?.[slot], state),
    }),
    slot: (slot: Slot, state: State, slotStyles: Styles) => {
      const own = resolveClassName(classNames?.[slot], state);
      if (isUnstyled) return own;
      return joinClassNames(stylex.props(slotStyles).className, own);
    },
    slotProps: (slot: Slot, state: State, slotStyles: Styles) => {
      const own = resolveClassName(classNames?.[slot], state);
      if (isUnstyled) return own === undefined ? undefined : { className: own };
      const { className, style } = stylex.props(slotStyles);
      return { className: joinClassNames(className, own), style };
    },
  };
}
