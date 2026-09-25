export interface Manifest {
  name: string;
  version: string;
  private?: boolean;
  publishConfig?: Record<string, unknown>;
  [field: string]: unknown;
}

export interface WorkspaceCatalogs {
  versions: Record<string, string>;
  catalog: Record<string, string>;
  catalogs: Record<string, Record<string, string>>;
}

const dependencyFields = [
  "dependencies",
  "peerDependencies",
  "optionalDependencies",
  "devDependencies",
] as const;

const registrySettings = ["access", "tag", "registry", "provenance", "directory", "linkDirectory"];

const isRegistrySetting = (key: string) =>
  registrySettings.includes(key) || key.endsWith(":registry");

export function resolveRange(name: string, range: string, workspace: WorkspaceCatalogs): string {
  if (range.startsWith("workspace:")) {
    const version = workspace.versions[name];
    if (!version) throw new Error(`${name} is not a workspace package`);
    const spec = range.slice("workspace:".length);
    if (spec === "*") return version;
    return spec === "^" || spec === "~" ? `${spec}${version}` : spec;
  }
  if (range.startsWith("catalog:")) {
    const catalogName = range.slice("catalog:".length);
    const catalog = catalogName ? workspace.catalogs[catalogName] : workspace.catalog;
    const version = catalog?.[name];
    if (!version)
      throw new Error(`${name} is missing from the ${catalogName || "default"} catalog`);
    return version;
  }
  return range;
}

export function publishManifest(manifest: Manifest, workspace: WorkspaceCatalogs): Manifest {
  const { publishConfig = {}, ...fields } = manifest;
  const entries = Object.entries(publishConfig);
  const overrides = entries.filter(([key]) => !isRegistrySetting(key));
  const settings = entries.filter(([key]) => isRegistrySetting(key));
  const published: Manifest = { ...fields, ...Object.fromEntries(overrides) };
  for (const field of dependencyFields) {
    const ranges = manifest[field] as Record<string, string> | undefined;
    if (!ranges) continue;
    published[field] = Object.fromEntries(
      Object.entries(ranges).map(([name, range]) => [name, resolveRange(name, range, workspace)]),
    );
  }
  if (settings.length) published.publishConfig = Object.fromEntries(settings);
  return published;
}
