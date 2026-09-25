import { appendFile } from "node:fs/promises";
import * as ui from "@oxy/ui";
import * as rac from "react-aria-components";
import config from "../../rac-coverage.config.ts";
import { coverageReport } from "../rac-coverage.ts";

const report = coverageReport(rac, ui, config);
const enforce = config.enforce || process.argv.includes("--strict");
const failed =
  report.missing.length > 0 ||
  report.wrappedButIgnored.length > 0 ||
  report.unknownIgnores.length > 0;

const lines = [
  `React Aria Components coverage: ${report.wrapped.length}/${report.required.length} wrapped by @oxy/ui`,
  ...(report.missing.length
    ? ["", "Missing wrappers:", ...report.missing.map((n) => `- ${n}`)]
    : []),
  ...(report.pending.length
    ? [
        "",
        "Pending wrappers (listed in rac-coverage.config.ts, not enforced yet):",
        ...report.pending.map((n) => `- ${n}`),
      ]
    : []),
  ...(report.wrappedButIgnored.length
    ? [
        "",
        "Wrapped but still ignored or pending (drop from rac-coverage.config.ts):",
        ...report.wrappedButIgnored.map((n) => `- ${n}`),
      ]
    : []),
  ...(report.unknownIgnores.length
    ? [
        "",
        "Ignored names that react-aria-components does not export:",
        ...report.unknownIgnores.map((n) => `- ${n}`),
      ]
    : []),
];

console.log(lines.join("\n"));

const annotation = enforce ? "error" : "warning";
if (report.missing.length) {
  console.log(
    `::${annotation} title=rac-coverage::${report.missing.length} React Aria components have no @oxy/ui wrapper`,
  );
}
if (report.pending.length) {
  console.log(
    `::warning title=rac-coverage::${report.pending.length} React Aria components are pending a wrapper: ${report.pending.join(", ")}`,
  );
}
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    `## React Aria coverage\n\n\`\`\`\n${lines.join("\n")}\n\`\`\`\n`,
  );
}

if (failed && enforce) process.exit(1);
if (!enforce && failed)
  console.log(
    "\nNot enforced yet: set `enforce: true` in tools/checks/rac-coverage.config.ts to fail CI.",
  );
