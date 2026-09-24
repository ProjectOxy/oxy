import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

const styles = stylex.create({
  root: {
    fontFamily: "Material Symbols Outlined",
    fontSize: "1.5rem",
    lineHeight: 1,
    userSelect: "none",
  },
});

export interface IconProps extends Omit<ComponentProps<"span">, "children"> {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  return (
    <span aria-hidden {...props} {...stylex.props(styles.root)}>
      {name}
    </span>
  );
}
