import { plugin } from "bun";

plugin({
  name: "stylex-runtime-stub",
  setup(build) {
    build.module("@stylexjs/stylex", () => ({
      exports: {
        create: (styles: object) => styles,
        createTheme: (_vars: object, overrides: object) => overrides,
        defineVars: (vars: object) => vars,
        defineConsts: (consts: object) => consts,
        defineMarker: () => ({}),
        defaultMarker: () => ({}),
        when: new Proxy(
          {},
          { get: (_, relation) => (pseudo: string) => `${String(relation)}${pseudo}` },
        ),
        keyframes: () => "",
        positionTry: () => "",
        viewTransitionClass: () => "",
        firstThatWorks: (...values: unknown[]) => values,
        props: () => ({}),
        attrs: () => ({}),
        types: new Proxy({}, { get: () => (value: unknown) => value }),
        default: {},
      },
      loader: "object",
    }));
  },
});
