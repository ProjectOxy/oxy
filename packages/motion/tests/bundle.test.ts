// @vitest-environment node
import { build, type Rolldown } from "vite-plus";
import { expect, test } from "vite-plus/test";

const motionModule =
  /[\\/]node_modules[\\/](?:\.bun[\\/][^\\/]+[\\/]node_modules[\\/])?(?:motion|framer-motion|motion-dom|motion-utils)[\\/]/;

async function bundledModules(entry: string) {
  const output = (await build({
    configFile: false,
    logLevel: "silent",
    build: {
      write: false,
      lib: { entry: new URL(entry, import.meta.url).pathname, formats: ["es"] },
      rollupOptions: { external: [/^@stylexjs\//] },
    },
  })) as Rolldown.RolldownOutput[];
  return output.flatMap(({ output: chunks }) =>
    chunks.flatMap((chunk) => (chunk.type === "chunk" ? chunk.moduleIds : [])),
  );
}

test("Motion stays out of a bundle that imports only the main entry point", async () => {
  const modules = await bundledModules("../src/index.ts");
  expect(modules.some((id) => id.endsWith("/src/spring.ts"))).toBe(true);
  expect(modules.filter((id) => motionModule.test(id))).toEqual([]);
});

test("the gestures entry point brings Motion in", async () => {
  const modules = await bundledModules("../src/gestures.ts");
  expect(modules.some((id) => motionModule.test(id))).toBe(true);
});
