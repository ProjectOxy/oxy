const componentElementTypes = new Set(["react.forward_ref", "react.memo"]);

export interface RacCoverageConfig {
  enforce: boolean;
  ignore: readonly string[];
  ignorePatterns: readonly RegExp[];
}

export interface RacCoverageReport {
  required: string[];
  wrapped: string[];
  missing: string[];
  wrappedButIgnored: string[];
  unknownIgnores: string[];
}

function isClass(value: Function) {
  return Object.getOwnPropertyNames(value.prototype ?? {}).length > 1;
}

export function isComponentExport(name: string, value: unknown) {
  if (!/^[A-Z]/.test(name) || name.endsWith("Context")) return false;
  if (typeof value === "function") return !isClass(value);
  if (typeof value === "object" && value !== null) {
    const { $$typeof } = value as { $$typeof?: symbol };
    return componentElementTypes.has($$typeof?.description ?? "");
  }
  return false;
}

export function componentNames(moduleExports: Record<string, unknown>) {
  return Object.entries(moduleExports)
    .filter(([name, value]) => isComponentExport(name, value))
    .map(([name]) => name)
    .sort();
}

export function coverageReport(
  racExports: Record<string, unknown>,
  uiExports: Record<string, unknown>,
  { ignore, ignorePatterns }: RacCoverageConfig,
): RacCoverageReport {
  const racComponents = componentNames(racExports);
  const wrappedSet = new Set(componentNames(uiExports));
  const ignored = (name: string) =>
    ignore.includes(name) || ignorePatterns.some((pattern) => pattern.test(name));

  const required = racComponents.filter((name) => !ignored(name));
  return {
    required,
    wrapped: required.filter((name) => wrappedSet.has(name)),
    missing: required.filter((name) => !wrappedSet.has(name)),
    wrappedButIgnored: racComponents.filter((name) => ignored(name) && wrappedSet.has(name)),
    unknownIgnores: ignore.filter((name) => !racComponents.includes(name)),
  };
}
