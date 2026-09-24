import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { joinClassNames } from "../core/class-names.ts";
import { useUnstyled } from "../provider/context.ts";

export interface StaticStyledProps {
  className?: string;
  unstyled?: boolean;
}

export function useStaticClassName(
  { className, unstyled }: StaticStyledProps,
  styles: StyleXStyles,
  reset: StyleXStyles = [],
) {
  const isUnstyled = useUnstyled(unstyled);
  return joinClassNames(stylex.props(isUnstyled ? reset : styles).className, className);
}

export function usePartClassName(unstyled: boolean | undefined) {
  const isUnstyled = useUnstyled(unstyled);
  return (styles: StyleXStyles, className: string | undefined) =>
    isUnstyled ? className : joinClassNames(stylex.props(styles).className, className);
}
