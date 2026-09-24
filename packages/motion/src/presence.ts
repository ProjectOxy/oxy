import * as stylex from "@stylexjs/stylex";
import { duration, easing } from "./motion.stylex.ts";

const fadeIn = stylex.keyframes({ from: { opacity: 0 } });
const scaleIn = stylex.keyframes({ from: { opacity: 0, transform: "scale(0.8)" } });
const slideIn = stylex.keyframes({ from: { transform: "translateY(100%)" } });

const entering = ":is([data-entering])";
const exiting = ":is([data-exiting])";

export const presence = stylex.create({
  fade: {
    animationName: { default: null, [entering]: fadeIn, [exiting]: fadeIn },
    animationDirection: { default: null, [exiting]: "reverse" },
    animationDuration: {
      default: null,
      [entering]: duration.effectsDefault,
      [exiting]: duration.short3,
    },
    animationTimingFunction: {
      default: null,
      [entering]: easing.effectsDefault,
      [exiting]: easing.standardAccelerate,
    },
  },
  scale: {
    animationName: { default: null, [entering]: scaleIn, [exiting]: scaleIn },
    animationDirection: { default: null, [exiting]: "reverse" },
    animationDuration: {
      default: null,
      [entering]: duration.spatialDefault,
      [exiting]: duration.short4,
    },
    animationTimingFunction: {
      default: null,
      [entering]: easing.spatialDefault,
      [exiting]: easing.emphasizedAccelerate,
    },
  },
  slide: {
    animationName: { default: null, [entering]: slideIn, [exiting]: slideIn },
    animationDirection: { default: null, [exiting]: "reverse" },
    animationDuration: {
      default: null,
      [entering]: duration.spatialDefault,
      [exiting]: duration.short4,
    },
    animationTimingFunction: {
      default: null,
      [entering]: easing.spatialDefault,
      [exiting]: easing.emphasizedAccelerate,
    },
  },
});
