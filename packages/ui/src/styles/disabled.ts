import { state } from "@oxy/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const disabledColorControl = stylex.create({
  root: {
    opacity: state["--oxy-state-disabled-content"],
    filter: "saturate(0)",
  },
});
