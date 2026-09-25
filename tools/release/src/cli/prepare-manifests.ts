import { writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { publishManifest } from "../manifest.ts";
import { publishablePackages, readWorkspace } from "../workspace.ts";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const workspace = readWorkspace(root);

for (const { dir, manifest } of publishablePackages(workspace)) {
  const file = join(dir, "package.json");
  writeFileSync(file, `${JSON.stringify(publishManifest(manifest, workspace), null, 2)}\n`);
  console.log(`${manifest.name}@${manifest.version}  ${relative(root, file)}`);
}

console.log(
  "\nManifests now point at dist and carry resolved versions; restore them with `git checkout -- packages/*/package.json` when done.",
);
