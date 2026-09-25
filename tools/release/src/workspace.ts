import { existsSync, globSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Manifest, WorkspaceCatalogs } from "./manifest.ts";

interface RootManifest extends Manifest {
  workspaces?: string[];
  catalog?: Record<string, string>;
  catalogs?: Record<string, Record<string, string>>;
}

export interface WorkspacePackage {
  dir: string;
  manifest: Manifest;
}

export interface Workspace extends WorkspaceCatalogs {
  root: string;
  packages: WorkspacePackage[];
}

const readManifest = <T extends Manifest>(dir: string) =>
  JSON.parse(readFileSync(join(dir, "package.json"), "utf8")) as T;

export function readWorkspace(root: string): Workspace {
  const rootManifest = readManifest<RootManifest>(root);
  const packages = globSync(rootManifest.workspaces ?? [], { cwd: root })
    .sort()
    .map((pattern) => join(root, pattern))
    .filter((dir) => existsSync(join(dir, "package.json")))
    .map((dir) => ({ dir, manifest: readManifest(dir) }));
  return {
    root,
    packages,
    versions: Object.fromEntries(packages.map((p) => [p.manifest.name, p.manifest.version])),
    catalog: rootManifest.catalog ?? {},
    catalogs: rootManifest.catalogs ?? {},
  };
}

export const publishablePackages = (workspace: Workspace) =>
  workspace.packages.filter((p) => !p.manifest.private);
