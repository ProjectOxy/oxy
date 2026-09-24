import { density as densityToken, touchTarget } from "@oxy/tokens/component.stylex";
import * as stylex from "@stylexjs/stylex";
import { density } from "./vars.stylex.ts";

export const densities = stylex.create({
  comfortable: {
    [density.offset]: "0px",
    [density.touchTarget]: touchTarget["--oxy-touch-target-size"],
  },
  compact: {
    [density.offset]: densityToken["--oxy-density-step"],
    [density.touchTarget]: "0px",
  },
  dense: {
    [density.offset]: `calc(2 * ${densityToken["--oxy-density-step"]})`,
    [density.touchTarget]: "0px",
  },
});
