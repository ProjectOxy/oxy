import * as stylex from "@stylexjs/stylex";
import { button } from "@oxy/tokens/component.stylex";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from "react-aria-components";

const styles = stylex.create({
  root: {
    minBlockSize: button["--oxy-button-height"],
    paddingInline: button["--oxy-button-padding-inline"],
    borderRadius: button["--oxy-button-radius"],
    borderWidth: 0,
    backgroundColor: button["--oxy-button-container-color"],
    color: button["--oxy-button-label-color"],
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
