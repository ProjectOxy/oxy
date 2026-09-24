import { cssVar, tokens } from "@oxy/tokens";
import { animate, type AnimationOptions, type DOMKeyframesDefinition } from "motion";
import { isMotionEnabled } from "./preference.ts";
import type { SpringFamily, SpringSpeed } from "./spring.ts";

export type SpringAnimationOptions = AnimationOptions & {
  family?: SpringFamily;
  speed?: SpringSpeed;
};

export function springTransition(
  element: Element,
  family: SpringFamily = "spatial",
  speed: SpringSpeed = "default",
): AnimationOptions {
  if (!isMotionEnabled(element)) return { duration: 0 };
  const style = getComputedStyle(element);
  const read = (part: "stiffness" | "damping") =>
    Number(
      style.getPropertyValue(cssVar(`motion.spring.${family}.${speed}.${part}`)).trim() ||
        tokens.motion.spring[family][speed][part],
    );
  const stiffness = read("stiffness");
  return {
    type: "spring",
    stiffness,
    damping: read("damping") * 2 * Math.sqrt(stiffness),
    mass: 1,
  };
}

export function animateSpring(
  element: HTMLElement | SVGElement,
  keyframes: DOMKeyframesDefinition,
  { family, speed, ...options }: SpringAnimationOptions = {},
) {
  return animate(element, keyframes, { ...options, ...springTransition(element, family, speed) });
}
