import type { RacCoverageConfig } from "./src/rac-coverage.ts";

export default {
  enforce: false,
  ignore: [
    "Collection",
    "CollectionBuilder",
    "Focusable",
    "Pressable",
    "Provider",
    "RouterProvider",
    "SSRProvider",
    "SharedElement",
    "SharedElementTransition",
    "Virtualizer",
    "VisuallyHidden",
  ],
  ignorePatterns: [/^UNSTABLE_/],
} satisfies RacCoverageConfig;
