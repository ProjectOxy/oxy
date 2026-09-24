#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { scanContent } from "./content.ts";
import { generateUtilities, type UtilitiesConfig } from "./generate.ts";

const { values } = parseArgs({
  options: {
    config: { type: "string", short: "c" },
    content: { type: "string", multiple: true },
    out: { type: "string", short: "o" },
  },
});

const config: UtilitiesConfig = values.config
  ? (await import(pathToFileURL(resolve(values.config)).href)).default
  : {};
const content = values.content ?? config.content;
const css = generateUtilities(config, content && (await scanContent(content)));

if (values.out) await writeFile(values.out, css);
else process.stdout.write(css);
