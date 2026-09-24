import { cssVar } from "@oxy/tokens";

export const motionEnabledVar = cssVar("motion.enabled");
export const motionAllowedVar = cssVar("motion.allowed");
export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function isMotionEnabled(element: Element) {
  const view = element.ownerDocument.defaultView;
  if (!view || view.matchMedia?.(reducedMotionQuery).matches) return false;
  return view.getComputedStyle(element).getPropertyValue(motionEnabledVar).trim() !== "0";
}
