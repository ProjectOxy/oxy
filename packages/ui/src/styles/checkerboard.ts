import { colorChecker } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";

export const checkerboard = stylex.create({
  fill: {
    backgroundImage: `linear-gradient(currentColor, currentColor), repeating-conic-gradient(${colorChecker["--oxy-color-checker-color"]} 0% 25%, ${colorChecker["--oxy-color-checker-background"]} 0% 50%)`,
    backgroundSize: `auto, ${colorChecker["--oxy-color-checker-size"]} ${colorChecker["--oxy-color-checker-size"]}`,
    backgroundPosition: "center",
  },
  underlay: {
    "::before": {
      content: "''",
      position: "absolute",
      inset: 0,
      zIndex: -1,
      borderRadius: "inherit",
      backgroundImage: `repeating-conic-gradient(${colorChecker["--oxy-color-checker-color"]} 0% 25%, ${colorChecker["--oxy-color-checker-background"]} 0% 50%)`,
      backgroundSize: `${colorChecker["--oxy-color-checker-size"]} ${colorChecker["--oxy-color-checker-size"]}`,
      backgroundPosition: "center",
    },
  },
});
