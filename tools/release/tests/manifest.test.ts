import { fileURLToPath } from "node:url";
import { expect, test } from "vite-plus/test";
import { publishManifest, resolveRange } from "../src/manifest.ts";
import { publishablePackages, readWorkspace } from "../src/workspace.ts";

const catalogs = {
  versions: { "@oxy/tokens": "0.1.0" },
  catalog: { react: "^19.3.0" },
  catalogs: { next: { react: "^20.0.0" } },
};

test("resolves workspace and catalog ranges the way bun publish does", () => {
  expect(resolveRange("@oxy/tokens", "workspace:*", catalogs)).toBe("0.1.0");
  expect(resolveRange("@oxy/tokens", "workspace:^", catalogs)).toBe("^0.1.0");
  expect(resolveRange("@oxy/tokens", "workspace:~", catalogs)).toBe("~0.1.0");
  expect(resolveRange("@oxy/tokens", "workspace:0.0.1", catalogs)).toBe("0.0.1");
  expect(resolveRange("react", "catalog:", catalogs)).toBe("^19.3.0");
  expect(resolveRange("react", "catalog:next", catalogs)).toBe("^20.0.0");
  expect(resolveRange("react", "^18.0.0", catalogs)).toBe("^18.0.0");
  expect(() => resolveRange("@oxy/nope", "workspace:*", catalogs)).toThrow("not a workspace");
  expect(() => resolveRange("react", "catalog:missing", catalogs)).toThrow("missing catalog");
});

test("lifts publishConfig overrides to the top level and keeps the registry settings", () => {
  const published = publishManifest(
    {
      name: "@oxy/example",
      version: "0.1.0",
      files: ["dist"],
      exports: { ".": "./src/index.ts", "./package.json": "./package.json" },
      bin: { example: "./src/cli.ts" },
      publishConfig: {
        bin: { example: "./dist/cli.js" },
        exports: { ".": "./dist/index.js", "./package.json": "./package.json" },
        access: "public",
        "@oxy:registry": "https://npm.example.com",
      },
      dependencies: { "@oxy/tokens": "workspace:*" },
      peerDependencies: { react: "catalog:" },
    },
    catalogs,
  );

  expect(published).toEqual({
    name: "@oxy/example",
    version: "0.1.0",
    files: ["dist"],
    exports: { ".": "./dist/index.js", "./package.json": "./package.json" },
    bin: { example: "./dist/cli.js" },
    dependencies: { "@oxy/tokens": "0.1.0" },
    peerDependencies: { react: "^19.3.0" },
    publishConfig: { access: "public", "@oxy:registry": "https://npm.example.com" },
  });
  expect(Object.keys(published).slice(0, 5)).toEqual([
    "name",
    "version",
    "files",
    "exports",
    "bin",
  ]);
});

test("leaves a manifest without publishConfig or protocols untouched", () => {
  const manifest = { name: "plain", version: "1.0.0", dependencies: { react: "^19.0.0" } };
  expect(publishManifest(manifest, catalogs)).toEqual(manifest);
});

test("every publishable @oxy package ships dist entries with resolved ranges", () => {
  const workspace = readWorkspace(fileURLToPath(new URL("../../../", import.meta.url)));
  const packages = publishablePackages(workspace);

  expect(packages.map((p) => p.manifest.name).sort()).toEqual([
    "@oxy/icons",
    "@oxy/material-theme",
    "@oxy/motion",
    "@oxy/tokens",
    "@oxy/ui",
    "@oxy/utilities",
  ]);

  for (const { manifest } of packages) {
    const published = publishManifest(manifest, workspace);
    const ranges = Object.values({
      ...(published.dependencies as object),
      ...(published.peerDependencies as object),
      ...(published.optionalDependencies as object),
      ...(published.devDependencies as object),
    }) as string[];
    expect(ranges.filter((range) => /^(workspace|catalog):/.test(range))).toEqual([]);

    const targets = [
      ...Object.values(published.exports as Record<string, string>),
      ...Object.values((published.bin ?? {}) as Record<string, string>),
    ];
    expect(targets.filter((t) => t !== "./package.json" && !t.startsWith("./dist/"))).toEqual([]);
    expect(published.files).toEqual(["dist"]);
    expect(published.publishConfig).toEqual({ access: "public" });
  }
});
