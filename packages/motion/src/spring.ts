import { cssVar, type CssVar, tokens, type Tokens } from "@oxy/tokens";

export type SpringTokens = Tokens["motion"]["spring"];
export type SpringFamily = keyof SpringTokens;
export type SpringSpeed = keyof SpringTokens[SpringFamily];

export interface Spring {
  readonly stiffness: string | number;
  readonly damping: string | number;
}

export interface SpringCurve {
  readonly duration: number;
  readonly easing: string;
}

const settleThreshold = 0.001;
const sampleStep = 0.01;

export const springFamilies = Object.keys(tokens.motion.spring) as SpringFamily[];
export const springSpeeds = Object.keys(tokens.motion.spring.spatial) as SpringSpeed[];

function springPosition(omega: number, ratio: number): (time: number) => number {
  const decay = ratio * omega;
  if (ratio === 1) return (time) => 1 - (1 + omega * time) * Math.exp(-omega * time);
  if (ratio < 1) {
    const frequency = omega * Math.sqrt(1 - ratio ** 2);
    return (time) =>
      1 -
      Math.exp(-decay * time) *
        (Math.cos(frequency * time) + (decay / frequency) * Math.sin(frequency * time));
  }
  const rate = omega * Math.sqrt(ratio ** 2 - 1);
  return (time) =>
    1 -
    Math.exp(-decay * time) * (Math.cosh(rate * time) + (decay / rate) * Math.sinh(rate * time));
}

function settleTime(omega: number, ratio: number, position: (time: number) => number) {
  if (ratio < 1)
    return Math.log(1 / (settleThreshold * Math.sqrt(1 - ratio ** 2))) / (ratio * omega);
  let time = 0;
  while (1 - position(time) >= settleThreshold) time += sampleStep / 10;
  return time;
}

export function springCurve({ stiffness, damping }: Spring): SpringCurve {
  const omega = Math.sqrt(Number(stiffness));
  const ratio = Number(damping);
  if (!(omega > 0) || !(ratio > 0))
    throw new Error(`Spring needs positive stiffness and damping, got ${stiffness} / ${damping}`);

  const position = springPosition(omega, ratio);
  const settle = settleTime(omega, ratio, position);
  const samples = Math.max(2, Math.ceil(settle / sampleStep));
  const points = Array.from({ length: samples }, (_, i) =>
    Number(position((settle * i) / samples).toFixed(4)),
  );
  return { duration: Math.round(settle * 1000), easing: `linear(${[...points, 1].join(", ")})` };
}

export const springVar = (family: SpringFamily, speed: SpringSpeed, part: keyof SpringCurve) =>
  cssVar(`motion.spring.${family}.${speed}.${part}`);

export function springVars(springs: SpringTokens = tokens.motion.spring) {
  const vars: Record<CssVar, string> = {};
  for (const family of springFamilies) {
    for (const speed of springSpeeds) {
      const { duration, easing } = springCurve(springs[family][speed]);
      vars[springVar(family, speed, "duration")] = `${duration}ms`;
      vars[springVar(family, speed, "easing")] = easing;
    }
  }
  return vars;
}
