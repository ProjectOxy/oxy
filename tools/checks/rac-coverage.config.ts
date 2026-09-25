import type { RacCoverageConfig } from "./src/rac-coverage.ts";

export default {
  enforce: true,
  ignore: [
    "Collection",
    "CollectionBuilder",
    "Focusable",
    "I18nProvider",
    "Pressable",
    "Provider",
    "RouterProvider",
    "SSRProvider",
    "Section",
    "SharedElement",
    "SharedElementTransition",
    "Virtualizer",
    "VisuallyHidden",
  ],
  ignorePatterns: [/^UNSTABLE_/],
  pending: [
    "NavigationTree",
    "NavigationTreeHeader",
    "NavigationTreeItem",
    "NavigationTreeItemContent",
    "NavigationTreeSection",
    "Token",
    "TokenField",
    "TokenInput",
  ],
} satisfies RacCoverageConfig;
