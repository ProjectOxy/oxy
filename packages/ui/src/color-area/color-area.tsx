import { colorArea } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";
import type { Ref } from "react";
import {
  ColorArea as AriaColorArea,
  composeRenderProps,
  type ColorAreaProps as AriaColorAreaProps,
  type ColorAreaRenderProps,
} from "react-aria-components";
import { ColorThumbPartContext } from "../color-thumb/color-thumb.tsx";
import { useStyled, type StyledProps } from "../core/styled.ts";
import { UnstyledScope } from "../core/unstyled-scope.tsx";
import { defineVariants } from "../core/variants.ts";
import { disabledColorControl } from "../styles/disabled.ts";

export const colorAreaVariants = defineVariants({}, {});

export type ColorAreaSlot = "thumb";

export interface ColorAreaProps
  extends Omit<AriaColorAreaProps, "className">, StyledProps<ColorAreaRenderProps, ColorAreaSlot> {
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  root: {
    flexShrink: 0,
    inlineSize: colorArea["--oxy-color-area-size"],
    maxInlineSize: "100%",
    aspectRatio: "1",
    borderRadius: colorArea["--oxy-color-area-radius"],
  },
});

export function ColorArea({ className, classNames, unstyled, children, ...props }: ColorAreaProps) {
  const styled = useStyled(
    { className, classNames, unstyled },
    {
      variants: colorAreaVariants,
      styles: (_, { isDisabled }) => [styles.root, isDisabled && disabledColorControl.root],
      reset: [],
    },
  );

  return (
    <AriaColorArea {...props} className={styled.className}>
      {composeRenderProps(children, (children, state) => (
        <UnstyledScope unstyled={unstyled}>
          <ColorThumbPartContext value={styled.part("thumb", state, [])}>
            {children}
          </ColorThumbPartContext>
        </UnstyledScope>
      ))}
    </AriaColorArea>
  );
}
