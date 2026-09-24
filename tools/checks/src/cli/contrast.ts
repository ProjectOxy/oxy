import { checkContrast } from "@oxy/tokens";
import config from "../../contrast.config.ts";

const results = Object.entries(config.themes).flatMap(([theme, tokens]) =>
  checkContrast(tokens, config.minimumRatio).map((result) => ({ theme, ...result })),
);
const failures = results.filter(({ passes }) => !passes);

for (const { theme, foreground, background, ratio } of failures) {
  const value = Number.isNaN(ratio) ? "unparsable color" : `${ratio.toFixed(2)}:1`;
  console.log(
    `::error title=token-contrast::${theme}: ${foreground} on ${background} is ${value} (minimum ${config.minimumRatio}:1)`,
  );
}

console.log(
  `Contrast: ${results.length - failures.length}/${results.length} on-X/X pairs across ${Object.keys(config.themes).length} theme(s) reach ${config.minimumRatio}:1.`,
);
process.exit(failures.length ? 1 : 0);
