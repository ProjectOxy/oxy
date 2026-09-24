import { tokens } from "@oxy/tokens";
import { describe, expect, test } from "vite-plus/test";
import { springCurve, springVars } from "../src/index.ts";

const points = (easing: string) => easing.slice("linear(".length, -1).split(", ").map(Number);

describe("springCurve", () => {
  test("turns a spring into a linear() easing that runs from 0 to 1", () => {
    const { duration, easing } = springCurve(tokens.motion.spring.spatial.default);
    const values = points(easing);

    expect(duration).toBe(325);
    expect(values[0]).toBe(0);
    expect(values.at(-1)).toBe(1);
  });

  test("underdamped spatial springs overshoot, critically damped effects springs never do", () => {
    const spatial = points(springCurve(tokens.motion.spring.spatial.fast).easing);
    const effects = points(springCurve(tokens.motion.spring.effects.fast).easing);

    expect(Math.max(...spatial)).toBeGreaterThan(1);
    expect(Math.max(...effects)).toBe(1);
    expect(effects).toEqual(effects.toSorted((a, b) => a - b));
  });

  test("softer springs take longer to settle", () => {
    const { fast, default: standard, slow } = tokens.motion.spring.spatial;
    const durations = [fast, standard, slow].map((spring) => springCurve(spring).duration);
    expect(durations).toEqual(durations.toSorted((a, b) => a - b));
  });

  test("handles overdamped springs and rejects impossible ones", () => {
    const overdamped = points(springCurve({ stiffness: 500, damping: 2 }).easing);
    expect(overdamped).toEqual(overdamped.toSorted((a, b) => a - b));
    expect(() => springCurve({ stiffness: 0, damping: 1 })).toThrow("positive stiffness");
    expect(() => springCurve({ stiffness: 500, damping: "none" })).toThrow("positive stiffness");
  });
});

test("springVars follows spring overrides of a theme", () => {
  const stiff = { ...tokens.motion.spring.spatial, default: { stiffness: "1400", damping: "0.9" } };
  const vars = springVars({ ...tokens.motion.spring, spatial: stiff });

  expect(vars["--oxy-motion-spring-spatial-default-duration"]).toBe(
    vars["--oxy-motion-spring-spatial-fast-duration"],
  );
  expect(vars["--oxy-motion-spring-effects-default-duration"]).toBe("231ms");
});
