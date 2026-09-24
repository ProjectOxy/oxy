import { execFile } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterAll, expect, test } from "vite-plus/test";
import { build } from "vite-plus";
import { oxyUtilities, utilitiesModuleId } from "../src/vite.ts";

const app = join(import.meta.dirname, "fixtures/app");
const cli = join(import.meta.dirname, "../src/cli.ts");
const outDir = await mkdtemp(join(tmpdir(), "oxy-utilities-"));

afterAll(() => rm(outDir, { recursive: true, force: true }));

const usedRules = [
  ".bg-brand{background-color:var(--oxy-color-brand)}",
  ".text-on-primary{color:var(--oxy-color-on-primary)}",
  ".hover\\:bg-primary[data-hovered]{background-color:var(--oxy-color-primary)}",
  ".medium\\:px-lg{padding-inline:var(--oxy-space-lg)}",
];

test("the CLI turns a config with a custom token into a CSS file of the used classes", async () => {
  const out = join(outDir, "utilities.css");
  await promisify(execFile)("node", [cli, "--config", "oxy.utilities.config.ts", "--out", out], {
    cwd: app,
  });
  const css = await readFile(out, "utf8");

  expect(css).toContain(":root{--oxy-color-brand:#ff0066}");
  for (const rule of usedRules) expect(css).toContain(rule);
  expect(css).not.toContain(".bg-secondary{");
});

test("the Vite plugin serves the utility layer as a virtual CSS module", async () => {
  const { default: config } = await import("./fixtures/app/oxy.utilities.config.ts");
  const plugin = oxyUtilities({ tokens: config.tokens });
  const id = plugin.resolveId(utilitiesModuleId) as string;

  plugin.configResolved({ root: app, command: "serve" });
  const css = await plugin.load(id);

  expect(plugin.resolveId("other.css")).toBeUndefined();
  expect(css).toContain(".bg-brand{background-color:var(--oxy-color-brand)}");
  expect(css).toContain(".bg-secondary{background-color:var(--oxy-color-secondary)}");
});

test("a Vite build with content keeps only the classes the app uses", async () => {
  const { default: config } = await import("./fixtures/app/oxy.utilities.config.ts");
  await build({
    root: app,
    logLevel: "silent",
    plugins: [oxyUtilities(config)],
    build: {
      outDir,
      emptyOutDir: false,
      minify: false,
      rollupOptions: { input: join(app, "src/main.ts") },
    },
  });
  const [asset] = (await readdir(join(outDir, "assets"))).filter((file) => file.endsWith(".css"));
  const css = (await readFile(join(outDir, "assets", asset as string), "utf8")).replace(/\s/g, "");

  for (const rule of usedRules) expect(css).toContain(rule.replace(/\s/g, ""));
  expect(css).not.toContain(".bg-secondary");
});
