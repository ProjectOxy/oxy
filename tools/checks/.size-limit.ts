import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const packagesDir = new URL("../../packages/", import.meta.url);
const peerDependencies = ["react", "react-dom", "@stylexjs/stylex", "motion", "vite-plus"];

function publishedFile(specifier: string) {
  const [scope, name, ...rest] = specifier.split("/");
  const subpath = rest.length ? `./${rest.join("/")}` : ".";
  const packageDir = new URL(`${name}/`, packagesDir);
  const { publishConfig } = JSON.parse(readFileSync(new URL("package.json", packageDir), "utf8"));
  const target = publishConfig.exports[subpath];
  if (!target) throw new Error(`${specifier} is not in publishConfig.exports of ${scope}/${name}`);
  return fileURLToPath(new URL(target, packageDir));
}

const publishedExports = {
  name: "oxy:published-exports",
  resolveId: (source: string) =>
    source.startsWith("@oxy/") ? { id: publishedFile(source), moduleSideEffects: false } : null,
};

const bundle = (name: string, specifier: string, imports: string, limit: string) => ({
  name,
  path: publishedFile(specifier),
  import: imports,
  limit,
  gzip: true,
  ignore: peerDependencies,
  modifyRolldownConfig: (config: Record<string, unknown>) => ({
    ...config,
    plugins: [publishedExports],
  }),
});

const file = (name: string, path: string, limit: string) => ({
  name,
  path,
  limit,
  gzip: true,
  rolldown: false,
});

export default [
  bundle("@oxy/ui: Button from the root entry", "@oxy/ui", "{ Button }", "18 kB"),
  bundle("@oxy/ui/button", "@oxy/ui/button", "{ Button }", "18 kB"),
  bundle("@oxy/ui: every component", "@oxy/ui", "*", "320 kB"),
  bundle("@oxy/tokens", "@oxy/tokens", "*", "7 kB"),
  bundle("@oxy/motion", "@oxy/motion", "*", "6.5 kB"),
  bundle("@oxy/icons: Icon and one symbol", "@oxy/icons", "{ Icon, arrowBack }", "1.5 kB"),
  bundle(
    "@oxy/material-theme: createMaterialTheme",
    "@oxy/material-theme",
    "{ createMaterialTheme }",
    "28 kB",
  ),
  bundle("@oxy/utilities: generateUtilities", "@oxy/utilities", "{ generateUtilities }", "7.5 kB"),
  file("dist/oxy.css", "../../dist/oxy.css", "30 kB"),
  file("@oxy/utilities/utilities.css", "../../packages/utilities/dist/utilities.css", "75 kB"),
];
