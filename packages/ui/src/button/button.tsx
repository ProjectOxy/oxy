import * as stylex from "@stylexjs/stylex";
import { color } from "@oxy/tokens/color.stylex";
import { shape } from "@oxy/tokens/shape.stylex";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from "react-aria-components";

const styles = stylex.create({
  root: {
    minBlockSize: 40,
    paddingInline: 24,
    borderRadius: shape["--oxy-shape-full"],
    borderWidth: 0,
    backgroundColor: color["--oxy-color-primary"],
    color: color["--oxy-color-on-primary"],
    cursor: "pointer",
  },
});

export type ButtonProps = AriaButtonProps;

export function Button({ className, ...props }: ButtonProps) {
  const { className: base = "" } = stylex.props(styles.root);
  return (
    <AriaButton
      {...props}
      className={composeRenderProps(className, (own) => (own ? `${base} ${own}` : base))}
    />
  );
}
